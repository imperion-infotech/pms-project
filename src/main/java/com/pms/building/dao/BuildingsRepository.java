/**
 * 
 */
package com.pms.building.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.building.entity.Building;

/**
 * 
 */
public interface BuildingsRepository extends JpaRepository<Building, Integer> , JpaSpecificationExecutor<Building>{
	
}
