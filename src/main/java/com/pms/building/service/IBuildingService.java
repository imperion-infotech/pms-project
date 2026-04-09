/**
 * 
 */
package com.pms.building.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.building.entity.Building;

/**
 * 
 */
public interface IBuildingService {
	
static final Logger logger = LoggerFactory.getLogger(IBuildingService.class);
	
	List<Building> getBuildings();
	Building createBuilding(Building building);
	Building updateBuilding(int floorId, Building building);
	Building getBuilding(int building);
	boolean deleteBuilding(int building);
	Building getBuildingById(Integer id);
	public List<Building> search(String name,String description);


}
