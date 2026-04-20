/**
 * 
 */
package com.pms.paymenttype.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.floor.entity.Floor;
import com.pms.paymenttype.entity.PaymentType;
import com.pms.paymenttype.repository.PaymentTypeRepository;
import com.pms.paymenttype.service.IPaymentTypeService;
import com.pms.search.specification.FloorSpecification;
import com.pms.search.specification.PaymentTypeSpecification;
import com.pms.security.configuration.HotelContext;

/**
 * 
 */
@Service
public class PaymentTypeServiceImpl implements IPaymentTypeService {

	static final Logger logger = LoggerFactory.getLogger(PaymentTypeServiceImpl.class);

	@Autowired
	private PaymentTypeRepository paymentTypeRepository;

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

	public PaymentType getPaymentTypeById(Integer id) {

		return paymentTypeRepository.findByIdAndHotelId(id, HotelContext.getHotelId());

	}

	public PaymentType createPaymentType(PaymentType paymentType) {
		return paymentTypeRepository.saveAndFlush(paymentType);
	}

	public PaymentType updatePaymentType(int paymentTypeId, PaymentType paymentType) {

		PaymentType paymentTypeFromDB = getPaymentTypeById(paymentTypeId);
		paymentTypeFromDB.setCategoryName(paymentType.getCategoryName());
		paymentTypeFromDB.setCreatedOn(paymentType.getCreatedOn());
		paymentTypeFromDB.setDescription(paymentType.getDescription());
		paymentTypeFromDB.setId(paymentTypeId);
		paymentTypeFromDB.setCreditCardProcessing(paymentType.isCreditCardProcessing());
		paymentTypeFromDB.setPaymentTypeShortName(paymentType.getPaymentTypeShortName());
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
	public boolean deletePaymentType(int paymentTypeId) {
		PaymentType paymentType = paymentTypeRepository.findByIdAndHotelId(paymentTypeId, HotelContext.getHotelId());
		boolean isDeleted = true;
		if (paymentType == null) {
			isDeleted = false;
			throw new RuntimeException("paymentType not found");
		}
		paymentTypeRepository.delete(paymentType);
		return isDeleted;
	}
}
