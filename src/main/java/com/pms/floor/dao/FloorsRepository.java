/**
 * 
 */
package com.pms.floor.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.floor.entity.Floor;

/**
 * 
 */
public interface FloorsRepository extends JpaRepository<Floor, Integer> , JpaSpecificationExecutor<Floor>{

}

