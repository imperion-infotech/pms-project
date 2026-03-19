/**
 * 
 */
package com.pms.roomtype.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.pms.roomtype.entity.RoomType;
import com.pms.roomtype.services.IRoomTypeService;

/**
 * 
 */
@Controller
public class RoomTypeController {

	private static final Logger logger = LoggerFactory.getLogger(RoomTypeController.class);

	@Autowired
	private IRoomTypeService service;

//	@GetMapping("/admin/getRoomTypes")
	@GetMapping("/auth/getroomtypes")
	public ResponseEntity<List<RoomType>> getRoomTypes() {

		List<RoomType> roomTypes = service.getRoomTypes();
		return new ResponseEntity<List<RoomType>>(roomTypes, HttpStatus.OK);

	}

//	@GetMapping("/admin/getRoomType/{id}")
	@GetMapping("/auth/getroomtype/{id}")
	public ResponseEntity<RoomType> getRoomType(@PathVariable("id") Integer id) {
		RoomType roomType = service.getRoomType(id);
		return new ResponseEntity<RoomType>(roomType, HttpStatus.OK);
	}

//	@PostMapping("/admin/createRoomType")
	@PostMapping("/auth/createroomtype")
	public ResponseEntity<?> createRoomType(@RequestBody RoomType roomType) {
		// Validate input
		if (roomType == null || roomType.getShortName() == null || roomType.getShortName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("RoomType shortname must not be null or empty");
		}

		if (roomType == null || roomType.getRoomTypeName() == null || roomType.getRoomTypeName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("RoomType roomtyname must not be null or empty");
		}

		try {
			RoomType savedRoomType = service.createRoomType(roomType);
			return ResponseEntity.ok(savedRoomType);
		} catch (Exception e) {
			// Log the error (optional)
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the RoomType");
		}
	}

//@PutMapping("/admin/updateroomtype/{id}")
	@PutMapping("/auth/updateroomtype/{id}")
	public ResponseEntity<?> updateRoomType(@PathVariable Integer id, @RequestBody RoomType roomTypeDetails) {
		// Validate input
		if (roomTypeDetails == null || roomTypeDetails.getShortName() == null
				|| roomTypeDetails.getShortName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("RoomType shortname must not be null or empty");
		}

		if (roomTypeDetails == null || roomTypeDetails.getRoomTypeName() == null
				|| roomTypeDetails.getRoomTypeName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("RoomType roomtypename must not be null or empty");
		}

		try {
			// Find existing RoomType
			RoomType existingRoomType = service.getRoomTypeById(id);
			if (existingRoomType == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RoomType with ID " + id + " not found");
			}

			// Update fields
			existingRoomType.setShortName(roomTypeDetails.getShortName());
			existingRoomType.setRoomTypeName(roomTypeDetails.getRoomTypeName());
			// You can add more setters here for other updatable fields

			// Save updated RoomType
			RoomType updatedRoomType = service.updateRoomType(existingRoomType.getId(), existingRoomType);

			return ResponseEntity.ok(updatedRoomType);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the RoomType");
		}
	}

//	@DeleteMapping("/admin/deleteRoomType/{id}")
	@DeleteMapping("/auth/deleteroomtype/{id}")
	public ResponseEntity<String> deleteRoomType(@PathVariable("id") int id) {
		boolean isDeleted = service.deleteRoomType(id);
		if (isDeleted) {
			String responseContent = "RoomType has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting RoomType from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
