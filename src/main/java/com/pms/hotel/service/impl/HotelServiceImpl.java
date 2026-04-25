/**
 * 
 */
package com.pms.hotel.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.common.service.SoftDeleteService;
import com.pms.hotel.entity.Hotel;
import com.pms.hotel.repository.HotelRepository;
import com.pms.hotel.service.IHotelService;
import com.pms.security.configuration.UserContext;

/**
 * 
 */
@Service
public class HotelServiceImpl implements IHotelService{
	
	@Autowired
	private HotelRepository hotelRepository;
	
	 @Autowired
     private SoftDeleteService softDeleteService;

	@Override
	public List<Hotel> getHotels() {
		return hotelRepository.findAll();
		
	}

	@Override
	public Hotel createHotel(Hotel hotel) {
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    hotel.setCreatedBy(userId);
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
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    hotel.setUpdatedBy(userId);
	    hotel.setUpdatedOn(LocalDateTime.now());
		hotelRepository.saveAndFlush(hotel);
			return getHotel(hotelId);
		}
		

	

	@Override
	public boolean deleteHotel(Long hotelId) {
		try {
//		hotelRepository.deleteById(hotelId);
		softDeleteService.softDelete(hotelId, hotelRepository);
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
