/**
 * 
 */
package com.pms.floor.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pms.building.entity.Building;
import com.pms.common.repository.SoftDeleteRepository;
import com.pms.floor.entity.Floor;

/**
 * 
 */

public interface FloorsRepository extends SoftDeleteRepository<Floor, Long> , JpaSpecificationExecutor<Floor>{
	
	List<Floor> findByHotelId(Long hotelId);
	
	Floor findByIdAndHotelId(Long floorId,Long hotelId);
	
	@Query("SELECT f FROM Floor f WHERE f.hotelId = :hotelId and f.isDeleted=:isDeleted and f.isActive=:isActive")
	List<Floor> findFloors(@Param("hotelId") Long hotelId,@Param("isDeleted") Boolean isDeleted, @Param("isActive") Boolean isActive);


}

