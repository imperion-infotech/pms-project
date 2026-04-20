/**
 * 
 */
package com.pms.document.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.document.entity.DocumentDetails;
import com.pms.personaldetails.PersonalDetails;

/**
 * 
 */
public interface DocumentDetailsRepository extends JpaRepository<DocumentDetails, Integer> , JpaSpecificationExecutor<DocumentDetails>{
	
	Optional<DocumentDetails> findByIdAndHotelIdAndIsDeletedFalse(Integer id, Long hotelId);
	List<DocumentDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);
	
	
}
