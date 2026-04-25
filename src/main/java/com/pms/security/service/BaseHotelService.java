/**
 * 
 */
package com.pms.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.baseentity.BaseEntity;
import com.pms.hotel.entity.Hotel;
import com.pms.hotel.repository.HotelRepository;
import com.pms.security.configuration.HotelContext;
import com.pms.security.entity.User;

import lombok.RequiredArgsConstructor;

/**
 * 
 */
@Service
@RequiredArgsConstructor
public class BaseHotelService {

	  @Autowired
	  private AuthService authService;
	  @Autowired
	  private HotelRepository hotelRepository;

	    protected boolean isSuperAdmin() {
	        return "ROLE_SUPER_ADMIN".equals(authService.getCurrentUser().getRole().getName());
	    }
	    
	    protected void validateHotelAccess(Long entityHotelId) {

	        if (isSuperAdmin()) {
	            return;
	        }

	        Long currentHotelId = HotelContext.getHotelId();

	        if (!currentHotelId.equals(entityHotelId)) {
	            throw new RuntimeException("Access denied for this hotel resource");
	        }
	    }
	    protected Long resolveHotelId(Long hotelId) {

	        User currentUser = authService.getCurrentUser();

	        if (isSuperAdmin()) {

	            if (hotelId == null) {
	                throw new RuntimeException("Hotel Id is required for SUPER_ADMIN");
	            }

	            Hotel hotel = hotelRepository.findById(hotelId)
	                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

	            return hotel.getId();
	        }

	        return currentUser.getHotel().getId();
	    }

	    protected <T extends BaseEntity> void assignHotel(T entity, Long hotelId) {
	        entity.setHotelId(resolveHotelId(hotelId));
	    }
}
