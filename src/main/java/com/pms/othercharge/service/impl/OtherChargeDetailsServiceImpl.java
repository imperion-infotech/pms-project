/**
 * 
 */
package com.pms.othercharge.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.othercharge.entity.OtherCharge;
import com.pms.othercharge.entity.OtherChargeDetails;
import com.pms.othercharge.repository.OtherChargeDetailsRepository;
import com.pms.othercharge.service.IOtherChargeDetailsService;

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
		return otherChargeDetailsRepository.findAll();
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
		return otherChargeDetailsRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("OtherChargeDetails not found with id: " + id));
	}

	@Override
	public boolean deleteOtherChargeDetails(int otherChargeDetailsId) {
		 try {
			 otherChargeDetailsRepository.deleteById(otherChargeDetailsId);
		        return true;
		    } catch (Exception e) {
		        return false;
		    }
	}

}
