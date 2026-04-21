/**
 * 
 */
package com.pms.rent;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.baseentity.BaseEntity;
import com.pms.taxmaster.entity.TaxMaster;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@Table(name="rent_details")
@SQLRestriction("is_deleted = false")
public class RentDetails extends BaseEntity implements Serializable {
	
static final Logger logger = LoggerFactory.getLogger(RentDetails.class);
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Long id;
	
	@Column(name="rent")
	private Double rent;
	
	@Column(name="basic")
	private Double basic;
	
	@Column(name="tax_id")
	private Long taxId;
	
	@OneToOne
    @JoinColumn(name = "tax_id", insertable = false, updatable = false)
    private TaxMaster taxMaster;
	
	@Column(name="total_rental")
	private Double totalRental;
	
	@Column(name="other_charges")
	private Double otherCharges;
	
	@Column(name="discount")
	private Double discount;
	
	@Column(name="total_charges")
	private Double totalCharges;
	
	@Column(name="payments")
	private Double payments;
	
	@Column(name="cc_authorized")
	private Double ccAuthorized;
	
	@Column(name="deposite")
	private Double deposite;
	
	@Column(name="balance")
	private Double balance;
	
//	 @OneToOne(mappedBy = "rentDetails")
//	 private GuestDetails guest;
	
	 // ✅ NEW FIELDS (Soft Delete)
    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    private LocalDateTime deletedOn;

    private Long deletedBy;
    
	

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public LocalDateTime getDeletedOn() {
		return deletedOn;
	}

	public void setDeletedOn(LocalDateTime deletedOn) {
		this.deletedOn = deletedOn;
	}

	public Long getDeletedBy() {
		return deletedBy;
	}

	public void setDeletedBy(Long deletedBy) {
		this.deletedBy = deletedBy;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}

	public Double getRent() {
		return rent;
	}

	public void setRent(Double rent) {
		this.rent = rent;
	}

	public Double getBasic() {
		return basic;
	}

	public void setBasic(Double basic) {
		this.basic = basic;
	}

	public Long getTaxId() {
		return taxId;
	}

	public void setTaxId(Long taxId) {
		this.taxId = taxId;
	}

	public TaxMaster getTaxMaster() {
		return taxMaster;
	}

	public void setTaxMaster(TaxMaster taxMaster) {
		this.taxMaster = taxMaster;
	}

	public Double getTotalRental() {
		return totalRental;
	}

	public void setTotalRental(Double totalRental) {
		this.totalRental = totalRental;
	}

	public Double getOtherCharges() {
		return otherCharges;
	}

	public void setOtherCharges(Double otherCharges) {
		this.otherCharges = otherCharges;
	}

	public Double getDiscount() {
		return discount;
	}

	public void setDiscount(Double discount) {
		this.discount = discount;
	}

	public Double getTotalCharges() {
		return totalCharges;
	}

	public void setTotalCharges(Double totalCharges) {
		this.totalCharges = totalCharges;
	}

	public Double getPayments() {
		return payments;
	}

	public void setPayments(Double payments) {
		this.payments = payments;
	}

	public Double getCcAuthorized() {
		return ccAuthorized;
	}

	public void setCcAuthorized(Double ccAuthorized) {
		this.ccAuthorized = ccAuthorized;
	}

	public Double getDeposite() {
		return deposite;
	}

	public void setDeposite(Double deposite) {
		this.deposite = deposite;
	}

	public Double getBalance() {
		return balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}
	
	
}
