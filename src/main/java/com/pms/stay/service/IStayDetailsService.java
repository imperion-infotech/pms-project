/**
 * 
 */
package com.pms.stay.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.stay.dao.IStatyDetailsDAO;
import com.pms.stay.entity.StayDetails;

/**
 * 
 */
public interface IStayDetailsService {
	
static final Logger logger = LoggerFactory.getLogger(IStatyDetailsDAO.class);
	
	public List<StayDetails> getStayDetails();
	public StayDetails getStayDetail(int stayDetailsId);
	public StayDetails createStayDetails(StayDetails stayDetails);
	public StayDetails updateStayDetails(int stayDetailsId,StayDetails stayDetails);
	public boolean deleteStayDetails(int stayDetailsId);
	public StayDetails findById(Long id);
	public boolean deleteSoftStayDetails(Long id);


}
