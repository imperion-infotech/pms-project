package com.pms.roommaster.services.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.room.dao.IRoomMasterDAO;
import com.pms.room.entity.RoomMaster;
import com.pms.room.services.IRoomMasterService;

@Service
public class RoomMasterServiceImpl implements IRoomMasterService {

static final Logger logger = LoggerFactory.getLogger(RoomMasterServiceImpl.class);
	
	@Autowired
	private IRoomMasterDAO dao;

	public List<RoomMaster> getRoomMasters() {
		return dao.getRoomMasters();
	}

	public RoomMaster createRoomMaster(RoomMaster roomMaster) {
	
		return dao.createRoomMaster(roomMaster);
	}

	public RoomMaster updateRoomMaster(int roomMasterId, RoomMaster roomMaster) {
		return dao.updateRoomMaster(roomMasterId, roomMaster);
	}

	public RoomMaster getRoomMaster(int roomMasterId) {
		return dao.getRoomMaster(roomMasterId);
	}

	public boolean deleteRoomMaster(int roomMasterId) {
		return dao.deleteRoomMaster(roomMasterId);
	}

	
	@Override
	public RoomMaster getRoomMasterById(Integer id) {
		return dao.findById(id);
	}

}
