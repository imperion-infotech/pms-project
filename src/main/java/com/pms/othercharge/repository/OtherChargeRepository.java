/**
 * 
 */
package com.pms.othercharge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pms.floor.entity.Floor;
import com.pms.othercharge.entity.OtherCharge;

/**
 * 
 */
public interface OtherChargeRepository extends JpaRepository<OtherCharge, Integer>,JpaSpecificationExecutor<OtherCharge>{

	List<OtherCharge> findByHotelId(Long hotelId);
	
	OtherCharge findByIdAndHotelId(Integer otherChargeId,Long hotelId);
	
	@Query("SELECT o FROM OtherCharge o WHERE o.hotelId = :hotelId")
	List<OtherCharge> findOtherCharges(@Param("hotelId") Long hotelId);
}
