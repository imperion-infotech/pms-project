package com.pms.booking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.booking.Booking;
import com.pms.booking.BookingRequest;
import com.pms.room.entity.RoomMaster;
import com.pms.security.repository.BookingRepository;
import com.pms.security.repository.RoomRepository;

@Service
public class BookingService implements IBookingService {

		@Autowired
	    private BookingRepository bookingRepo;

	    @Autowired
	    private RoomRepository roomRepo;
	    
	    public Booking createBooking(BookingRequest req) {

	        RoomMaster roomMaster = roomRepo.findFirstByRoomStatus("AVAILABLE");
	        roomMaster.setRoomStatus("BOOKED");

	        Booking booking = new Booking();
	        booking.setGuestName(req.getGuestName());
	        booking.setCheckIn(req.getCheckIn());
	        booking.setCheckOut(req.getCheckOut());
	        booking.setSource("OTA");
	        booking.setStatus("CONFIRMED");
	        booking.setRoomMaster(roomMaster);

	        return bookingRepo.save(booking);
	    }

	    public List<Booking> getAllBookings() {
	        return bookingRepo.findAll();
	    }

}
