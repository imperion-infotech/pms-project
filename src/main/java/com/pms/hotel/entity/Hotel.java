/**
 * 
 */
package com.pms.hotel.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * 
 */
@Entity
public class Hotel implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Hotel name is required")
    @Column(name="hotel_name")
    private String hotelName;
    
    @NotBlank(message = "URL is required")
    @Column(name="url")
    private String url;

    @NotBlank(message = "Address is required")
    @Column(name="address")
    private String address;
    
    @NotBlank(message = "City is required")
    @Column(name="city")
    private String city;
    
    @NotBlank(message = "State is required")
    @Column(name="state1")
    private String state1;
    
    @NotBlank(message = "Country is required")
    @Column(name="country")
    private String country;
    
    @NotBlank(message = "Zip code is required")
    @Column(name="zipcode")
    private String zipCode;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(name="email")
    private String email;
    
    @NotBlank(message = "Contact number is required")
//    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    @Column(name="contact_number")
    private String contactNumber;
    
    @NotBlank(message = "Status is required")
    @Column(name="status")
    private String status;
    
    @NotBlank(message = "Timezone is required")
    @Column(name="timezone")
    private String timezone;
    
    @Column(name="hotel_logo")
    private String hotelLogo;
    
    @Column(name="hotel_image")
    private String hotelImage;
    
    @Column(name="created_on")
    @CreationTimestamp // Automatically sets value when entity is persisted
    private LocalDateTime  createdOn;
    
    @Column(name="updated_on")
    @UpdateTimestamp // Automatically sets value when entity is persisted
    private LocalDateTime  updatedOn;
    
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getHotelName() {
		return hotelName;
	}

	public void setHotelName(String hotelName) {
		this.hotelName = hotelName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState1() {
		return state1;
	}

	public void setState1(String state1) {
		this.state1 = state1;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTimezone() {
		return timezone;
	}

	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}

	public String getHotelLogo() {
		return hotelLogo;
	}

	public void setHotelLogo(String hotelLogo) {
		this.hotelLogo = hotelLogo;
	}

	public String getHotelImage() {
		return hotelImage;
	}

	public void setHotelImage(String hotelImage) {
		this.hotelImage = hotelImage;
	}

	public LocalDateTime  getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(LocalDateTime  createdOn) {
		this.createdOn = createdOn;
	}

	public LocalDateTime  getUpdatedOn() {
		return updatedOn;
	}

	public void setUpdatedOn(LocalDateTime  updatedOn) {
		updatedOn = updatedOn;
	}
	
	
    
}