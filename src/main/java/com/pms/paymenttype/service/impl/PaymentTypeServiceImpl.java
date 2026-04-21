/**
 * 
 */
package com.pms.paymenttype.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.common.service.SoftDeleteService;
import com.pms.paymenttype.entity.PaymentType;
import com.pms.paymenttype.repository.PaymentTypeRepository;
import com.pms.paymenttype.service.IPaymentTypeService;
import com.pms.search.specification.PaymentTypeSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;

/**
 * 
 */
@Service
public class PaymentTypeServiceImpl implements IPaymentTypeService {

	static final Logger logger = LoggerFactory.getLogger(PaymentTypeServiceImpl.class);

	@Autowired
	private PaymentTypeRepository paymentTypeRepository;
	@Autowired
	private SoftDeleteService softDeleteService;

	public PaymentTypeServiceImpl(PaymentTypeRepository paymentTypeRepository) {
		super();
	}

	public List<PaymentType> getPaymentTypes() {
		Long hotelId = HotelContext.getHotelId();

		if (hotelId == null) {
			throw new RuntimeException("Hotel not selected");
		}
		return paymentTypeRepository.findByHotelId(HotelContext.getHotelId());
	}

	public PaymentType getPaymentTypeById(Long id) {

		return paymentTypeRepository.findByIdAndHotelId(id, HotelContext.getHotelId());

	}

	public PaymentType createPaymentType(PaymentType paymentType) {
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    paymentType.setCreatedBy(userId);
		return paymentTypeRepository.saveAndFlush(paymentType);
	}

	public PaymentType updatePaymentType(Long paymentTypeId, PaymentType paymentType) {

		PaymentType paymentTypeFromDB = getPaymentTypeById(paymentTypeId);
		paymentTypeFromDB.setCategoryName(paymentType.getCategoryName());
		paymentTypeFromDB.setCreatedOn(paymentType.getCreatedOn());
		paymentTypeFromDB.setDescription(paymentType.getDescription());
		paymentTypeFromDB.setId(paymentTypeId);
		paymentTypeFromDB.setCreditCardProcessing(paymentType.isCreditCardProcessing());
		paymentTypeFromDB.setPaymentTypeShortName(paymentType.getPaymentTypeShortName());
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    paymentTypeFromDB.setUpdatedBy(userId);
	    paymentTypeFromDB.setUpdatedOn(LocalDateTime.now());
		paymentTypeRepository.saveAndFlush(paymentTypeFromDB);
		PaymentType updatedPaymentType = getPaymentTypeById(paymentTypeId);
		return updatedPaymentType;
	}

	@Override
	public List<PaymentType> search(String paymentTypeName, String paymentTypeShortName, String categoryName,
			String description) {

		Specification<PaymentType> spec = Specification
				.where(PaymentTypeSpecification.hasHotelId(HotelContext.getHotelId())) // ✅ ADD THIS
				.and(PaymentTypeSpecification.hasCategoryName(categoryName))
				.and(PaymentTypeSpecification.hasDescription(description))
				.and(PaymentTypeSpecification.hasPaymentTypeName(paymentTypeName))
				.and(PaymentTypeSpecification.hasPaymentTypeShortName(paymentTypeShortName));
		return paymentTypeRepository.findAll(spec);
	}

	@Override
	public boolean deletePaymentType(Integer paymentTypeId) {
		softDeleteService.softDelete(paymentTypeId, paymentTypeRepository);
		return true;
	}
}
