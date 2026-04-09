/**
 * 
 */
package com.pms.booking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pms.booking.Booking;
import com.pms.booking.BookingRequest;
import com.pms.booking.service.BookingService;

/**
 * 
 */
@RestController
@CrossOrigin("*")
public class BookingController {
	
	 @Autowired
	    private BookingService service;

	    @PostMapping("/auth/createbooking")
	    public Booking create(@RequestBody BookingRequest req) {
	        return service.createBooking(req);
	    }

	    @GetMapping("/admin/getbookings")
	    public List<Booking> getAll() {
	        return service.getAllBookings();
	    }

}
