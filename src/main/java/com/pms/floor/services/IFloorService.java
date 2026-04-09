package com.pms.floor.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.floor.entity.Floor;
import com.pms.personaldetails.PersonalDetails;

public interface IFloorService  {
	
	static final Logger logger = LoggerFactory.getLogger(IFloorService.class);
	
	List<Floor> getFloors();
	Floor createFloor(Floor floor);
	Floor updateFloor(int floorId, Floor floor);
	Floor getFloor(int floorId);
	boolean deleteFloor(int floorId);
	Floor getFloorById(Integer id);
	public List<Floor> search(String name,String description);

}
