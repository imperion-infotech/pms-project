/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.floor.entity.Floor;
import com.pms.roomtype.entity.RoomType;

/**
 * 
 */
public class RoomTypeSpecification {
	
	public static Specification<RoomType> hasRoomTypeName(String roomTypeName) {
        return (root, query, cb) ->
        roomTypeName == null ? null : cb.like(cb.lower(root.get("roomTypeName")), "%" + roomTypeName.toLowerCase() + "%");
    }
	
	public static Specification<RoomType> hasShortName(String shortName) {
        return (root, query, cb) ->
        shortName == null ? null : cb.like(cb.lower(root.get("shortName")), "%" + shortName.toLowerCase() + "%");
    }
	
	public static Specification<RoomType> hasPrice(Double price) {
		 return (root, query, cb) ->
	        price == null ? null : cb.equal(root.get("price"), price);
    }


}
