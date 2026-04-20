/**
 * 
 */
package com.pms.paymentdetails.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pms.paymentdetails.entity.PaymentDetails;
import com.pms.paymentdetails.entity.PaymentDetailsResponseDTO;
import com.pms.paymentdetails.service.IPaymentDetailsService;

/**
 * 
 */
@RestController
public class PaymentDetailsController {
	
	private static final Logger logger = LoggerFactory.getLogger(PaymentDetailsController.class);

	@Autowired
	private IPaymentDetailsService service;
	
	@GetMapping("/user/getAllpaymentdetails")
	public ResponseEntity<List<PaymentDetails>> getPaymentDetails() {
		List<PaymentDetails> paymentDetails = service.getAllPaymentDetails();
		
		return new ResponseEntity<List<PaymentDetails>>(paymentDetails, HttpStatus.OK);
	}
	
	@GetMapping("/user/getpaymentdetails/{id}")
	public ResponseEntity<PaymentDetails> getPaymentDetails(@PathVariable("id") Integer id) {
		PaymentDetails paymentDetails = service.getPaymentDetailsById(id);
		return new ResponseEntity<PaymentDetails>(paymentDetails, HttpStatus.OK);
	}
	
	@PostMapping("/admin/createpaymentdetails")
	public ResponseEntity<?> createPaymentDetails(@RequestBody PaymentDetails paymentDetails) {
		// Validate input
//		if (paymentDetails == null || paymentDetails.getPaymentType()== null ) {
//			return ResponseEntity.badRequest().body("PaymentDetails PaymentType must not be null or empty");
//		}
		
		if (paymentDetails == null || paymentDetails.getCurrencySymbol() == null || paymentDetails.getCurrencySymbol().toString().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("PaymentDetails CurrencySymbol must not be null or empty");
		}
		
		if (paymentDetails == null || paymentDetails.getPaymentDate() == null) {
			return ResponseEntity.badRequest().body("PaymentDetails payment date must not be null or empty");
		}
		
//		if (paymentDetails == null || paymentDetails.getGuestDetails() == null) {
//			return ResponseEntity.badRequest().body("PaymentDetails guestdetails id must not be null or empty");
//		}
		
		try {
			PaymentDetails savedPaymentDetails = service.createPaymentDetails(paymentDetails);
			return ResponseEntity.ok(savedPaymentDetails);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the PaymentDetails");
		}
	}
	
	
	@PutMapping("/admin/updatepaymentdetails/{id}")
	public ResponseEntity<?> updatePaymentDetails(@PathVariable Integer id, @RequestBody PaymentDetails paymentDetails) {
		// Validate input
		if (paymentDetails == null || paymentDetails.getPaymentType()== null ) {
			return ResponseEntity.badRequest().body("PaymentDetails PaymentType must not be null or empty");
		}
		
		if (paymentDetails == null || paymentDetails.getCurrencySymbol() == null || paymentDetails.getCurrencySymbol().toString().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("PaymentDetails CurrencySymbol must not be null or empty");
		}

		try {
			PaymentDetails existingPaymentDetails = service.getPaymentDetailsById(id);
			if (existingPaymentDetails == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(" with ID " + id + " not found");
			}

			// Update fields
			existingPaymentDetails.setAmount(paymentDetails.getAmount());
			existingPaymentDetails.setAuthorizationNo(paymentDetails.getAuthorizationNo());
			existingPaymentDetails.setCardNo(paymentDetails.getCardNo());
			existingPaymentDetails.setCurrencySymbol(paymentDetails.getCurrencySymbol());
			existingPaymentDetails.setPaymentType(paymentDetails.getPaymentType());
			existingPaymentDetails.setReceiptNo(paymentDetails.getReceiptNo());
			existingPaymentDetails.setRemark(paymentDetails.getRemark());
			existingPaymentDetails.setValidTill(paymentDetails.getValidTill());
			existingPaymentDetails.setGuestDetails(paymentDetails.getGuestDetails());
			

			PaymentDetails updatedPaymentDetails = service.updatePaymentDetails(existingPaymentDetails.getId(), existingPaymentDetails);

			return ResponseEntity.ok(updatedPaymentDetails);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the PaymentDetails");
		}
	}
	
	@DeleteMapping("/admin/deletepaymentdetails/{id}")
	public ResponseEntity<String> deletePaymentDetails(@PathVariable("id") int id) {
		boolean isDeleted = service.deletePaymentDetails(id);
		if (isDeleted) {
			String responseContent = "PaymentDetails has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting PaymentDetails from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	 @GetMapping("/user/guest/{guestId}")
	    public ResponseEntity<List<PaymentDetailsResponseDTO>> getPaymentsByGuest(
	            @PathVariable Long guestId) {

	        List<PaymentDetailsResponseDTO> response =
	        		service.getPaymentsByGuestId(guestId);

	        return ResponseEntity.ok(response);
	    }

}
