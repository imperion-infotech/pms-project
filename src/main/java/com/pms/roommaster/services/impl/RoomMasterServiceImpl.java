package com.pms.roommaster.services.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.room.dao.IRoomMasterDAO;
import com.pms.room.dao.impl.RoomMasterRepository;
import com.pms.room.entity.RoomMaster;
import com.pms.room.services.IRoomMasterService;
import com.pms.roomstatus.dao.RoomStatusRepository;
import com.pms.roomstatus.entity.RoomStatus;
import com.pms.search.specification.RoomMasterSpecification;

@Service
public class RoomMasterServiceImpl implements IRoomMasterService {

static final Logger logger = LoggerFactory.getLogger(RoomMasterServiceImpl.class);
	
	@Autowired
	private IRoomMasterDAO dao;
	
	@Autowired
	RoomMasterRepository roomMasterRepository;
	
	@Autowired
	RoomStatusRepository roomStatusRepository;
	
	public RoomMasterServiceImpl(IRoomMasterDAO dao, RoomMasterRepository roomMasterRepository,
			RoomStatusRepository roomStatusRepository) {
		super();
		this.dao = dao;
		this.roomMasterRepository = roomMasterRepository;
		this.roomStatusRepository = roomStatusRepository;
	}

	@Override
	public Page<RoomMaster> getRoomMasters(Pageable pageable) {
		Page<RoomMaster> page = roomMasterRepository.findAll(pageable);
//		for (RoomMaster rMaster : page) {
//			rMaster.setRoomStatusTable(roomStatusRepository.getById(rMaster.getRoomStatusTableId()));
//		}
		return page;
	}
	
	public RoomMaster createRoomMaster(RoomMaster roomMaster) {
	
		return dao.createRoomMaster(roomMaster);
	}

	public RoomMaster updateRoomMaster(int roomMasterId, RoomMaster roomMaster) {
		return dao.updateRoomMaster(roomMasterId, roomMaster);
	}

	public RoomMaster getRoomMaster(int roomMasterId) {
		RoomMaster rMaster = dao.getRoomMaster(roomMasterId);
//		RoomStatus rStatus = roomStatusRepository.getById(rMaster.getRoomStatusTableId());
//		rMaster.setRoomStatusTable(rStatus);
		return rMaster;
	}

	public boolean deleteRoomMaster(int roomMasterId) {
		return dao.deleteRoomMaster(roomMasterId);
	}

	
	@Override
	public RoomMaster getRoomMasterById(Integer id) {
		return dao.findById(id);
	}
	
	public List<RoomMaster> search(String roomName, String roomShortName, String floorName) {
        Specification<RoomMaster> spec = Specification
                .where(RoomMasterSpecification.hasRoomName(roomName))
                .and(RoomMasterSpecification.hasRoomShortName(roomShortName))
                .and(RoomMasterSpecification.hasFloorName(floorName));

        return roomMasterRepository.findAll(spec);
    }

	

}
