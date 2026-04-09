/**
 * 
 */
package com.pms.paymenttype.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.paymenttype.entity.PaymentType;

/**
 * 
 */
public interface PaymentTypeRepository  extends JpaRepository<PaymentType, Integer> , JpaSpecificationExecutor<PaymentType>{
	
}
