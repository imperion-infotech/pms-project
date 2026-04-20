/**
 * 
 */
package com.pms.stay.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.personaldetails.PersonalDetails;
import com.pms.stay.entity.StayDetails;

/**
 * 
 */
public interface StayDetailsRepository extends JpaRepository<StayDetails, Integer> , JpaSpecificationExecutor<StayDetails>{
	
	StayDetails findByIdAndHotelIdAndIsDeletedFalse(Long id, Long hotelId);
	List<StayDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);
}
