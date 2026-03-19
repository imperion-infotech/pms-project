/**
 * 
 */
package com.pms.room.services;

import java.util.List;

import com.pms.room.entity.RoomMaster;

/**
 * 
 */
public interface IRoomMasterService {
	
	List<RoomMaster> getRoomMasters();
	RoomMaster createRoomMaster(RoomMaster roomMaster);
	RoomMaster updateRoomMaster(int roomTypeId, RoomMaster roomMaster);
	RoomMaster getRoomMaster(int roomMasterId);
	boolean deleteRoomMaster(int roomMasterId);
	RoomMaster getRoomMasterById(Integer id);

}
