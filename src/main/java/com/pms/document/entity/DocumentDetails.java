/**
 * 
 */
package com.pms.document.entity;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.guestdetails.GuestDetails;
import com.pms.personaldetails.PersonalDetails;

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
@Table(name="document_details")
public class DocumentDetails {
	
static final Logger logger = LoggerFactory.getLogger(DocumentDetails.class);
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Integer id;
	
	
	@Column(name="document_number")
	private String documentNumber;
	
	@Column(name="valid_till")
	private Date validTill;
	
	@Column(name="front_image_path")
	private String frontImagePath;
	
	@Column(name="back_image_path")
	private String backImagePath;
	
	@Column(name="remark")
	private String remark;
	
	@Column(name="created_on", nullable = false, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;
	
	 // ✅ FIX: Many documents → one personal
    @ManyToOne
    @JoinColumn(name = "personal_details_id")
    private PersonalDetails personalDetails;

    // ✅ FIX: Many documents → one guest
    @ManyToOne
    @JoinColumn(name = "guest_id")
    private GuestDetails guest;

    // ✅ FIX: remove insertable=false
    @ManyToOne
    @JoinColumn(name = "document_type_id")
    private DocumentType documentType;
	
	// ✅ NEW FIELDS (Soft Delete)
    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    private LocalDateTime deletedAt;

    private String deletedBy;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDocumentNumber() {
		return documentNumber;
	}

	public void setDocumentNumber(String documentNumber) {
		this.documentNumber = documentNumber;
	}

	public Date getValidTill() {
		return validTill;
	}

	public void setValidTill(Date validTill) {
		this.validTill = validTill;
	}

	public String getFrontImagePath() {
		return frontImagePath;
	}

	public void setFrontImagePath(String frontImagePath) {
		this.frontImagePath = frontImagePath;
	}

	public String getBackImagePath() {
		return backImagePath;
	}

	public void setBackImagePath(String backImagePath) {
		this.backImagePath = backImagePath;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public PersonalDetails getPersonalDetails() {
		return personalDetails;
	}

	public void setPersonalDetails(PersonalDetails personalDetails) {
		this.personalDetails = personalDetails;
	}


	public DocumentType getDocumentType() {
		return documentType;
	}

	public void setDocumentType(DocumentType documentType) {
		this.documentType = documentType;
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

	
}