/**
 * 
 */
package com.pms.document.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.common.repository.SoftDeleteRepository;
import com.pms.document.entity.DocumentDetails;

/**
 * 
 */
public interface DocumentDetailsRepository extends SoftDeleteRepository<DocumentDetails, Long> , JpaSpecificationExecutor<DocumentDetails>{
	
	Optional<DocumentDetails> findByIdAndHotelIdAndIsDeletedFalse(Long id, Long hotelId);
	List<DocumentDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);
	
	
}
