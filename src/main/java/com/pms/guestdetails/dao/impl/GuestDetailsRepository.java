/**
 * 
 */
package com.pms.guestdetails.dao.impl;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.common.repository.SoftDeleteRepository;
import com.pms.guestdetails.GuestDetails;

/**
 * 
 */
public interface GuestDetailsRepository extends SoftDeleteRepository<GuestDetails, Long>, JpaSpecificationExecutor<GuestDetails>{ 
	GuestDetails findByIdAndHotelIdAndIsDeletedFalse(Long id, Long hotelId);
	List<GuestDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);
}
