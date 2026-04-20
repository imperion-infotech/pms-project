/**
 * 
 */
package com.pms.hotel.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pms.auditlog.util.AuditUtil;
import com.pms.hotel.entity.Hotel;
import com.pms.hotel.service.IHotelService;

import jakarta.servlet.http.HttpSession;

/**
 * 
 */
@RestController
@RequestMapping("/hotels")
public class HotelController {
	
	static final Logger logger = LoggerFactory.getLogger(HotelController.class);
	
	@Autowired
	IHotelService service;
    
	
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@PostMapping("/createhotel")
	public ResponseEntity<?> createHotel(@RequestBody Hotel hotel) {
		
		try {
			Hotel savedHotel = service.createHotel(hotel);
			return ResponseEntity.ok(savedHotel);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the Hotel");
		}
	}
	
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateHotel(@PathVariable Integer id, @RequestBody Hotel hotel,HttpSession session) {
		
		try {
			Hotel existingHotel = service.getHotel(Long.valueOf(id));
			if (existingHotel == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hotel with ID " + id + " not found");
			}
			session.setAttribute("oldValue", AuditUtil.toJson(existingHotel));
			// Update fields
			existingHotel.setAddress(hotel.getAddress());
			existingHotel.setCity(hotel.getCity());
			existingHotel.setContactNumber(hotel.getContactNumber());
			existingHotel.setCountry(hotel.getCountry());
			existingHotel.setCreatedOn(hotel.getCreatedOn());
			existingHotel.setEmail(hotel.getEmail());
			existingHotel.setHotelImage(hotel.getHotelImage());
			existingHotel.setHotelLogo(hotel.getHotelLogo());
			existingHotel.setState1(hotel.getState1());
			existingHotel.setStatus(hotel.getStatus());
			existingHotel.setTimezone(hotel.getTimezone());
			existingHotel.setUrl(hotel.getUrl());
			existingHotel.setZipCode(hotel.getZipCode());
			
			Hotel updatedHotel = service.updateHotel(existingHotel.getId(), existingHotel);
			return ResponseEntity.ok(updatedHotel);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the RoomType");
		}
	}
	
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@DeleteMapping("/deletehotel/{id}")
	public ResponseEntity<String> deleteHotel(@PathVariable("id") Long id) {
		boolean isDeleted = service.deleteHotel(id);
		if (isDeleted) {
			String responseContent = "Hotel has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting Hotel from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@GetMapping("/gethotels")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<List<Hotel>> getHotels() {

		List<Hotel> hotel = service.getHotels();
		return new ResponseEntity<List<Hotel>>(hotel, HttpStatus.OK);
	}
	
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/gethotel/{id}")
	public ResponseEntity<Hotel> getHotel(@PathVariable("id") Long id) {
		Hotel hotel = service.getHotel(id);
		return new ResponseEntity<Hotel>(hotel, HttpStatus.OK);
	}

}
