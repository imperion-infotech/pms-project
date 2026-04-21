package com.pms.floor.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.building.entity.Building;
import com.pms.common.service.SoftDeleteService;
import com.pms.floor.dao.FloorsRepository;
import com.pms.floor.dao.IFloorDAO;
import com.pms.floor.entity.Floor;
import com.pms.floor.services.IFloorService;
import com.pms.search.specification.FloorSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;

@Service
public class FloorServiceImpl implements IFloorService {
	
	static final Logger logger = LoggerFactory.getLogger(FloorServiceImpl.class);
	
	@Autowired
	private IFloorDAO dao;
	
	@Autowired
	private FloorsRepository floorsRepository;
	
	@Autowired
    private SoftDeleteService softDeleteService;

	public FloorServiceImpl(IFloorDAO dao, FloorsRepository floorsRepository) {
		super();
		this.dao = dao;
		this.floorsRepository = floorsRepository;
	}

	
	
	public List<Floor> getFloors() {

		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return floorsRepository.findByHotelId(HotelContext.getHotelId());
	}

	public Floor createFloor(Floor floor) {
//		return dao.createFloor(Floor);
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    floor.setCreatedBy(userId);
		 return floorsRepository.saveAndFlush(floor);
	}

	public Floor updateFloor(Long floorId, Floor floor) {
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
		floor.setUpdatedBy(userId);
		floor.setUpdatedOn(LocalDateTime.now());
		Floor b=floorsRepository.saveAndFlush(floor);
//		return dao.updateFloor(floorId, floor);
		return b;
	}

	public Floor getFloor(Long floorId) {
		return floorsRepository.findByIdAndHotelId(floorId,HotelContext.getHotelId());
	}

	public boolean deleteFloor(Long floorId) {
		
		softDeleteService.softDelete(floorId, floorsRepository);
		 return true;
	}
	
	
	 @Override
	 public List<Floor> search(String name, String description) {

	     Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT

	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }

	     Specification<Floor> spec = Specification
	             .where(FloorSpecification.hasHotelId(hotelId))   // ✅ ADD THIS
	             .and(FloorSpecification.hasName(name))
	             .and(FloorSpecification.hasDescription(description));

	     return floorsRepository.findAll(spec);
	 }
}
