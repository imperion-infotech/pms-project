/**
 * 
 */
package com.pms.othercharge.service.impl;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.floor.entity.Floor;
import com.pms.othercharge.entity.OtherCharge;
import com.pms.othercharge.repository.OtherChargeRepository;
import com.pms.othercharge.service.IOtherChargeService;
import com.pms.search.specification.FloorSpecification;
import com.pms.search.specification.OtherChargeSpecification;
import com.pms.search.specification.PaymentTypeSpecification;
import com.pms.security.configuration.HotelContext;

/**
 * 
 */
@Service
public class OtherChargeServiceImpl implements IOtherChargeService{
	
static final Logger logger = LoggerFactory.getLogger(OtherChargeServiceImpl.class);
	
	@Autowired
	private OtherChargeRepository otherChargeRepository;
	
	public OtherChargeServiceImpl(OtherChargeRepository otherChargeRepository) {
		super();
		this.otherChargeRepository = otherChargeRepository;
	}

	@Override
	public List<OtherCharge> getOtherCharges() {
		Long hotelId = HotelContext.getHotelId();
	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return otherChargeRepository.findByHotelId(HotelContext.getHotelId());
	}

	@Override
	public OtherCharge createOtherCharge(OtherCharge otherCharge) {
		 return otherChargeRepository.saveAndFlush(otherCharge);
	}

	@Override
	public OtherCharge updateOtherCharge(int otherChargeId, OtherCharge otherCharge) {
				OtherCharge otherChargeFromDB = getOtherChargeById(otherChargeId);
				otherChargeFromDB.setAlwaysCharge(otherCharge.isAlwaysCharge());
				otherChargeFromDB.setCallLoggingCharge(otherCharge.isCallLoggingCharge());
				otherChargeFromDB.setCreatedOn(otherCharge.getCreatedOn());
				otherChargeFromDB.setCallPOSCharge(otherCharge.isCallPOSCharge());
				otherChargeFromDB.setCategoryName(otherCharge.getCategoryName());;
				otherChargeFromDB.setOtherChargeName(otherCharge.getOtherChargeName());
				otherChargeFromDB.setOtherChargeShortName(otherCharge.getOtherChargeShortName());
				otherChargeFromDB.setCrsCharge(otherCharge.isCrsCharge());
				otherChargeFromDB.setForeCastingRevenue(otherCharge.isForeCastingRevenue());
				otherChargeFromDB.setReoccureCharge(otherCharge.isReoccureCharge());
				otherChargeFromDB.setReoccureChargeFrequency(otherCharge.getReoccureChargeFrequency());
				otherChargeRepository.saveAndFlush(otherChargeFromDB);
				OtherCharge updatedOtherCharge = getOtherChargeById(otherChargeId);
				return updatedOtherCharge;
	}

	@Override
	public OtherCharge getOtherChargeById(Integer id) {
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		  return otherChargeRepository.findByIdAndHotelId(id,hotelId);
	}

	@Override
	public boolean deleteOtherCharge(int otherChargeId) {
		
		 OtherCharge otherCharge = otherChargeRepository.findByIdAndHotelId(otherChargeId,HotelContext.getHotelId()); 
		
		 boolean isDeleted=true;;
		 if(otherCharge == null ) {
			 isDeleted=false;
			 throw new RuntimeException("floor not found");
		 }
		 otherChargeRepository.delete(otherCharge);
		 return isDeleted;
		 
	}

	@Override
	public List<OtherCharge> search(String otherChargeName, String otherChargeShortName, String categoryName) {
		
		 Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT

	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		
		 Specification<OtherCharge> spec = Specification
				 	.where(OtherChargeSpecification.hasHotelId(hotelId)) 
	                .and(OtherChargeSpecification.hasOtherChargeName(otherChargeName))
	                .and(OtherChargeSpecification.hasOtherChargeShortName(otherChargeShortName))
	        		.and(OtherChargeSpecification.hasCategoryName(categoryName));

	        return otherChargeRepository.findAll(spec);
	    }

	}