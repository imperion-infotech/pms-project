/**
 * 
 */
package com.pms.paymentdetails.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.common.service.SoftDeleteService;
import com.pms.floor.entity.Floor;
import com.pms.paymentdetails.entity.PaymentDetails;
import com.pms.paymentdetails.entity.PaymentDetailsResponseDTO;
import com.pms.paymentdetails.repository.PaymentDetailsRepository;
import com.pms.paymentdetails.service.IPaymentDetailsService;
import com.pms.paymenttype.entity.PaymentType;
import com.pms.paymenttype.repository.PaymentTypeRepository;
import com.pms.paymenttype.service.IPaymentTypeService;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;

/**
 * 
 */

@Service
public class PaymentDetailsServiceImpl implements IPaymentDetailsService{
	
	static final Logger logger = LoggerFactory.getLogger(PaymentDetailsServiceImpl.class);
	
	@Autowired
	private PaymentDetailsRepository paymentDetailsRepository;
	
	@Autowired
	private PaymentTypeRepository paymentTypeRepository;
	
	@Autowired
	private IPaymentTypeService service;
	
	@Autowired
	private SoftDeleteService  softDeleteService;
	
	

	public PaymentDetailsServiceImpl(PaymentDetailsRepository paymentDetailsRepository,PaymentTypeRepository paymentTypeRepository) {
		super();
		paymentDetailsRepository = paymentDetailsRepository;
		paymentTypeRepository = paymentTypeRepository;
	}

	@Override
	public List<PaymentDetails> getAllPaymentDetails() {
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return paymentDetailsRepository.findByHotelId(HotelContext.getHotelId());
	}
	
	@Override
	public PaymentDetails getPaymentDetailsById(Long id) {
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		
		PaymentDetails details = paymentDetailsRepository.findByIdAndHotelId(id,hotelId);
		
		PaymentType type =service.getPaymentTypeById( details.getPaymentType() != null 
		        ? details.getPaymentType().getId()
		                : null);
		if(type != null )
		{
		details.setPaymentType(type);
		}
		return details;
	}

	@Override
	public PaymentDetails createPaymentDetails(PaymentDetails paymentDetails) {
		paymentDetails.setPaymentType(paymentDetails.getPaymentType());
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
		paymentDetails.setCreatedBy(userId);
		return paymentDetailsRepository.save(paymentDetails);
	}

	@Override
	public PaymentDetails updatePaymentDetails(Long paymentDetailsId, PaymentDetails paymentDetails) {
		PaymentDetails paymentDetailsFromDB = getPaymentDetailsById(paymentDetailsId);
		paymentDetailsFromDB.setAuthorizationNo(paymentDetails.getAuthorizationNo());
		paymentDetailsFromDB.setAmount(paymentDetails.getAmount());
		paymentDetailsFromDB.setCardNo(paymentDetails.getCardNo());
		paymentDetailsFromDB.setCurrencySymbol(paymentDetails.getCurrencySymbol());
		paymentDetailsFromDB.setPaymentType(paymentDetails.getPaymentType());
//		paymentDetailsFromDB.setPaymentTypesId(paymentDetails.getPaymentTypesId());
		paymentDetailsFromDB.setReceiptNo(paymentDetails.getReceiptNo());
		paymentDetailsFromDB.setRemark(paymentDetails.getRemark());
		paymentDetailsFromDB.setValidTill(paymentDetails.getValidTill());
		paymentDetailsFromDB.setPaymentDate(paymentDetails.getPaymentDate());
		paymentDetailsFromDB.setTotalAmount(paymentDetails.getTotalAmount());
		
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    paymentDetailsFromDB.setUpdatedBy(userId);
	    paymentDetailsFromDB.setUpdatedOn(LocalDateTime.now());
		
		paymentDetailsRepository.saveAndFlush(paymentDetailsFromDB);
		PaymentDetails updatedPaymentDetails = getPaymentDetailsById(paymentDetailsId);
		return updatedPaymentDetails;
	}

	@Override
	public boolean deletePaymentDetails(Long paymentDetailsId) {
		softDeleteService.softDelete(paymentDetailsId, paymentDetailsRepository);
		return true;
	}
	
	 public List<PaymentDetailsResponseDTO> getPaymentsByGuestId(Long guestId) {
		 
		 Long hotelId = HotelContext.getHotelId();

		    if (hotelId == null) {
		        throw new RuntimeException("Hotel not selected");
		    }

	        List<PaymentDetails> payments =
	                paymentDetailsRepository.findByGuestDetailsIdAndHotelId(guestId,hotelId);

	        return payments.stream()
	                .map(p -> {
	                    PaymentDetailsResponseDTO dto = new PaymentDetailsResponseDTO();

	                    dto.setId(p.getId());
	                    dto.setAmount(p.getAmount());
	                    dto.setTotalAmount(p.getTotalAmount());
//	                    dto.setPaymentMode(p.getPaymentTypes().get(0).getPaymentTypeName());
	                    if(p.getPaymentType()!= null)
	                    {
	                    	dto.setPaymentMode(p.getPaymentType().getPaymentTypeName());
	                    }
	                    dto.setReceiptNumber(p.getReceiptNo());
	                    dto.setRemark(p.getRemark());
	                    dto.setPaymentDate(p.getPaymentDate());

	                    return dto;
	                })
	                .collect(Collectors.toList());
	 }

}
