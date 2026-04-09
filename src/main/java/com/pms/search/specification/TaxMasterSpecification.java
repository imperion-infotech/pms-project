/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.roomtype.entity.RoomType;
import com.pms.taxmaster.entity.TaxMaster;

/**
 * 
 */
public class TaxMasterSpecification {

	
	public static Specification<TaxMaster> hasTaxMasterName(String taxMasterName) {
        return (root, query, cb) ->
        taxMasterName == null ? null : cb.like(cb.lower(root.get("taxMasterName")), "%" + taxMasterName.toLowerCase() + "%");
    }
	
	public static Specification<TaxMaster> hasTaxTypeEnum(String taxTypeEnum) {
        return (root, query, cb) ->
        taxTypeEnum == null ? null : cb.like(cb.lower(root.get("taxTypeEnum")), "%" + taxTypeEnum.toLowerCase() + "%");
    }
}
