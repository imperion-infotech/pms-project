/**
 * 
 */
package com.pms.personaldetails;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pms.document.entity.DocumentDetails;
import com.pms.guestdetails.GuestDetails;
import com.pms.personaldetails.controller.ContactInformationTypeEnum;
import com.pms.stay.entity.StayStatusEnum;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
@Table(name="personal_details")
public class PersonalDetails {
	
static final Logger logger = LoggerFactory.getLogger(PersonalDetails.class);
	
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "firstname is required")
    @Column(nullable = false)
    private String firstName;
    
    @NotBlank(message = "lastname is required")
    @Column(nullable = false)
    private String lastName;
    
    @NotBlank(message = "company name is required")
    @Column(nullable = false)
    private String companyName;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String phone;
  
    @Email(message = "Invalid email format")
    @Column(unique = false, nullable = false)
    private String email;
    
    private String address;

    @Column(unique = true, nullable = true)
    private String profilePhoto;
    
    @Column(unique = true, nullable = true)
    private String signature;
    
    @Column(name="created_on", nullable = true, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;
    
    // ✅ NEW FIELDS (Soft Delete)
    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    private LocalDateTime deletedAt;

    private String deletedBy;
    
   
//    // ✅ Correct OneToOne (inverse side)
//    @OneToOne(mappedBy = "personalDetails", cascade = CascadeType.ALL)
//    private GuestDetails guest;

    // ✅ NEW: One person → many documents
    @OneToMany(mappedBy = "personalDetails", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DocumentDetails> documents;
    
    private String folioNo;
    
    private String crsFolioNo;
    
    private ContactInformationTypeEnum contactInformationTypeEnum =ContactInformationTypeEnum.HOME ;
    
	public ContactInformationTypeEnum getContactInformationTypeEnum() {
		return contactInformationTypeEnum;
	}

	public void setContactInformationTypeEnum(ContactInformationTypeEnum contactInformationTypeEnum) {
		this.contactInformationTypeEnum = contactInformationTypeEnum;
	}

	public String getFolioNo() {
		return folioNo;
	}

	public void setFolioNo(String folioNo) {
		this.folioNo = folioNo;
	}

	public String getCrsFolioNo() {
		return crsFolioNo;
	}

	public void setCrsFolioNo(String crsFolioNo) {
		this.crsFolioNo = crsFolioNo;
	}

	public Long getId() {
		return id;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	
	public List<DocumentDetails> getDocuments() {
		return documents;
	}

	public void setDocuments(List<DocumentDetails> documents) {
		this.documents = documents;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getFirstName() {
		return firstName;
	}


	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}


	public String getLastName() {
		return lastName;
	}


	public void setLastName(String lastName) {
		this.lastName = lastName;
	}


	public String getPhone() {
		return phone;
	}


	public void setPhone(String phone) {
		this.phone = phone;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	public String getCompanyName() {
		return companyName;
	}


	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getProfilePhoto() {
		return profilePhoto;
	}

	public void setProfilePhoto(String profilePhoto) {
		this.profilePhoto = profilePhoto;
	}

	public String getSignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
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
