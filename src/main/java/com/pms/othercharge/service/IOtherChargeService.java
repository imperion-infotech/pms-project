/**
 * 
 */
package com.pms.othercharge.service;

import java.util.List;

import com.pms.othercharge.entity.OtherCharge;

/**
 * 
 */
public interface IOtherChargeService {

	List<OtherCharge> getOtherCharges();
	OtherCharge createOtherCharge(OtherCharge otherCharge);
	OtherCharge updateOtherCharge(int otherChargeId, OtherCharge otherCharge);
	OtherCharge getOtherChargeById(Integer id);
	public boolean deleteOtherCharge(int otherChargeId);
	public List<OtherCharge> search(String otherChargeName,String otherChargeShortName, String categoryName);
}
