/**
 * 
 */
package com.pms.hotel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.building.entity.Building;
import com.pms.common.repository.SoftDeleteRepository;
import com.pms.hotel.entity.Hotel;

/**
 * 
 */
public interface HotelRepository extends SoftDeleteRepository<Hotel, Long> ,  JpaSpecificationExecutor<Hotel>{
}
