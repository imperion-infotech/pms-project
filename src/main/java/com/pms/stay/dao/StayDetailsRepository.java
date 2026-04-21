/**
 * 
 */
package com.pms.stay.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.common.repository.SoftDeleteRepository;
import com.pms.stay.entity.StayDetails;

/**
 * 
 */
public interface StayDetailsRepository extends SoftDeleteRepository<StayDetails, Long> , JpaSpecificationExecutor<StayDetails>{
	
	StayDetails findByIdAndHotelIdAndIsDeletedFalse(Long id, Long hotelId);
	List<StayDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);
}
