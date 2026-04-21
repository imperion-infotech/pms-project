/**
 * 
 */
package com.pms.room.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.pms.room.entity.RoomMaster;

/**
 * 
 */
public interface IRoomMasterService {
	
	Page<RoomMaster> getRoomMasters(Pageable pageable);
	RoomMaster createRoomMaster(RoomMaster roomMaster);
	RoomMaster updateRoomMaster(Long roomTypeId, RoomMaster roomMaster);
	RoomMaster getRoomMaster(Long roomMasterId);
	boolean deleteRoomMaster(Long roomMasterId);
	public RoomMaster getRoomMasterByIdAndHotelID(Long id);
	List<RoomMaster> search(String roomName, String roomShortName, String floorName);

}
