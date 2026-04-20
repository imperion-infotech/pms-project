/**
 * 
 */
package com.pms.roomtype.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pms.building.entity.Building;
import com.pms.roomtype.entity.RoomType;

/**
 * 
 */
public interface RoomTypeRepository  extends JpaRepository<RoomType, Integer> , JpaSpecificationExecutor<RoomType>{
	List<RoomType> findByHotelId(Long hotelId);
	
	RoomType findByIdAndHotelId(Long roomTypeId,Long hotelId);
	
	@Query("SELECT r FROM RoomType r WHERE r.hotelId = :hotelId and r.isDeleted=:isDeleted and r.isActive=:isActive")
	List<RoomType> findRoomTypes(@Param("hotelId") Long hotelId,@Param("isDeleted") Boolean isDeleted, @Param("isActive") Boolean isActive);
}
