/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.building.entity.Building;

/**
 * 
 */
public class BuildingSpecification {
	

	public static Specification<Building> hasName(String buildingName) {
        return (root, query, cb) ->
        buildingName == null ? null : cb.like(cb.lower(root.get("name")), "%" + buildingName.toLowerCase() + "%");
    }
	
	public static Specification<Building> hasDescription(String description) {
        return (root, query, cb) ->
        description == null ? null : cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%");
    }

}
