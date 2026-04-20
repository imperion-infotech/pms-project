/**
 * 
 */
package com.pms.hotel.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.hotel.entity.Hotel;
import com.pms.hotel.repository.HotelRepository;
import com.pms.hotel.service.IHotelService;

/**
 * 
 */
@Service
public class HotelServiceImpl implements IHotelService{
	
	@Autowired
	private HotelRepository hotelRepository;

	@Override
	public List<Hotel> getHotels() {
		return hotelRepository.findAll();
		
	}

	@Override
	public Hotel createHotel(Hotel hotel) {
	Hotel b=hotelRepository.saveAndFlush(hotel);
	return getHotel(b.getId());
	}

	@Override
	public Hotel getHotel(Long hotelId) {
		return hotelRepository.findById(hotelId)
				.orElseThrow(() -> new RuntimeException("Hotel not found"));
	}
	
	@Override
	public Hotel updateHotel(Long hotelId, Hotel hotel) {
	
		hotelRepository.saveAndFlush(hotel);
			return getHotel(hotelId);
		}
		

	

	@Override
	public boolean deleteHotel(Long hotelId) {
		try {
		hotelRepository.deleteById(hotelId);
		return true;
		}catch(Exception e) {
			return false;
		}
		
		
	}

	@Override
	public Hotel getHotelById(Long id) {
		return hotelRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Hotel not found"));
	}

	@Override
	public List<Hotel> search(String name, String description) {
		// TODO Auto-generated method stub
		return null;
	}

	
}
