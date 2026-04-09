/**
 * 
 */
package com.pms.roomstatus.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.roomstatus.entity.RoomStatus;

/**
 * 
 */
public interface RoomStatusRepository extends JpaRepository<RoomStatus, Integer> , JpaSpecificationExecutor<RoomStatus>{

}

