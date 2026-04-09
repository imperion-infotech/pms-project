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

import com.pms.othercharge.entity.OtherCharge;
import com.pms.othercharge.repository.OtherChargeRepository;
import com.pms.othercharge.service.IOtherChargeService;
import com.pms.search.specification.OtherChargeSpecification;
import com.pms.search.specification.PaymentTypeSpecification;

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
		return otherChargeRepository.findAll();
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
		  return otherChargeRepository.findById(id)
		            .orElseThrow(() -> new RuntimeException("OtherCharge not found with id: " + id));
	}

	@Override
	public boolean deleteOtherCharge(int otherChargeId) {
		 try {
			 otherChargeRepository.deleteById(otherChargeId);
		        return true;
		    } catch (Exception e) {
		        return false;
		    }
	}

	@Override
	public List<OtherCharge> search(String otherChargeName, String otherChargeShortName, String categoryName) {
		 Specification<OtherCharge> spec = Specification
	                .where(OtherChargeSpecification.hasOtherChargeName(otherChargeName))
	                .and(OtherChargeSpecification.hasOtherChargeShortName(otherChargeShortName))
	        		.and(OtherChargeSpecification.hasCategoryName(categoryName));

	        return otherChargeRepository.findAll(spec);
	    }

	}