/**
 * 
 */
package com.pms.roomtype.services;

import java.util.List;

import com.pms.floor.entity.Floor;
import com.pms.roomtype.entity.RoomType;

/**
 * 
 */


public interface IRoomTypeService {
	
	List<RoomType> getRoomTypes();
	RoomType createRoomType(RoomType roomType);
	RoomType updateRoomType(int roomTypeId, RoomType roomType);
	RoomType getRoomType(int roomTypeId);
	boolean deleteRoomType(int RoomTypeId);
	RoomType getRoomTypeById(Integer id);

}
