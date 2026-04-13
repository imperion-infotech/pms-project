/**
 * 
 */
package com.pms.paymentdetails.entity;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

/**
 * 
 */
@Data
@Builder
public class PaymentDetailsResponseDTO {
	    private Integer id;
	    private Double amount;
	    private Double totalAmount;
	    private String paymentMode;
	    private String receiptNumber;
	    private String remark;
	    private LocalDate paymentDate;
	    
	    public PaymentDetailsResponseDTO()
	    {}	    
	    public PaymentDetailsResponseDTO(Integer id, Double amount, Double totalAmount, String paymentMode,
				String receiptNumber, String remark, LocalDate paymentDate) {
			super();
			this.id = id;
			this.amount = amount;
			this.totalAmount = totalAmount;
			this.paymentMode = paymentMode;
			this.receiptNumber = receiptNumber;
			this.remark = remark;
			this.paymentDate = paymentDate;
		}
		public Integer getId() {
			return id;
		}
		public void setId(Integer id) {
			this.id = id;
		}
		public Double getAmount() {
			return amount;
		}
		public void setAmount(Double amount) {
			this.amount = amount;
		}
		public Double getTotalAmount() {
			return totalAmount;
		}
		public void setTotalAmount(Double totalAmount) {
			this.totalAmount = totalAmount;
		}
		public String getPaymentMode() {
			return paymentMode;
		}
		public void setPaymentMode(String paymentMode) {
			this.paymentMode = paymentMode;
		}
		public String getReceiptNumber() {
			return receiptNumber;
		}
		public void setReceiptNumber(String receiptNumber) {
			this.receiptNumber = receiptNumber;
		}
		public String getRemark() {
			return remark;
		}
		public void setRemark(String remark) {
			this.remark = remark;
		}
		public LocalDate getPaymentDate() {
			return paymentDate;
		}
		public void setPaymentDate(LocalDate paymentDate) {
			this.paymentDate = paymentDate;
		}

}

