/**
 * 
 */
package com.pms.baseentity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.pms.security.configuration.HotelContext;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;

/**
 * 
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
	
	 @Column(name = "hotel_id", updatable = false)
	    private Long hotelId;

	    @Column(name = "is_deleted")
	    private Boolean isDeleted = false;

	    @Column(name = "is_active")
	    private Boolean isActive = true;

	    @CreatedBy
	    @Column(name = "created_by", updatable = false)
	    private Long createdBy;

	    @CreatedDate
	    @Column(name = "created_on", updatable = false)
	    private LocalDateTime createdOn;

	    @LastModifiedBy
	    @Column(name = "updated_by")
	    private Long updatedBy;

	    @LastModifiedDate
	    @Column(name = "updated_on")
	    private LocalDateTime updatedOn;

	    @Column(name = "deleted_by")
	    private Long deletedBy;

	    @Column(name = "deleted_on")
	    private LocalDateTime deletedOn;

	    @PrePersist
	    public void prePersist() {
	    	 createdOn = LocalDateTime.now();
	        if (this.hotelId == null) {
	            this.hotelId = HotelContext.getHotelId();
	        }
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

		public Long getCreatedBy() {
			return createdBy;
		}

		public void setCreatedBy(Long createdBy) {
			this.createdBy = createdBy;
		}

		public LocalDateTime getCreatedOn() {
			return createdOn;
		}

		public void setCreatedOn(LocalDateTime createdOn) {
			this.createdOn = createdOn;
		}

		public Long getUpdatedBy() {
			return updatedBy;
		}

		public void setUpdatedBy(Long updatedBy) {
			this.updatedBy = updatedBy;
		}

		public LocalDateTime getUpdatedOn() {
			return updatedOn;
		}

		public void setUpdatedOn(LocalDateTime updatedOn) {
			this.updatedOn = updatedOn;
		}

		public Long getDeletedBy() {
			return deletedBy;
		}

		public void setDeletedBy(Long deletedBy) {
			this.deletedBy = deletedBy;
		}

		public LocalDateTime getDeletedOn() {
			return deletedOn;
		}

		public void setDeletedOn(LocalDateTime deletedOn) {
			this.deletedOn = deletedOn;
		}
	    
}
