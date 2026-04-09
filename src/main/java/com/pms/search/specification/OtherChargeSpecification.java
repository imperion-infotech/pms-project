/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.othercharge.entity.OtherCharge;

/**
 * 
 */
public class OtherChargeSpecification {
//	String otherChargeName, String otherChargeShortName, String categoryName
	public static Specification<OtherCharge> hasOtherChargeName(String otherChargeName) {
        return (root, query, cb) ->
        otherChargeName == null ? null : cb.like(cb.lower(root.get("otherChargeName")), "%" + otherChargeName.toLowerCase() + "%");
    }
	
	public static Specification<OtherCharge> hasOtherChargeShortName(String otherChargeShortName) {
        return (root, query, cb) ->
        otherChargeShortName == null ? null : cb.like(cb.lower(root.get("otherChargeShortName")), "%" + otherChargeShortName.toLowerCase() + "%");
    }
	
	public static Specification<OtherCharge> hasCategoryName(String categoryName) {
        return (root, query, cb) ->
        categoryName == null ? null : cb.like(cb.lower(root.get("categoryName")), "%" + categoryName.toLowerCase() + "%");
    }
	
}
