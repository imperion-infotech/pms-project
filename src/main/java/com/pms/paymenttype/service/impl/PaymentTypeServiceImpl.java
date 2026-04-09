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

import com.pms.paymenttype.entity.PaymentType;
import com.pms.paymenttype.repository.PaymentTypeRepository;
import com.pms.paymenttype.service.IPaymentTypeService;
import com.pms.search.specification.PaymentTypeSpecification;

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
		paymentTypeRepository = paymentTypeRepository;
	}
	
	public List<PaymentType> getPaymentTypes() {
		return paymentTypeRepository.findAll();
	}
	
	
	public PaymentType getPaymentTypeById(Integer id) {
	    return paymentTypeRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("PaymentType not found with id: " + id));
	}
	public PaymentType createPaymentType(PaymentType paymentType) {
		 return paymentTypeRepository.saveAndFlush(paymentType);
	}
	
	public PaymentType updatePaymentType(int paymentTypeId, PaymentType paymentType) {
		
		//First We are taking Book detail from database by given book id and 
		// then updating detail with provided book object
		PaymentType paymentTypeFromDB = getPaymentTypeById(paymentTypeId);
		paymentTypeFromDB.setCategoryName(paymentType.getCategoryName());
		paymentTypeFromDB.setCreatedOn(paymentType.getCreatedOn());
		paymentTypeFromDB.setDescription(paymentType.getDescription());
		paymentTypeFromDB.setId(paymentTypeId);
		paymentTypeFromDB.setCreditCardProcessing(paymentType.isCreditCardProcessing());
		paymentTypeFromDB.setPaymentTypeShortName(paymentType.getPaymentTypeShortName());
		paymentTypeRepository.saveAndFlush(paymentTypeFromDB);
		//again i am taking updated result of book and returning the book object
		PaymentType updatedPaymentType = getPaymentTypeById(paymentTypeId);
		return updatedPaymentType;
	}
	
	 @Override
	 public List<PaymentType> search(String paymentTypeName,String paymentTypeShortName, String categoryName, String description) {
	        Specification<PaymentType> spec = Specification
	                .where(PaymentTypeSpecification.hasCategoryName(categoryName))
	                .and(PaymentTypeSpecification.hasDescription(description))
	        		.and(PaymentTypeSpecification.hasPaymentTypeName(paymentTypeName))
	                .and(PaymentTypeSpecification.hasPaymentTypeShortName(paymentTypeShortName));

	        return paymentTypeRepository.findAll(spec);
	    }

	 @Override
	 public boolean deletePaymentType(int paymentTypeId) {
		 try {
		        paymentTypeRepository.deleteById(paymentTypeId);
		        return true;
		    } catch (Exception e) {
		        return false;
		    }
	 }

		
		
	}
	