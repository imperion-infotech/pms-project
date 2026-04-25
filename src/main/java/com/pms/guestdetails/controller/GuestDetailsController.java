/**
 * 
 */
package com.pms.guestdetails.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pms.auditlog.util.AuditUtil;
import com.pms.guestdetails.GuestDetails;
import com.pms.guestdetails.service.IGuestDetailsService;
import com.pms.rent.RentDetails;

import jakarta.servlet.http.HttpSession;

/**
 * 
 */
@RestController
public class GuestDetailsController {

	
	private static final Logger logger = LoggerFactory.getLogger(GuestDetailsController.class);

	@Autowired
	private IGuestDetailsService service;
	
	@PreAuthorize("hasAuthority('GUESTDETAILS_VIEW')")
	@GetMapping("/user/getguestdetails")
	public ResponseEntity<List<GuestDetails>> getGuestDetails() {

		List<GuestDetails> guestDetails = service.getGuestDetails();
		return new ResponseEntity<List<GuestDetails>>(guestDetails, HttpStatus.OK);
	}
	
	@PreAuthorize("hasAuthority('GUESTDETAILS_VIEW')")
	@GetMapping("/user/getguestdetail/{id}")
	public ResponseEntity<GuestDetails> getGuestDetail(@PathVariable("id") Long id) {
		GuestDetails guestDetails = service.getGuestDetail(id);
		return new ResponseEntity<GuestDetails>(guestDetails, HttpStatus.OK);
	}
	
	@PreAuthorize("hasAuthority('GUESTDETAILS_CREATE')")
	@PostMapping("/admin/createguestdetail")
	public ResponseEntity<?> createGuestDetails(@RequestBody GuestDetails guestDetails) {
		// Validate input
		
		if(guestDetails ==null ||guestDetails.getCheckInDate() == null ) {
			return ResponseEntity.badRequest().body("GuestDetails checkindate must not be null or empty");
		}
		
		if(guestDetails ==null ||guestDetails.getCheckInTime() == null ) {
			return ResponseEntity.badRequest().body("GuestDetails checkintime must not be null or empty");
		}
		
		if(guestDetails ==null ||guestDetails.getCheckOutTime() == null ) {
			return ResponseEntity.badRequest().body("GuestDetails checkouttime must not be null or empty");
		}
		
		if(guestDetails ==null ||guestDetails.getCheckOutDate() == null ) {
			return ResponseEntity.badRequest().body("GuestDetails checkoutdate must not be null or empty");
		}
		
//		if(guestDetails ==null ||guestDetails.getDocumentDetails() == null ) {
//			return ResponseEntity.badRequest().body("GuestDetails document details must not be null or empty");
//		}
		
//		if(guestDetails ==null ||guestDetails.getGuestDetailsStats() == null || guestDetails.getGuestDetailsStats().trim().isEmpty() ) {
//			return ResponseEntity.badRequest().body("GuestDetails status must not be null or empty");
//		}
//		
//		if(guestDetails ==null ||guestDetails.getPersonalDetails() == null) {
//			return ResponseEntity.badRequest().body("GuestDetails status must not be null or empty");
//		}
//		
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
//		if (rentDetail == null || rentDetail.getCcAuthorized() == null
//				|| rentDetail.getCcAuthorized()==0) {
//			return ResponseEntity.badRequest().body("RentDetails ccAuthorized must not be null or empty");
//		}

		try {
			GuestDetails savedGuestDetails = service.createGuestDetail(guestDetails);
			return ResponseEntity.ok(savedGuestDetails);
		} catch (Exception e) {
			// Log the error (optional)
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the RoomType");
		}
	}
	
	@PreAuthorize("hasAuthority('GUESTDETAILS_UPDATE')")
	@PutMapping("/admin/updateguestdetail/{id}")
	public ResponseEntity<?> updateGuestDetails(@PathVariable Long id, @RequestBody GuestDetails guestDetails,HttpSession session) {
		// Validate input
		
		try {
			// Find existing RoomType
			GuestDetails existingGuestDetails = service.getGuestDetail(id);
			if (existingGuestDetails == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("GuestDetails with ID " + id + " not found");
			}
			session.setAttribute("oldValue", AuditUtil.toJson(existingGuestDetails));
			// Update fields
			existingGuestDetails.setCheckInDate(guestDetails.getCheckInDate());
			
			existingGuestDetails.setCheckInTime(guestDetails.getCheckInTime());
			
			existingGuestDetails.setCheckOutDate(guestDetails.getCheckOutDate());
			
			existingGuestDetails.setCheckOutTime(guestDetails.getCheckOutTime());
//			existingGuestDetails.setDocumentDetails(guestDetails.getDocumentDetails());
			existingGuestDetails.setDocumentDetailsId(guestDetails.getDocumentDetailsId());
			existingGuestDetails.setGuestDetailsStatus(guestDetails.getGuestDetailsStatus());
			
//			existingGuestDetails.setPersonalDetails(guestDetails.getPersonalDetails());
			existingGuestDetails.setPersonalDetailsId(guestDetails.getPersonalDetailsId());
//			existingGuestDetails.setRentDetails(guestDetails.getRentDetails());
			existingGuestDetails.setRentDetailsId(guestDetails.getRentDetailsId());
			existingGuestDetails.setDeleted(guestDetails.isDeleted());
			existingGuestDetails.setNoOfDays(guestDetails.getNoOfDays());
			existingGuestDetails.setRoomMasterId(guestDetails.getRoomMasterId());
			existingGuestDetails.setStayDetailsId(guestDetails.getStayDetailsId());
			existingGuestDetails.setRoomMaster(guestDetails.getRoomMaster());
			existingGuestDetails.setNoOfDays(guestDetails.getNoOfDays());
			// Save updated RoomType
			GuestDetails updatedGuestDetails = service.updateGuestDetails(existingGuestDetails.getId(), existingGuestDetails);

			return ResponseEntity.ok(updatedGuestDetails);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the RoomType");
		}
	}
	
	@PreAuthorize("hasAuthority('GUESTDETAILS_DELETE')")
	@DeleteMapping("/admin/deleteguestdetail/{id}")
	public ResponseEntity<String> deleteGuestDetail(@PathVariable("id") int id) {
		boolean isDeleted = service.deleteSoftStayDetails(id);
		if (isDeleted) {
			String responseContent = "GuestDetails has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting RentDetails from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	
	
}
