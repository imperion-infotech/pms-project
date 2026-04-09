/**
 * 
 */
package com.pms.rent.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.rent.RentDetails;
import com.pms.rent.dao.IRentDetailsDAO;

/**
 * 
 */
public interface IRentDetailsService {
	
static final Logger logger = LoggerFactory.getLogger(IRentDetailsService.class);
	
	public List<RentDetails> getRentDetails();
	public RentDetails getRentDetail(int rentDetailsId);
	public RentDetails createRentDetail(RentDetails rentDetails);
	public RentDetails updateRentDetail(int rentDetailsId, RentDetails rentDetail);
	public boolean deleteRentDetail(int rentDetailsId);
	public RentDetails findById(Long id);
	public boolean deleteSoftRentDetails(Long id) ;

}
