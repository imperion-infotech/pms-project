/**
 * 
 */
package com.pms.room.dao.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pms.common.repository.SoftDeleteRepository;
import com.pms.room.entity.RoomMaster;

/**
 * 
 */
public interface RoomMasterRepository extends SoftDeleteRepository<RoomMaster, Long>, JpaSpecificationExecutor<RoomMaster>{

	Page<RoomMaster> findByHotelId(Long hotelId, Pageable pageable);
	
	RoomMaster findByIdAndHotelId(Long roomMasterId,Long hotelId);
	
	@Query("SELECT r FROM RoomMaster r WHERE r.hotelId = :hotelId and r.isDeleted=:isDeleted and r.isActive=:isActive")
	List<RoomMaster> findFloors(@Param("hotelId") Long hotelId,@Param("isDeleted") Boolean isDeleted, @Param("isActive") Boolean isActive);
}
