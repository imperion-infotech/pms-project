/**
 * 
 */
package com.pms.hotel.service;

import java.util.List;

import com.pms.hotel.entity.Hotel;

/**
 * 
 */
public interface IHotelService {
	
	List<Hotel> getHotels();
	Hotel createHotel(Hotel hotel);
	Hotel updateHotel(Long hotelId, Hotel hotel);
	Hotel getHotel(Long hotelId);
	boolean deleteHotel(Long hotelId);
	Hotel getHotelById(Long id);
	public List<Hotel> search(String name,String description);

}
