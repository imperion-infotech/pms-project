/**
 * 
 */
package com.pms.othercharge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.othercharge.entity.OtherChargeDetails;

/**
 * 
 */
public interface OtherChargeDetailsRepository extends JpaRepository<OtherChargeDetails, Integer>,JpaSpecificationExecutor<OtherChargeDetails>{

}
