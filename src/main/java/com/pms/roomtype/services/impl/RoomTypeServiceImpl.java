/**
 * 
 */
package com.pms.roomtype.services.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.building.entity.Building;
import com.pms.roomtype.dao.IRoomTypeDAO;
import com.pms.roomtype.dao.RoomTypeRepository;
import com.pms.roomtype.entity.RoomType;
import com.pms.roomtype.services.IRoomTypeService;
import com.pms.search.specification.BuildingSpecification;
import com.pms.search.specification.RoomTypeSpecification;
import com.pms.security.configuration.HotelContext;

/**
 * 
 */
@Service
public class RoomTypeServiceImpl implements IRoomTypeService  {
	
static final Logger logger = LoggerFactory.getLogger(RoomTypeServiceImpl.class);
	
	@Autowired
	private IRoomTypeDAO dao;
	
	@Autowired
	private RoomTypeRepository roomTypeRepository;

	public List<RoomType> getRoomTypes() {
		Long hotelId = HotelContext.getHotelId();
	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return roomTypeRepository.findByHotelId(HotelContext.getHotelId());
	}

	
	public RoomType createRoomType(RoomType roomType) {
		 return roomTypeRepository.saveAndFlush(roomType);
	}

	public RoomType updateRoomType(int roomTypeId, RoomType roomType) {
		return dao.updateRoomType(roomTypeId, roomType);
	}

	public RoomType getRoomType(Long roomTypeId) {
		return roomTypeRepository.findByIdAndHotelId(roomTypeId, HotelContext.getHotelId());
	}

	public boolean deleteRoomType(Long roomTypeId) {
//		return dao.deleteRoomType(roomTypeId);
		
		RoomType roomType = getRoomType(roomTypeId);
		roomType.setIsDeleted(true);
		roomType.setIsActive(false);
		RoomType b = roomTypeRepository.save(roomType);
		boolean isDeleted = false;
		if(b.getId() != 0)
		{
			isDeleted=true;
		} else 
		{
			isDeleted=false;
		}
		return isDeleted;
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
