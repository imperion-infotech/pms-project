/**
 * 
 */
package com.pms.paymenttype.entity;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="payment_type")
@Entity
@Data
public class PaymentType implements Serializable{
	
static final Logger logger = LoggerFactory.getLogger(PaymentType.class);
	
	private static final long serialVersionUID = 1L;
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Integer id;
	
	@Column(name="payment_type_name")
	private String paymentTypeName;
	
	@Column(name="payment_type_short_name")
	private String paymentTypeShortName;
	
	@Column(name="category_name")
	private String categoryName;
	
	@Column(name="description")
	private String description;
	
	@Column(name="is_creditcard_processing")
	private Boolean creditCardProcessing;
	
	@Column(name="created_on", nullable = false, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getPaymentTypeName() {
		return paymentTypeName;
	}

	public void setPaymentTypeName(String paymentTypeName) {
		this.paymentTypeName = paymentTypeName;
	}

	public String getPaymentTypeShortName() {
		return paymentTypeShortName;
	}

	public void setPaymentTypeShortName(String paymentTypeShortName) {
		this.paymentTypeShortName = paymentTypeShortName;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	

	public Boolean isCreditCardProcessing() {
		return creditCardProcessing;
	}

	public void setCreditCardProcessing(Boolean creditCardProcessing) {
		this.creditCardProcessing = creditCardProcessing;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

}
