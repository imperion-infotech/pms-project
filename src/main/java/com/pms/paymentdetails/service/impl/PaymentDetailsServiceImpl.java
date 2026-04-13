/**
 * 
 */
package com.pms.paymentdetails.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.paymentdetails.entity.PaymentDetails;
import com.pms.paymentdetails.entity.PaymentDetailsResponseDTO;
import com.pms.paymentdetails.repository.PaymentDetailsRepository;
import com.pms.paymentdetails.service.IPaymentDetailsService;
import com.pms.paymenttype.entity.PaymentType;
import com.pms.paymenttype.repository.PaymentTypeRepository;
import com.pms.paymenttype.service.IPaymentTypeService;

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
	
	

	public PaymentDetailsServiceImpl(PaymentDetailsRepository paymentDetailsRepository,PaymentTypeRepository paymentTypeRepository) {
		super();
		paymentDetailsRepository = paymentDetailsRepository;
		paymentTypeRepository = paymentTypeRepository;
	}

	@Override
	public List<PaymentDetails> getAllPaymentDetails() {
		return paymentDetailsRepository.findAll();
	}
	
	@Override
	public PaymentDetails getPaymentDetailsById(Integer id) {
		PaymentDetails details = paymentDetailsRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("PaymentDetails not found with id: " + id));
		
		PaymentType type =service.getPaymentTypeById(details.getPaymentType().getId());
		if(type != null )
		{
//		PaymentType type =service.getPaymentTypeById(details.getPaymentTypes().get(0).getId());
//		details.setPaymentType(List.of(type));
		details.setPaymentType(type);
		}
		return details;
	}

	@Override
	public PaymentDetails createPaymentDetails(PaymentDetails paymentDetails) {
		paymentDetails.setPaymentType(paymentDetails.getPaymentType());
//		PaymentType type =service.getPaymentTypeById(Integer.parseInt(paymentDetails.getPaymentTypesId()));
//		paymentDetails.setPaymentTypes(List.of(type));
		return paymentDetailsRepository.save(paymentDetails);
	}

	@Override
	public PaymentDetails updatePaymentDetails(int paymentDetailsId, PaymentDetails paymentDetails) {
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
		
		paymentDetailsRepository.saveAndFlush(paymentDetailsFromDB);
		PaymentDetails updatedPaymentDetails = getPaymentDetailsById(paymentDetailsId);
		return updatedPaymentDetails;
	}

	@Override
	public boolean deletePaymentDetails(int paymentDetailsId) {
		 try {
			 paymentDetailsRepository.deleteById(paymentDetailsId);
		        return true;
		    } catch (Exception e) {
		        return false;
		    }
	}
	
	 public List<PaymentDetailsResponseDTO> getPaymentsByGuestId(Long guestId) {

	        List<PaymentDetails> payments =
	                paymentDetailsRepository.findByGuestDetailsId(guestId);

	        return payments.stream()
	                .map(p -> {
	                    PaymentDetailsResponseDTO dto = new PaymentDetailsResponseDTO();

	                    dto.setId(p.getId());
	                    dto.setAmount(p.getAmount());
	                    dto.setTotalAmount(p.getTotalAmount());
//	                    dto.setPaymentMode(p.getPaymentTypes().get(0).getPaymentTypeName());
	                    dto.setPaymentMode(p.getPaymentType().getPaymentTypeName());
	                    dto.setReceiptNumber(p.getReceiptNo());
	                    dto.setRemark(p.getRemark());
	                    dto.setPaymentDate(p.getPaymentDate());

	                    return dto;
	                })
	                .collect(Collectors.toList());
	 }

}
