/**
 * 
 */
package com.pms.rent.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.rent.RentDetails;

/**
 * 
 */
public interface RentDetailsRepository extends JpaRepository<RentDetails, Integer>, JpaSpecificationExecutor<RentDetails>{
	
	Optional<RentDetails> findByIdAndIsDeletedFalse(Integer id);
	List<RentDetails> findByIsDeletedFalse();

}
