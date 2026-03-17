package com.pms.floor.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.floor.dao.IFloorDAO;
import com.pms.floor.entity.Floor;
import com.pms.floor.services.IFloorService;

@Service
public class FloorServiceImpl implements IFloorService {
	
	@Autowired
	private IFloorDAO dao;

	public List<Floor> getFloors() {
		return dao.getFloors();
	}

	public Floor createFloor(Floor Floor) {
		return dao.createFloor(Floor);
	}

	public Floor updateFloor(int FloorId, Floor Floor) {
		return dao.updateFloor(FloorId, Floor);
	}

	public Floor getFloor(int FloorId) {
		return dao.getFloor(FloorId);
	}

	public boolean deleteFloor(int FloorId) {
		return dao.deleteFloor(FloorId);
	}
	
	
	 public Optional<Floor> getFloorById1(Integer id) { // ✅ Implemented method
	        return dao.findById(id);
	    }

	 @Override
	 public Floor getFloorById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	 }

	
/*	@Override
	public List<Floor> public getFloors() {
		return dao.getFloors();
	}

	@Override
	public Floor createFloor(Floor Floor) {
		return dao.createFloor(Floor);
	}

	@Override
	public Floor updateFloor(int FloorId, Floor Floor) {
		return dao.updateFloor(FloorId, Floor);
	}

	@Override
	public Floor getFloor(int FloorId) {
		return dao.getFloor(FloorId);
	}

	@Override
	public boolean deleteFloor(int FloorId) {
		return dao.deleteFloor(FloorId);
	}
*/
}
