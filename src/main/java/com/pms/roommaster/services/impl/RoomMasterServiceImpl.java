package com.pms.roommaster.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.common.service.SoftDeleteService;
import com.pms.room.dao.IRoomMasterDAO;
import com.pms.room.dao.impl.RoomMasterRepository;
import com.pms.room.entity.RoomMaster;
import com.pms.room.services.IRoomMasterService;
import com.pms.roomstatus.dao.RoomStatusRepository;
import com.pms.search.specification.RoomMasterSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;

@Service
public class RoomMasterServiceImpl implements IRoomMasterService {

static final Logger logger = LoggerFactory.getLogger(RoomMasterServiceImpl.class);
	
	@Autowired
	private IRoomMasterDAO dao;
	
	@Autowired
	RoomMasterRepository roomMasterRepository;
	
	@Autowired
	RoomStatusRepository roomStatusRepository;

	@Autowired
	SoftDeleteService softDeleteService;
	
	public RoomMasterServiceImpl(IRoomMasterDAO dao, RoomMasterRepository roomMasterRepository,
			RoomStatusRepository roomStatusRepository) {
		super();
		this.dao = dao;
		this.roomMasterRepository = roomMasterRepository;
		this.roomStatusRepository = roomStatusRepository;
	}

	public Page<RoomMaster> getRoomMasters(Pageable pageable) {

	    Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }

	    return roomMasterRepository.findByHotelId(hotelId, pageable);
	}
	
	public RoomMaster createRoomMaster(RoomMaster roomMaster) {
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    roomMaster.setCreatedBy(userId);
		return roomMasterRepository.saveAndFlush(roomMaster);
	}

	public RoomMaster updateRoomMaster(Long roomMasterId, RoomMaster roomMaster) {
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    roomMaster.setUpdatedBy(userId);
	    roomMaster.setUpdatedOn(LocalDateTime.now());
	    RoomMaster b = roomMasterRepository.saveAndFlush(roomMaster);
		return b;
	}

	public RoomMaster getRoomMaster(Long roomMasterId) {
		return roomMasterRepository.findByIdAndHotelId(roomMasterId,HotelContext.getHotelId());
	}

	public boolean deleteRoomMaster(Long roomMasterId) {
		softDeleteService.softDelete(roomMasterId, roomMasterRepository);
		return true;
	}

	
	@Override
	public RoomMaster getRoomMasterByIdAndHotelID(Long id) { // ✅ Implemented method
		Long hotelId = HotelContext.getHotelId(); 
        return roomMasterRepository.findByIdAndHotelId(id,hotelId);
    }
	
	
	public List<RoomMaster> search(String roomName, String roomShortName, String floorName) {
		
		 Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT

	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
	     
        Specification<RoomMaster> spec = Specification
        		 .where(RoomMasterSpecification.hasHotelId(hotelId))
                .and(RoomMasterSpecification.hasRoomName(roomName))
                .and(RoomMasterSpecification.hasRoomShortName(roomShortName))
                .and(RoomMasterSpecification.hasFloorName(floorName));

        return roomMasterRepository.findAll(spec);
    }


}
