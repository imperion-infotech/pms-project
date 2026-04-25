/**
 * 
 */
package com.pms.roomtype.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.common.service.SoftDeleteService;
import com.pms.roomtype.dao.IRoomTypeDAO;
import com.pms.roomtype.dao.RoomTypeRepository;
import com.pms.roomtype.entity.RoomType;
import com.pms.roomtype.services.IRoomTypeService;
import com.pms.search.specification.RoomTypeSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;
import com.pms.security.service.AuthService;
import com.pms.security.service.BaseHotelService;

/**
 * 
 */
@Service
public class RoomTypeServiceImpl extends BaseHotelService implements IRoomTypeService  {
	
static final Logger logger = LoggerFactory.getLogger(RoomTypeServiceImpl.class);
	
	@Autowired
	private IRoomTypeDAO dao;
	
	@Autowired
	private RoomTypeRepository roomTypeRepository;
	
	@Autowired
	private SoftDeleteService softDeleteService;
	
	@Autowired
	private AuthService authService;


	public List<RoomType> getRoomTypes() {
		Long hotelId = HotelContext.getHotelId();
	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return roomTypeRepository.findByHotelId(HotelContext.getHotelId());
	}

	
	public RoomType createRoomType(RoomType roomType) {
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    roomType.setCreatedBy(userId);
		 return roomTypeRepository.saveAndFlush(roomType);
	}

	public RoomType updateRoomType(Long roomTypeId, RoomType roomType) {
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    roomType.setUpdatedBy(userId);
	    roomType.setUpdatedOn(LocalDateTime.now());
		return dao.updateRoomType(roomTypeId, roomType);
	}

	public RoomType getRoomType(Long roomTypeId) {
		return roomTypeRepository.findByIdAndHotelId(roomTypeId, HotelContext.getHotelId());
	}

	public boolean deleteRoomType(Long roomTypeId) {
		softDeleteService.softDelete(roomTypeId, roomTypeRepository);
		return true;
	}
	
	 @Override
	 public RoomType getRoomTypeById(Long id) {
		 return roomTypeRepository.findByIdAndHotelId(id, HotelContext.getHotelId());
	 }
	 
	 public List<RoomType> search(String shortName, String roomTypeName)
	 { 
		 Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT

	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
	     Specification<RoomType> spec = Specification
	                 .where(RoomTypeSpecification.hasHotelId(hotelId))  
	                .and(RoomTypeSpecification.hasRoomTypeName(roomTypeName))
	                .and(RoomTypeSpecification.hasShortName(shortName));

	        return roomTypeRepository.findAll(spec);
	    }

	 

}
