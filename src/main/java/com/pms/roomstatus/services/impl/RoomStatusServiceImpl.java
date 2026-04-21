/**
 * 
 */
package com.pms.roomstatus.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.common.service.SoftDeleteService;
import com.pms.roomstatus.dao.IRoomStatusDAO;
import com.pms.roomstatus.dao.RoomStatusRepository;
import com.pms.roomstatus.entity.RoomStatus;
import com.pms.roomstatus.services.IRoomStatusService;
import com.pms.search.specification.RoomStatusSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;

/**
 * 
 */
@Service
public class RoomStatusServiceImpl  implements IRoomStatusService {
	
static final Logger logger = LoggerFactory.getLogger(RoomStatusServiceImpl.class);
	
	@Autowired
	private IRoomStatusDAO dao;
	
	@Autowired
	private RoomStatusRepository roomStatusRepository;
	
	@Autowired
	private SoftDeleteService softDeleteService;
	
	public RoomStatusServiceImpl(IRoomStatusDAO dao, RoomStatusRepository roomStatusRepository) {
		super();
		this.dao = dao;
		this.roomStatusRepository = roomStatusRepository;
	}

	public List<RoomStatus> getRoomStatuses() {
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return roomStatusRepository.findByHotelId(HotelContext.getHotelId());
	}

	public RoomStatus createRoomStatus(RoomStatus roomStatus) {
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    roomStatus.setCreatedBy(userId);
		 return roomStatusRepository.saveAndFlush(roomStatus);
	}

	public RoomStatus updateRoomStatus(Long roomStatuseId, RoomStatus roomStatus) {
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    roomStatus.setUpdatedBy(userId);
	    roomStatus.setUpdatedOn(LocalDateTime.now());
		return dao.updateRoomStatus(roomStatuseId, roomStatus);
	}

	public RoomStatus getRoomStatus(Long roomStatusId) {
		return roomStatusRepository.findByIdAndHotelId(roomStatusId,HotelContext.getHotelId());
	}

	public boolean deleteRoomStatus(Long roomStatusId) {
		softDeleteService.softDelete(roomStatusId, roomStatusRepository);
		return true;
	}

	
	@Override
	public RoomStatus getRoomStatusById(Long id) {
		 return roomStatusRepository.findByIdAndHotelId(id,HotelContext.getHotelId());
	}

	@Override
	public List<RoomStatus> search(String roomStatusName, String roomStatusDescription) {
		
		 Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT

	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
	     
		Specification<RoomStatus> spec = Specification
				.where(RoomStatusSpecification.hasHotelId(hotelId))   
                .and(RoomStatusSpecification.hasName(roomStatusName))
                .and(RoomStatusSpecification.hasDescription(roomStatusDescription));

        return roomStatusRepository.findAll(spec);
	}
	
}
