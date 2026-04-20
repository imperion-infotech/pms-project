/**
 * 
 */
package com.pms.guestdetails.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.guestdetails.GuestDetails;

/**
 * 
 */
public interface GuestDetailsRepository extends JpaRepository<GuestDetails, Integer>, JpaSpecificationExecutor<GuestDetails>{ 
	GuestDetails findByIdAndHotelIdAndIsDeletedFalse(Long id, Long hotelId);
	List<GuestDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);
}
