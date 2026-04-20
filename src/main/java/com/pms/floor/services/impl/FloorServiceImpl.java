package com.pms.floor.services.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.building.entity.Building;
import com.pms.floor.dao.FloorsRepository;
import com.pms.floor.dao.IFloorDAO;
import com.pms.floor.entity.Floor;
import com.pms.floor.services.IFloorService;
import com.pms.search.specification.FloorSpecification;
import com.pms.security.configuration.HotelContext;

@Service
public class FloorServiceImpl implements IFloorService {
	
	static final Logger logger = LoggerFactory.getLogger(FloorServiceImpl.class);
	
	@Autowired
	private IFloorDAO dao;
	
	@Autowired
	private FloorsRepository floorsRepository;
	
	

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
		 return floorsRepository.saveAndFlush(floor);
	}

	public Floor updateFloor(int floorId, Floor floor) {
		return dao.updateFloor(floorId, floor);
	}

	public Floor getFloor(int floorId) {
		return floorsRepository.findByIdAndHotelId(floorId,HotelContext.getHotelId());
	}

	public boolean deleteFloor(int floorId) {
		
		 Floor floor = getFloor(floorId);
		 floor.setIsDeleted(true);
		 floor.setIsActive(false);
		 Floor b = floorsRepository.save(floor);
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
	
	
	 public Floor getFloorByIdAndHotelID(Integer id,Long hotelId) { // ✅ Implemented method
	        return floorsRepository.findByIdAndHotelId(id,hotelId);
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
