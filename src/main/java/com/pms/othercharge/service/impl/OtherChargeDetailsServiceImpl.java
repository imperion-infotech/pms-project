/**
 * 
 */
package com.pms.othercharge.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.floor.entity.Floor;
import com.pms.othercharge.entity.OtherCharge;
import com.pms.othercharge.entity.OtherChargeDetails;
import com.pms.othercharge.repository.OtherChargeDetailsRepository;
import com.pms.othercharge.service.IOtherChargeDetailsService;
import com.pms.security.configuration.HotelContext;

/**
 * 
 */
@Service
public class OtherChargeDetailsServiceImpl implements IOtherChargeDetailsService {
	
	@Autowired
	private OtherChargeDetailsRepository otherChargeDetailsRepository;
	
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
		return otherChargeDetailsRepository.saveAndFlush(otherChargeDetails);
	}

	@Override
	public OtherChargeDetails updateOtherChargeDetails(int otherChargeDetailsId,
			OtherChargeDetails otherChargeDetails) { 
		OtherChargeDetails otherChargeDetailsFromDB = getOtherChargeDetailsById(otherChargeDetailsId);
	
		otherChargeDetailsFromDB.setDisplayOnFolio(otherChargeDetails.isDisplayOnFolio());;
		otherChargeDetailsFromDB.setRemark(otherChargeDetails.getRemark());
		otherChargeDetailsFromDB.setTotalCharges(otherChargeDetails.getTotalCharges());
		otherChargeDetailsRepository.saveAndFlush(otherChargeDetailsFromDB);
		OtherChargeDetails updateOtherChargeDetails = getOtherChargeDetailsById(otherChargeDetailsId);
		return updateOtherChargeDetails;
	}

	@Override
	public OtherChargeDetails getOtherChargeDetailsById(Integer id) {
		
		return otherChargeDetailsRepository.findByIdAndHotelId(id,HotelContext.getHotelId());
	}

	@Override
	public boolean deleteOtherChargeDetails(int otherChargeDetailsId) {
		
		OtherChargeDetails otherChargeDetails = otherChargeDetailsRepository.findByIdAndHotelId(otherChargeDetailsId,HotelContext.getHotelId());
		 boolean isDeleted=true;;
		 if(otherChargeDetails == null ) {
			 isDeleted=false;
			 throw new RuntimeException("floor not found");
		 }
		 otherChargeDetailsRepository.delete(otherChargeDetails);
		 return isDeleted;
	}	

}
