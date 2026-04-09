/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.room.entity.RoomMaster;

/**
 * 
 */
public class RoomMasterSpecification {
	
	public static Specification<RoomMaster> hasRoomName(String roomName) {
        return (root, query, cb) ->
        roomName == null ? null : cb.like(cb.lower(root.get("roomName")), "%" + roomName.toLowerCase() + "%");
    }
	
	public static Specification<RoomMaster> hasRoomShortName(String roomShortName) {
        return (root, query, cb) ->
        roomShortName == null ? null : cb.like(cb.lower(root.get("roomShortName")), "%" + roomShortName.toLowerCase() + "%");
    }
	
	public static Specification<RoomMaster> hasFloorName(String floorName) {
        return (root, query, cb) ->
        floorName == null ? null : cb.like(cb.lower(root.get("name")), "%" + floorName.toLowerCase() + "%");
    }
	
	

}
