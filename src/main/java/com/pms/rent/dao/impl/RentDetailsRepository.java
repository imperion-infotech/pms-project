/**
 * 
 */
package com.pms.rent.dao.impl;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.common.repository.SoftDeleteRepository;
import com.pms.rent.RentDetails;

/**
 * 
 */
public interface RentDetailsRepository extends SoftDeleteRepository<RentDetails, Long>, JpaSpecificationExecutor<RentDetails>{
	
	RentDetails findByIdAndHotelIdAndIsDeletedFalse(Long id, Long hotelId);
	List<RentDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);

}
