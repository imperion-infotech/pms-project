/**
 * 
 */
package com.pms.othercharge.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.common.service.SoftDeleteService;
import com.pms.othercharge.entity.OtherChargeDetails;
import com.pms.othercharge.repository.OtherChargeDetailsRepository;
import com.pms.othercharge.service.IOtherChargeDetailsService;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;

/**
 * 
 */
@Service
public class OtherChargeDetailsServiceImpl implements IOtherChargeDetailsService {
	
	@Autowired
	private OtherChargeDetailsRepository otherChargeDetailsRepository;
	
	@Autowired
	private SoftDeleteService softDeleteService;
	
	public OtherChargeDetailsServiceImpl(OtherChargeDetailsRepository otherChargeDetailsRepository) {
		super();
		this.otherChargeDetailsRepository = otherChargeDetailsRepository;
	}

	@Override
	public List<OtherChargeDetails> getAllOtherChargeDetails() {
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return otherChargeDetailsRepository.findByHotelId(HotelContext.getHotelId());
	}

	@Override
	public OtherChargeDetails createOtherChargeDetails(OtherChargeDetails otherChargeDetails) {
		
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    otherChargeDetails.setCreatedBy(userId);
		return otherChargeDetailsRepository.saveAndFlush(otherChargeDetails);
	}

	@Override
	public OtherChargeDetails updateOtherChargeDetails(Long otherChargeDetailsId,
			OtherChargeDetails otherChargeDetails) { 
		OtherChargeDetails otherChargeDetailsFromDB = getOtherChargeDetailsById(otherChargeDetailsId);
	
		otherChargeDetailsFromDB.setDisplayOnFolio(otherChargeDetails.isDisplayOnFolio());;
		otherChargeDetailsFromDB.setRemark(otherChargeDetails.getRemark());
		otherChargeDetailsFromDB.setTotalCharges(otherChargeDetails.getTotalCharges());
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    otherChargeDetailsFromDB.setUpdatedBy(userId);
	    otherChargeDetailsFromDB.setUpdatedOn(LocalDateTime.now());
		otherChargeDetailsRepository.saveAndFlush(otherChargeDetailsFromDB);
		OtherChargeDetails updateOtherChargeDetails = getOtherChargeDetailsById(otherChargeDetailsId);
		return updateOtherChargeDetails;
	}

	@Override
	public OtherChargeDetails getOtherChargeDetailsById(Long id) {
		
		return otherChargeDetailsRepository.findByIdAndHotelId(id,HotelContext.getHotelId());
	}

	@Override
	public boolean deleteOtherChargeDetails(Long otherChargeDetailsId) {
		
		softDeleteService.softDelete(otherChargeDetailsId, otherChargeDetailsRepository);
		return true;
	}


}
