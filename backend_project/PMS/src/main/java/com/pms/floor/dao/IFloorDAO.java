package com.pms.floor.dao;

import java.util.List;
import java.util.Optional;
import com.pms.floor.entity.Floor;
public interface IFloorDAO  {
	
	public List<com.pms.floor.entity.Floor> getFloors();
	public Floor getFloor(int floorId);
	public Floor createFloor(Floor floor);
	public Floor updateFloor(int floorId,Floor floor);
	public boolean deleteFloor(int floorId);
	public Optional<Floor> findById(Integer id);

}
