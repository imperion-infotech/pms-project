/**
 * 
 */
package com.pms.paymentdetails.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.paymentdetails.entity.PaymentDetails;

/**
 * 
 */
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, Integer> , JpaSpecificationExecutor<PaymentDetails>{

}
