/**
 * 
 */
package com.pms.paymentdetails.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pms.floor.entity.Floor;
import com.pms.paymentdetails.entity.PaymentDetails;

/**
 * 
 */
@Repository
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, Integer> , JpaSpecificationExecutor<PaymentDetails>{
	
	List<PaymentDetails> findByGuestDetailsIdAndHotelId(Long guestId,Long hotelId);
	
	List<PaymentDetails> findByHotelId(Long hotelId);
	
	PaymentDetails findByIdAndHotelId(Integer paymentDetails,Long hotelId);
	
	@Query("SELECT p FROM PaymentDetails p WHERE p.hotelId = :hotelId")
	List<PaymentDetails> findPaymentDetails(@Param("hotelId") Long hotelId);
	
	

}
