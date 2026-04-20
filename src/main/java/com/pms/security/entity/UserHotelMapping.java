/**
 * 
 */
package com.pms.security.entity;

import com.pms.hotel.entity.Hotel;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

/**
 * 
 */
@Entity
public class UserHotelMapping {
	
	 @Id
	    @GeneratedValue
	    private Long id;

	    @ManyToOne
	    private User user;

	    @ManyToOne
	    private Hotel hotel;

	    private String role; // ADMIN / STAFF

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public User getUser() {
			return user;
		}

		public void setUser(User user) {
			this.user = user;
		}

		public Hotel getHotel() {
			return hotel;
		}

		public void setHotel(Hotel hotel) {
			this.hotel = hotel;
		}

		public String getRole() {
			return role;
		}

		public void setRole(String role) {
			this.role = role;
		}

		

}
