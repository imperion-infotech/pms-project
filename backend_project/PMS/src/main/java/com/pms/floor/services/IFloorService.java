package com.pms.floor.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.floor.entity.Floor;

public interface IFloorService  {
	
	List<Floor> getFloors();
	Floor createFloor(Floor Floor);
	Floor updateFloor(int FloorId, Floor Floor);
	Floor getFloor(int FloorId);
	boolean deleteFloor(int FloorId);
	Floor getFloorById(Integer id);

}
