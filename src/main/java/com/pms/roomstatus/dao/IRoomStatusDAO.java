/**
 * 
 */
package com.pms.roomstatus.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.room.entity.RoomMaster;
import com.pms.roomstatus.entity.RoomStatus;
import com.pms.roomtype.entity.RoomType;

/**
 * 
 */
public interface IRoomStatusDAO {
	
static final Logger logger = LoggerFactory.getLogger(IRoomStatusDAO.class);
	
	public List<RoomStatus> getRoomStatuses();
	public RoomStatus getRoomStatus(int roomStatusId);
	public RoomStatus createRoomStatus(RoomStatus roomStatus);
	public RoomStatus updateRoomStatus(int roomStatusId,RoomStatus roomStatus);
	public boolean deleteRoomStatus(int roomStatusId);
	public RoomStatus findById(Integer id);

}
