/**
 * 
 */
package com.pms.building.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.building.entity.Building;

/**
 * 
 */
public interface IBuildingDAO {
	
static final Logger logger = LoggerFactory.getLogger(IBuildingDAO.class);
	
	public List<Building> getBuildings();
	public Building getBuilding(int buildingId);
	public Building createBuilding(Building building);
	public Building updateBuilding(int buildingId,Building building);
	public boolean deleteBuilding(int buildingId);
	public Building findById(Integer id);

}
