/**
 * 
 */
package com.pms.roomtype.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.roomtype.entity.RoomType;

/**
 * 
 */
public interface RoomTypeRepository  extends JpaRepository<RoomType, Integer> , JpaSpecificationExecutor<RoomType>{

}
