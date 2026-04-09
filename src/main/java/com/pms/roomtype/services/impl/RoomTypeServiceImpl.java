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

import com.pms.roomtype.dao.IRoomTypeDAO;
import com.pms.roomtype.dao.RoomTypeRepository;
import com.pms.roomtype.entity.RoomType;
import com.pms.roomtype.services.IRoomTypeService;
import com.pms.search.specification.RoomTypeSpecification;

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
		return dao.getRoomTypes();
	}

	public RoomType createRoomType(RoomType roomType) {
		return dao.createRoomType(roomType);
	}

	public RoomType updateRoomType(int roomTypeId, RoomType roomType) {
		return dao.updateRoomType(roomTypeId, roomType);
	}

	public RoomType getRoomType(int roomType) {
		return dao.getRoomType(roomType);
	}

	public boolean deleteRoomType(int roomTypeId) {
		return dao.deleteRoomType(roomTypeId);
	}
	
	 @Override
	 public RoomType getRoomTypeById(Integer id) {
		 return dao.findById(id);
	 }
	 
	 public List<RoomType> search(String shortName, String roomTypeName,Double price) {
	        Specification<RoomType> spec = Specification
	                .where(RoomTypeSpecification.hasShortName(shortName))
	                .and(RoomTypeSpecification.hasRoomTypeName(roomTypeName))
	        		.and(RoomTypeSpecification.hasPrice(price));
	        return roomTypeRepository.findAll(spec);
	    }

	 

}
