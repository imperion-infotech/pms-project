/**
 * 
 */
package com.pms.security.dto;

import java.util.List;

/**
 * 
 */
public class LoginResponse {
	
	 private String token;
	 private List<HotelDTO> hotels;
	 public String getToken() {
		 return token;
	 }
	 public void setToken(String token) {
		 this.token = token;
	 }
	 public List<HotelDTO> getHotels() {
		 return hotels;
	 }
	 public void setHotels(List<HotelDTO> hotels) {
		 this.hotels = hotels;
	 }
}
