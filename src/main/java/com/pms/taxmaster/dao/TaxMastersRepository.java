/**
 * 
 */
package com.pms.taxmaster.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.taxmaster.entity.TaxMaster;

/**
 * 
 */
public interface TaxMastersRepository extends JpaRepository<TaxMaster, Integer> , JpaSpecificationExecutor<TaxMaster>{
	

}
