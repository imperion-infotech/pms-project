/**
 * 
 */
package com.pms.othercharge.controller;

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

import com.pms.othercharge.entity.OtherChargeDetails;
import com.pms.othercharge.service.IOtherChargeDetailsService;

/**
 * 
 */
@RestController
public class OtherChargeDetailsController {
	
	private static final Logger logger = LoggerFactory.getLogger(OtherChargeDetailsController.class);

	@Autowired
	private IOtherChargeDetailsService service;
	
	@GetMapping("/user/getallotherchargedetails")
	public ResponseEntity<List<OtherChargeDetails>> getOtherChargeDetails() {
		List<OtherChargeDetails> otherChargeDetails = service.getAllOtherChargeDetails();
		return new ResponseEntity<List<OtherChargeDetails>>(otherChargeDetails, HttpStatus.OK);
	}
	
	@GetMapping("/user/getotherchargedetails/{id}")
	public ResponseEntity<OtherChargeDetails> getOtherChargeDetails(@PathVariable("id") Long id) {
		OtherChargeDetails otherChargeDetails = service.getOtherChargeDetailsById(id);
		return new ResponseEntity<OtherChargeDetails>(otherChargeDetails, HttpStatus.OK);
	}
	
	@PostMapping("/admin/createotherchargedetails")
	public ResponseEntity<?> createOtherChargeDetails(@RequestBody OtherChargeDetails otherChargeDetails) {
		// Validate input
		if (otherChargeDetails == null || otherChargeDetails.getRemark() == null || otherChargeDetails.getRemark().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("otherChargeDetails remark must not be null or empty");
		}
		
//		if (otherChargeDetails == null || otherChargeDetails.getTotalCharges() == null || otherChargeDetails.getTotalCharges() == 0) {
//			return ResponseEntity.badRequest().body("otherChargeDetails TotalCharges must not be null or zero");
//		}
		
		if (otherChargeDetails == null || otherChargeDetails.isDisplayOnFolio() == null ) {
			return ResponseEntity.badRequest().body("otherChargeDetails DisplayOnFolio must not be null or empty");
		}

		
		try {
			OtherChargeDetails savedOtherChargeDetails = service.createOtherChargeDetails(otherChargeDetails);
			return ResponseEntity.ok(savedOtherChargeDetails);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the OtherChargeDetails");
		}
	}
	
	@PutMapping("/admin/updateotherchargedetails/{id}")
	public ResponseEntity<?> updateOtherChargeDetails(@PathVariable Long id, @RequestBody OtherChargeDetails otherChargeDetails) {
		// Validate input
		if (otherChargeDetails == null || otherChargeDetails.getRemark() == null || otherChargeDetails.getRemark().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("otherChargeDetails remark must not be null or empty");
		}

		try {
			OtherChargeDetails existingOtherChargeDetails = service.getOtherChargeDetailsById(id);
			if (existingOtherChargeDetails == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(" with ID " + id + " not found");
			}

			// Update fields
			existingOtherChargeDetails.setRemark(otherChargeDetails.getRemark());
			existingOtherChargeDetails.setDisplayOnFolio(otherChargeDetails.isDisplayOnFolio());
			existingOtherChargeDetails.setTotalCharges(otherChargeDetails.getTotalCharges());
			

			OtherChargeDetails updatedOtherChargeDetails = service.updateOtherChargeDetails(existingOtherChargeDetails.getId(), existingOtherChargeDetails);

			return ResponseEntity.ok(updatedOtherChargeDetails);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the updatedOtherChargeDetails");
		}
	}
	
	@DeleteMapping("/admin/deleteotherchargedetails/{id}")
	public ResponseEntity<String> deleteOtherChargeDetails(@PathVariable("id") Long id) {
		boolean isDeleted = service.deleteOtherChargeDetails(id);
		if (isDeleted) {
			String responseContent = "OtherChargeDetails has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting OtherChargeDetails from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	
	
	

}
