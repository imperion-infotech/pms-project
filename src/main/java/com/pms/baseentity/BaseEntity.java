/**
 * 
 */
package com.pms.baseentity;

import com.pms.security.configuration.HotelContext;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

/**
 * 
 */
@MappedSuperclass
public abstract class BaseEntity {
	
	 @Column(name = "hotel_id", updatable = false)
	 private Long hotelId;
	 
	 @Column(name = "is_deleted")
	 private Boolean isDeleted = false;

	 @Column(name = "is_active")
	 private Boolean isActive = true;

	 @PrePersist
	 public void prePersist() {
	      this.hotelId = HotelContext.getHotelId();
	 }

	 public Long getHotelId() {
		 return hotelId;
	 }

	 public void setHotelId(Long hotelId) {
		 this.hotelId = hotelId;
	 }

	 public Boolean getIsDeleted() {
		 return isDeleted;
	 }

	 public void setIsDeleted(Boolean isDeleted) {
		 this.isDeleted = isDeleted;
	 }

	 public Boolean getIsActive() {
		 return isActive;
	 }

	 public void setIsActive(Boolean isActive) {
		 this.isActive = isActive;
	 }
	 
}
