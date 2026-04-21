/**
 * 
 */
package com.pms.guestdetails.service;

import java.util.List;

import com.pms.guestdetails.GuestDetails;

/**
 * 
 */
public interface IGuestDetailsService {
	
	public List<GuestDetails> getGuestDetails();
	public GuestDetails getGuestDetail(Long guestDetailsId);
	public GuestDetails createGuestDetail(GuestDetails guestDetails);
	public GuestDetails updateGuestDetails(Long guestDetailsId,GuestDetails guestDetails);
	public boolean deleteSoftStayDetails(Integer id);
	
	

}
