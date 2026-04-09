/**
 * 
 */
package com.pms.roomstatus.services;

import java.util.List;

import com.pms.roomstatus.entity.RoomStatus;

/**
 * 
 */
public interface IRoomStatusService {
	
	
	List<RoomStatus> getRoomStatuses();
	RoomStatus createRoomStatus(RoomStatus roomStatus);
	RoomStatus updateRoomStatus(int roomTypeId, RoomStatus roomStatus);
	RoomStatus getRoomStatus(int roomTypeId);
	boolean deleteRoomStatus(int RoomTypeId);
	RoomStatus getRoomStatusById(Integer id);
	public List<RoomStatus> search(String roomStatusName,String roomStatusDescription);

}
