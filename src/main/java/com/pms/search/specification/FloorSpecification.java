/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.floor.entity.Floor;

/**
 * 
 */

public class FloorSpecification {
	
	public static Specification<Floor> hasName(String floorName) {
        return (root, query, cb) ->
        floorName == null ? null : cb.like(cb.lower(root.get("name")), "%" + floorName.toLowerCase() + "%");
    }
	
	public static Specification<Floor> hasDescription(String description) {
        return (root, query, cb) ->
        description == null ? null : cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%");
    }

}
