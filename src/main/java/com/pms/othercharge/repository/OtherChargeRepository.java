/**
 * 
 */
package com.pms.othercharge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.othercharge.entity.OtherCharge;

/**
 * 
 */
public interface OtherChargeRepository extends JpaRepository<OtherCharge, Integer>,JpaSpecificationExecutor<OtherCharge>{

}
