/**
 * 
 */
package com.pms.roomstatus.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pms.floor.entity.Floor;
import com.pms.roomstatus.entity.RoomStatus;

/**
 * 
 */
public interface RoomStatusRepository extends JpaRepository<RoomStatus, Integer> , JpaSpecificationExecutor<RoomStatus>{
	
List<RoomStatus> findByHotelId(Long hotelId);
	
	RoomStatus findByIdAndHotelId(Long roomStatusId,Long hotelId);
	
//	@Query("SELECT f FROM RoomStatus f WHERE f.hotelId = :hotelId")
//	List<RoomStatus> findRoomStatus(@Param("hotelId") Long hotelId);
	
	@Query("SELECT r FROM RoomStatus r WHERE r.hotelId = :hotelId and r.isDeleted=:isDeleted and r.isActive=:isActive")
	List<RoomStatus> findRoomStatus(@Param("hotelId") Long hotelId,@Param("isDeleted") Boolean isDeleted, @Param("isActive") Boolean isActive);


}

