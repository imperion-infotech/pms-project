package com.pms.building.service.impl;

import java.time.LocalDateTime;
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
import com.pms.common.service.SoftDeleteService;
import com.pms.search.specification.BuildingSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;
import com.pms.security.entity.User;
import com.pms.security.service.AuthService;
import com.pms.security.service.BaseHotelService;;

@Service
public class BuildingServiceImpl extends BaseHotelService implements IBuildingService {

static final Logger logger = LoggerFactory.getLogger(BuildingServiceImpl.class);
	
	@Autowired
	private IBuildingDAO dao;
	
	@Autowired
	private BuildingsRepository buildingRepository;
	
	 @Autowired
     private SoftDeleteService softDeleteService;
	
	@Autowired
	private AuthService authService;

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
	    validateHotelAccess(hotelId);
	    if (isSuperAdmin()) 
	    	return buildingRepository.findAll();
	    
	    else 
	    return buildingRepository.findByHotelId(HotelContext.getHotelId());
	}
	
	
	
	@Auditable(action = "CREATE", entity = "BUILDING")
	public Building createBuilding(Building building) {
		assignHotel(building, building.getHotelId());
	    building.setCreatedBy(authService.getCurrentUser().getId());
	    return buildingRepository.saveAndFlush(building);
	}

	@Auditable(action = "UPDATE", entity = "BUILDING")
	public Building updateBuilding(Long buildingId, Building building) {
		validateHotelAccess(building.getHotelId());
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
		building.setUpdatedBy(userId);
		building.setUpdatedOn(LocalDateTime.now());
		return dao.updateBuilding(buildingId, building);
	}

	public Building getBuilding(Long buildingId) {
		
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
	    validateHotelAccess(hotelId);
		Building b= buildingRepository.findByIdAndHotelId(buildingId, HotelContext.getHotelId());
		return b;
	}

	@Auditable(action = "DELETE", entity = "BUILDING")
	public boolean deleteBuilding(Long buildingId) {
		Building b = getBuildingById(buildingId);
		validateHotelAccess(b.getHotelId());
	   softDeleteService.softDelete(buildingId, buildingRepository);
	    
	    return true;
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
		 
	     validateHotelAccess(hotelId);
	     Specification<Building> spec = Specification
	                 .where(BuildingSpecification.hasHotelId(hotelId))  
	                .and(BuildingSpecification.hasName(name))
	                .and(BuildingSpecification.hasDescription(description));

	        return buildingRepository.findAll(spec);
	    }

}
