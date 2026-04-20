/**
 * 
 */
package com.pms.hotel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pms.hotel.entity.Hotel;

/**
 * 
 */
public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
