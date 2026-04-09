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
	RoomMaster updateRoomMaster(int roomTypeId, RoomMaster roomMaster);
	RoomMaster getRoomMaster(int roomMasterId);
	boolean deleteRoomMaster(int roomMasterId);
	RoomMaster getRoomMasterById(Integer id);
	List<RoomMaster> search(String roomName, String roomShortName, String floorName);

}
