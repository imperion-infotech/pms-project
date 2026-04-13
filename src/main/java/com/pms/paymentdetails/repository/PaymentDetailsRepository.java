/**
 * 
 */
package com.pms.paymentdetails.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.pms.paymentdetails.entity.PaymentDetails;

/**
 * 
 */
@Repository
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, Integer> , JpaSpecificationExecutor<PaymentDetails>{
	
	List<PaymentDetails> findByGuestDetailsId(Long guestId);

}
