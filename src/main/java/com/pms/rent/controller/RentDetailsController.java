/**
 * 
 */
package com.pms.rent.controller;

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

import com.pms.auditlog.util.AuditUtil;
import com.pms.rent.RentDetails;
import com.pms.rent.services.IRentDetailsService;

import jakarta.servlet.http.HttpSession;

/**
 * 
 */
@RestController
public class RentDetailsController {
	
	private static final Logger logger = LoggerFactory.getLogger(RentDetailsController.class);

	@Autowired
	private IRentDetailsService service;

	@GetMapping("/user/getrentdetails")
//	@GetMapping("/auth/getroomstatuses")
	public ResponseEntity<List<RentDetails>> getRentDetails() {

		List<RentDetails> rentDetails = service.getRentDetails();
		return new ResponseEntity<List<RentDetails>>(rentDetails, HttpStatus.OK);

	}
	
	@GetMapping("/user/getrentdetail/{id}")
//	@GetMapping("/auth/getroomstatus/{id}")
	public ResponseEntity<RentDetails> getRentDetail(@PathVariable("id") Integer id) {
		RentDetails rentDetails = service.getRentDetail(id);
		return new ResponseEntity<RentDetails>(rentDetails, HttpStatus.OK);
	}
	
	@PostMapping("/admin/createrentdetail")
//	@PostMapping("/auth/createroomstatus")
	public ResponseEntity<?> createRentDetails(@RequestBody RentDetails rentDetail) {
		// Validate input
//		if (rentDetail == null || rentDetail.getBalance() == null
//				|| rentDetail.getBalance()==0) {
//			return ResponseEntity.badRequest().body("RentDetails balance must not be null or empty");
//		}
//
//		if (rentDetail == null || rentDetail.getBasic() == null
//				|| rentDetail.getBasic()==0) {
//			return ResponseEntity.badRequest().body("RentDetails basic must not be null or empty");
//		}
//		
//		if (rentDetail == null || rentDetail.getDeposite() == null
//				|| rentDetail.getDeposite()==0) {
//			return ResponseEntity.badRequest().body("RentDetails deposite must not be null or empty");
//		}
//		
//		if (rentDetail == null || rentDetail.getDiscount()== null
//				|| rentDetail.getDeposite()==0) {
//			return ResponseEntity.badRequest().body("RentDetails deposite must not be null or empty");
//		}
//		
//		if (rentDetail == null || rentDetail.getCcAuthorized() == null
//				|| rentDetail.getCcAuthorized()==0) {
//			return ResponseEntity.badRequest().body("RentDetails ccAuthorized must not be null or empty");
//		}

		try {
			RentDetails savedRentDetails = service.createRentDetail(rentDetail);
			return ResponseEntity.ok(savedRentDetails);
		} catch (Exception e) {
			// Log the error (optional)
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the RoomType");
		}
	}
	
	@PutMapping("/admin/updaterentdetail/{id}")
//	@PutMapping("/auth/updateroomstatus/{id}")
	public ResponseEntity<?> updateRentDetails(@PathVariable Integer id, @RequestBody RentDetails rentDetails, HttpSession session) {
		// Validate input
		
		try {
			// Find existing RoomType
			RentDetails existingRentDetails = service.getRentDetail(id);
			if (existingRentDetails == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RentDetails with ID " + id + " not found");
			}
			session.setAttribute("oldValue", AuditUtil.toJson(existingRentDetails));
			// Update fields
			existingRentDetails.setBalance(rentDetails.getBalance());
			existingRentDetails.setCcAuthorized(rentDetails.getCcAuthorized());
			existingRentDetails.setDeposite(rentDetails.getDeposite());
			existingRentDetails.setDiscount(rentDetails.getDiscount());
			existingRentDetails.setOtherCharges(rentDetails.getOtherCharges());
			existingRentDetails.setPayments(rentDetails.getPayments());
			existingRentDetails.setRent(rentDetails.getRent());
			existingRentDetails.setTaxId(rentDetails.getTaxId());
			existingRentDetails.setTaxMaster(rentDetails.getTaxMaster());
			existingRentDetails.setTotalCharges(rentDetails.getTotalCharges());
			// Save updated RoomType
			RentDetails updatedRentDetails = service.updateRentDetail(existingRentDetails.getId(), existingRentDetails);

			return ResponseEntity.ok(updatedRentDetails);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the RoomType");
		}
	}
	
	@DeleteMapping("/admin/deleterentdetail/{id}")
//	@DeleteMapping("/auth/deleteroomstatus/{id}")
	public ResponseEntity<String> deleteRentDetail(@PathVariable("id") Long id) {
		boolean isDeleted = service.deleteSoftRentDetails(id);
		if (isDeleted) {
			String responseContent = "RentDetails has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting RentDetails from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	


}
