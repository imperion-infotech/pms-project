/**
 * 
 */
package com.pms.booking.service;

import java.util.List;

import com.pms.booking.Booking;
import com.pms.booking.BookingRequest;

/**
 * 
 */
public interface IBookingService {
	
	public Booking createBooking(BookingRequest req);
	
	 public List<Booking> getAllBookings();
	

}
