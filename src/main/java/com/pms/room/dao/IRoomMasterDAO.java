/**
 * 
 */
package com.pms.room.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.pms.room.entity.RoomMaster;

/**
 * 
 */
public interface IRoomMasterDAO {
	
static final Logger logger = LoggerFactory.getLogger(IRoomMasterDAO.class);
	
	public Page<RoomMaster> getRoomMasters(Pageable pageable);
	public RoomMaster getRoomMaster(int roomMasterId);
	public RoomMaster createRoomMaster(RoomMaster roomStatus);
	public RoomMaster updateRoomMaster(int roomMasterId,RoomMaster roomMaster);
	public boolean deleteRoomMaster(int roomMasterId);
	public RoomMaster findById(Integer id);

}
