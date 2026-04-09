/**
 * 
 */
package com.pms.paymenttype.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pms.paymenttype.entity.PaymentType;
import com.pms.paymenttype.service.IPaymentTypeService;

/**
 * 
 */
@RestController
public class PaymentTypeController {
	
	private static final Logger logger = LoggerFactory.getLogger(PaymentTypeController.class);

	@Autowired
	private IPaymentTypeService service;

	@GetMapping("/user/getpaymenttypes")
	public ResponseEntity<List<PaymentType>> getPaymentTypes() {

		List<PaymentType> paymentType = service.getPaymentTypes();
		return new ResponseEntity<List<PaymentType>>(paymentType, HttpStatus.OK);
	}
	
	@GetMapping("/user/getpaymenttype/{id}")
	public ResponseEntity<PaymentType> getPaymentType(@PathVariable("id") Integer id) {
		PaymentType paymentType = service.getPaymentTypeById(id);
		return new ResponseEntity<PaymentType>(paymentType, HttpStatus.OK);
	}
	
	@PostMapping("/admin/createpaymenttype")
	public ResponseEntity<?> createPaymentType(@RequestBody PaymentType paymentType) {
		// Validate input
		if (paymentType == null || paymentType.getCategoryName() == null || paymentType.getCategoryName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("PaymentType CategoryName must not be null or empty");
		}
		
		if (paymentType == null || paymentType.getPaymentTypeName() == null || paymentType.getPaymentTypeName().toString().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("PaymentType PaymentTypeName must not be null or empty");
		}
		
		if (paymentType == null || paymentType.getPaymentTypeShortName() == null || paymentType.getPaymentTypeShortName().toString().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("PaymentType PaymentTypeShortName must not be null or empty");
		}

		try {
			PaymentType savedPaymentType = service.createPaymentType(paymentType);
			return ResponseEntity.ok(savedPaymentType);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the PaymentType");
		}
	}
	
	@PutMapping("/admin/updatepaymenttype/{id}")
	public ResponseEntity<?> updatePaymentType(@PathVariable Integer id, @RequestBody PaymentType paymentTypeDetails) {
		// Validate input
		if (paymentTypeDetails == null || paymentTypeDetails.getCategoryName() == null || paymentTypeDetails.getCategoryName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("PaymentType CategoryName must not be null or empty");
		}

		try {
			PaymentType existingPaymentType = service.getPaymentTypeById(id);
			if (existingPaymentType == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(" with ID " + id + " not found");
			}

			// Update fields
			existingPaymentType.setCategoryName(paymentTypeDetails.getCategoryName());
			existingPaymentType.setDescription(paymentTypeDetails.getDescription());
			existingPaymentType.setPaymentTypeName(paymentTypeDetails.getPaymentTypeName());
			existingPaymentType.setPaymentTypeShortName(paymentTypeDetails.getPaymentTypeShortName());
			existingPaymentType.setCreditCardProcessing(paymentTypeDetails.isCreditCardProcessing());

			PaymentType updatedPaymentType = service.updatePaymentType(existingPaymentType.getId(), existingPaymentType);

			return ResponseEntity.ok(updatedPaymentType);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the PaymentType");
		}
	}
	
	@DeleteMapping("/admin/deletepaymenttype/{id}")
	public ResponseEntity<String> deletePaymentType(@PathVariable("id") int id) {
		boolean isDeleted = service.deletePaymentType(id);
		if (isDeleted) {
			String responseContent = "PaymentType has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting PaymentType from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@GetMapping("/user/paymenttype/search")
    public List<PaymentType> searchPaymentType(
            @RequestParam(required = false) String paymentTypeName,
            @RequestParam(required = false) String paymentTypeShortName,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String description) {
		
        return service.search(paymentTypeName,paymentTypeShortName,categoryName,description);
    }
	
	
	

}
