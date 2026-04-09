package com.pms.floor.services.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.floor.dao.FloorsRepository;
import com.pms.floor.dao.IFloorDAO;
import com.pms.floor.entity.Floor;
import com.pms.floor.services.IFloorService;
import com.pms.search.specification.FloorSpecification;

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
//		return dao.getFloors();
		return floorsRepository.findAll();
	}

	public Floor createFloor(Floor floor) {
//		return dao.createFloor(Floor);
		 return floorsRepository.saveAndFlush(floor);
	}

	public Floor updateFloor(int floorId, Floor floor) {
		return dao.updateFloor(floorId, floor);
	}

	public Floor getFloor(int floorId) {
		return dao.getFloor(floorId);
	}

	public boolean deleteFloor(int floorId) {
		return dao.deleteFloor(floorId);
	}
	
	
	 public Floor getFloorById(Integer id) { // ✅ Implemented method
	        return dao.findById(id);
	    }

	 @Override
	 public List<Floor> search(String name, String description) {
	        Specification<Floor> spec = Specification
	                .where(FloorSpecification.hasName(name))
	                .and(FloorSpecification.hasDescription(description));

	        return floorsRepository.findAll(spec);
	    }
	 
}
