package com.pms.building.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.building.dao.BuildingsRepository;
import com.pms.building.dao.IBuildingDAO;
import com.pms.building.entity.Building;
import com.pms.building.service.IBuildingService;
import com.pms.floor.entity.Floor;
import com.pms.search.specification.BuildingSpecification;
import com.pms.search.specification.FloorSpecification;
import com.pms.security.configuration.HotelContext;;

@Service
public class BuildingServiceImpl implements IBuildingService {

static final Logger logger = LoggerFactory.getLogger(BuildingServiceImpl.class);
	
	@Autowired
	private IBuildingDAO dao;
	
	@Autowired
	private BuildingsRepository buildingRepository;
	
	

	public BuildingServiceImpl(IBuildingDAO dao, BuildingsRepository buildingRepository) {
		super();
		this.dao = dao;
		this.buildingRepository = buildingRepository;
	}

	public List<Building> getBuildings() {
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return buildingRepository.findByHotelId(HotelContext.getHotelId());
	}
	
	
	
	@Auditable(action = "CREATE", entity = "BUILDING")
	public Building createBuilding(Building building) {
//		logger.info("Audit: {} performed on {}", audit.action(), audit.entity());
		 return buildingRepository.saveAndFlush(building);
	}

	@Auditable(action = "UPDATE", entity = "BUILDING")
	public Building updateBuilding(int buildingId, Building building) {
		return dao.updateBuilding(buildingId, building);
	}

	public Building getBuilding(Long buildingId) {
		return buildingRepository.findByIdAndHotelId(buildingId, HotelContext.getHotelId());
	}

	@Auditable(action = "DELETE", entity = "BUILDING")
	public boolean deleteBuilding(Long buildingId) {
//		return dao.deleteBuilding(buildingId);
		
		Building building = getBuilding(buildingId);
		building.setIsDeleted(true);
		building.setIsActive(false);
		Building b = buildingRepository.save(building);
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
	
	
	 public Building getBuildingById(Long id) { // ✅ Implemented method
	        return buildingRepository.findByIdAndHotelId(id, HotelContext.getHotelId());
	    }

	 @Override
	 public List<Building> search(String name, String description) {
		 
		 Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT

	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		 
		 
	     Specification<Building> spec = Specification
	                 .where(BuildingSpecification.hasHotelId(hotelId))  
	                .and(BuildingSpecification.hasName(name))
	                .and(BuildingSpecification.hasDescription(description));

	        return buildingRepository.findAll(spec);
	    }

}
