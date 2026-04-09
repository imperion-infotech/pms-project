/**
 * 
 */
package com.pms.guestdetails;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pms.document.entity.DocumentDetails;
import com.pms.personaldetails.PersonalDetails;
import com.pms.rent.RentDetails;
import com.pms.room.entity.RoomMaster;
import com.pms.stay.entity.StayDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="guest_details")
public class GuestDetails {
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="guest_details_id")
	private Integer id;
	
	@Column(name="created_on", nullable = false, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;
	
	@ManyToOne
    @JoinColumn(name = "room_master_id", insertable = false, updatable = false)
	@JsonIgnore
    private RoomMaster roomMaster;
	
	@Column(name="room_master_id")
	private Integer roomMasterId;
	
	
	// ✅ FIX: owning side
//    @ManyToOne
//    @JoinColumn(name = "personal_details_id")
//    private PersonalDetails personalDetails;
    
    @Column(name="personal_details_id")
    private Integer personalDetailsId;
    
    @Column(name="document_details_id")
    private Integer documentDetailsId;
    
    @Column(name="rent_details_id")
    private Integer rentDetailsId;
    
    @Column(name="stay_details_id")
    private Integer stayDetailsId;
    
    

    // ✅ FIX: One guest → many documents
//    @OneToMany(mappedBy = "guest")
//    @JsonIgnore
//    private List<DocumentDetails> documentDetails;

    // ✅ FIX: One guest → one rent
//    @OneToOne(cascade = CascadeType.ALL)
//    @ManyToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "rent_id")
//    @JsonIgnore
//    private RentDetails rentDetails;
    
    
 // ✅ FIX: owning side
//    @OneToOne
//    @JoinColumn(name = "stay_details_id")
//    @JsonIgnore
//    private StayDetails stayDetails;
    
	

	@Column(name="check_in_date")
	private LocalDateTime checkInDate;

	@Column(name="check_out_date")
	private LocalDateTime checkOutDate;
	
	@Column(name="check_in_time")
	private LocalTime  checkInTime;
	
	@Column(name="check_out_time")
	private LocalTime checkOutTime;
	
	@Column(name="no_of_days")
	private Integer noOfDays;
	
	@Column(name="guest_details_status")
	private String guestDetailsStatus;
	
	 // ✅ NEW FIELDS (Soft Delete)
    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    private LocalDateTime deletedAt;

    private String deletedBy;
	
	public RoomMaster getRoomMaster() {
		return roomMaster;
	}

	public void setRoomMaster(RoomMaster roomMaster) {
		this.roomMaster = roomMaster;
	}

	
	
	public LocalDateTime getCheckInDate() {
		return checkInDate;
	}

	public void setCheckInDate(LocalDateTime checkInDate) {
		this.checkInDate = checkInDate;
	}

	public LocalDateTime getCheckOutDate() {
		return checkOutDate;
	}

	public void setCheckOutDate(LocalDateTime checkOutDate) {
		this.checkOutDate = checkOutDate;
	}

	public LocalTime getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(LocalTime checkInTime) {
		this.checkInTime = checkInTime;
	}

	public LocalTime getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(LocalTime checkOutTime) {
		this.checkOutTime = checkOutTime;
	}

	public String getGuestDetailsStatus() {
		return guestDetailsStatus;
	}

	public void setGuestDetailsStatus(String guestDetailsStatus) {
		this.guestDetailsStatus = guestDetailsStatus;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public Integer getRoomMasterId() {
		return roomMasterId;
	}

	public void setRoomMasterId(Integer roomMasterId) {
		this.roomMasterId = roomMasterId;
	}


	public Integer getNoOfDays() {
		return noOfDays;
	}

	public void setNoOfDays(Integer noOfDays) {
		this.noOfDays = noOfDays;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public LocalDateTime getDeletedAt() {
		return deletedAt;
	}

	public void setDeletedAt(LocalDateTime deletedAt) {
		this.deletedAt = deletedAt;
	}

	public String getDeletedBy() {
		return deletedBy;
	}

	public void setDeletedBy(String deletedBy) {
		this.deletedBy = deletedBy;
	}

	public int getPersonalDetailsId() {
		return personalDetailsId;
	}

	public void setPersonalDetailsId(Integer personalDetailsId) {
		this.personalDetailsId = personalDetailsId;
	}

	public Integer getDocumentDetailsId() {
		return documentDetailsId;
	}

	public void setDocumentDetailsId(Integer documentDetailsId) {
		this.documentDetailsId = documentDetailsId;
	}

	public Integer getRentDetailsId() {
		return rentDetailsId;
	}

	public void setRentDetailsId(Integer rentDetailsId) {
		this.rentDetailsId = rentDetailsId;
	}

	public Integer getStayDetailsId() {
		return stayDetailsId;
	}

	public void setStayDetailsId(Integer stayDetailsId) {
		this.stayDetailsId = stayDetailsId;
	}
	
}
