/**
 * 
 */
package com.pms.room.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.room.entity.RoomMaster;

/**
 * 
 */
public interface IRoomMasterDAO {
	
static final Logger logger = LoggerFactory.getLogger(IRoomMasterDAO.class);
	
	public List<RoomMaster> getRoomMasters();
	public RoomMaster getRoomMaster(int roomMasterId);
	public RoomMaster createRoomMaster(RoomMaster roomStatus);
	public RoomMaster updateRoomMaster(int roomMasterId,RoomMaster roomMaster);
	public boolean deleteRoomMaster(int roomMasterId);
	public RoomMaster findById(Integer id);

}
