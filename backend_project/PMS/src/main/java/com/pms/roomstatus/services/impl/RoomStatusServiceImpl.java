/**
 * 
 */
package com.pms.roomstatus.services.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.roomstatus.dao.IRoomStatusDAO;
import com.pms.roomstatus.entity.RoomStatus;
import com.pms.roomstatus.services.IRoomStatusService;
import com.pms.roomtype.entity.RoomType;

/**
 * 
 */
@Service
public class RoomStatusServiceImpl  implements IRoomStatusService {
	
static final Logger logger = LoggerFactory.getLogger(RoomStatusServiceImpl.class);
	
	@Autowired
	private IRoomStatusDAO dao;

	public List<RoomStatus> getRoomStatuses() {
		return dao.getRoomStatuses();
	}

	public RoomStatus createRoomStatus(RoomStatus roomStatus) {
		return dao.createRoomStatus(roomStatus);
	}

	public RoomStatus updateRoomStatus(int roomStatuseId, RoomStatus roomStatus) {
		return dao.updateRoomStatus(roomStatuseId, roomStatus);
	}

	public RoomStatus getRoomStatus(int roomStatusId) {
		return dao.getRoomStatus(roomStatusId);
	}

	public boolean deleteRoomStatus(int roomStatusId) {
		return dao.deleteRoomStatus(roomStatusId);
	}

	
	@Override
	public RoomStatus getRoomStatusById(Integer id) {
		return dao.findById(id);
	}
	
	

	

}
