/**
 * 
 */
package com.pms.paymentdetails.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.paymentdetails.entity.PaymentDetails;
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
		
		PaymentType type =service.getPaymentTypeById(Integer.parseInt(details.getPaymentTypesId()));
		if(type != null )
		{
//		PaymentType type =service.getPaymentTypeById(details.getPaymentTypes().get(0).getId());
		details.setPaymentTypes(List.of(type));
		}
		return details;
	}

	@Override
	public PaymentDetails createPaymentDetails(PaymentDetails paymentDetails) {
//		PaymentType type = paymentTypeRepository.findById(paymentDetails.getPaymentTypes().get(0).getId()).get();
//		paymentDetailsType
		paymentDetails.setPaymentTypesId(paymentDetails.getPaymentTypes().get(0).getId()+"");
		
		PaymentType type =service.getPaymentTypeById(Integer.parseInt(paymentDetails.getPaymentTypesId()));
		paymentDetails.setPaymentTypes(List.of(type));
		return paymentDetailsRepository.save(paymentDetails);
	}

	@Override
	public PaymentDetails updatePaymentDetails(int paymentDetailsId, PaymentDetails paymentDetails) {
		PaymentDetails paymentDetailsFromDB = getPaymentDetailsById(paymentDetailsId);
		paymentDetailsFromDB.setAuthorizationNo(paymentDetails.getAuthorizationNo());
		paymentDetailsFromDB.setAmount(paymentDetails.getAmount());
		paymentDetailsFromDB.setCardNo(paymentDetails.getCardNo());
		paymentDetailsFromDB.setCurrencySymbol(paymentDetails.getCurrencySymbol());
		paymentDetailsFromDB.setPaymentTypes(paymentDetails.getPaymentTypes());
		paymentDetailsFromDB.setPaymentTypesId(paymentDetails.getPaymentTypesId());
		paymentDetailsFromDB.setReceiptNo(paymentDetails.getReceiptNo());
		paymentDetailsFromDB.setRemark(paymentDetails.getRemark());
		paymentDetailsFromDB.setValidTill(paymentDetails.getValidTill());
		
		
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

}
