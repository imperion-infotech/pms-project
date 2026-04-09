package com.pms.floor.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.floor.entity.Floor;
public interface IFloorDAO  {
	
	static final Logger logger = LoggerFactory.getLogger(IFloorDAO.class);
	
	public List<com.pms.floor.entity.Floor> getFloors();
	public Floor getFloor(int floorId);
	public Floor createFloor(Floor floor);
	public Floor updateFloor(int floorId,Floor floor);
	public boolean deleteFloor(int floorId);
	public Floor findById(Integer id);

}
