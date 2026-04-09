/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.roomstatus.entity.RoomStatus;

/**
 * 
 */
public class RoomStatusSpecification {
	
	public static Specification<RoomStatus> hasName(String roomStatusName) {
        return (root, query, cb) ->
        roomStatusName == null ? null : cb.like(cb.lower(root.get("roomStatusName")), "%" + roomStatusName.toLowerCase() + "%");
    }
	
	public static Specification<RoomStatus> hasDescription(String roomStatusTitle) {
        return (root, query, cb) ->
        roomStatusTitle == null ? null : cb.like(cb.lower(root.get("roomStatusTitle")), "%" + roomStatusTitle.toLowerCase() + "%");
    }

	
	

}
