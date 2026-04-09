/**
 * 
 */
package com.pms.booking;

import java.time.LocalDate;

/**
 * 
 */
public class BookingRequest {

	  private String guestName;
	    private LocalDate checkIn;
	    private LocalDate checkOut;
		public String getGuestName() {
			return guestName;
		}
		public void setGuestName(String guestName) {
			this.guestName = guestName;
		}
		public LocalDate getCheckIn() {
			return checkIn;
		}
		public void setCheckIn(LocalDate checkIn) {
			this.checkIn = checkIn;
		}
		public LocalDate getCheckOut() {
			return checkOut;
		}
		public void setCheckOut(LocalDate checkOut) {
			this.checkOut = checkOut;
		}
	    
	    
}
