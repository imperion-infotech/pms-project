/**
 * 
 */
package com.pms.paymenttype.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pms.floor.entity.Floor;
import com.pms.paymenttype.entity.PaymentType;

/**
 * 
 */
@Repository
public interface PaymentTypeRepository  extends JpaRepository<PaymentType, Integer> , JpaSpecificationExecutor<PaymentType>{
	
List<PaymentType> findByHotelId(Long hotelId);
	
	PaymentType findByIdAndHotelId(Integer paymentTypeId,Long hotelId);
	
	@Query("SELECT p FROM PaymentType p WHERE p.hotelId = :hotelId")
	List<PaymentType> findPaymentTypes(@Param("hotelId") Long hotelId);
	
}
