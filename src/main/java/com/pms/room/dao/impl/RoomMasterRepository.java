/**
 * 
 */
package com.pms.room.dao.impl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.room.entity.RoomMaster;

/**
 * 
 */
public interface RoomMasterRepository extends JpaRepository<RoomMaster, Integer>, JpaSpecificationExecutor<RoomMaster>{

}
