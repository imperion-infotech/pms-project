/**
 * 
 */
package com.pms.room.controller;

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

import com.pms.room.entity.RoomMaster;
import com.pms.room.services.IRoomMasterService;

/**
 * 
 */
@Controller
public class RoomMasterController {

	
	private static final Logger logger = LoggerFactory.getLogger(RoomMasterController.class);

	@Autowired
	private IRoomMasterService service;

//	@GetMapping("/admin/getroommasters")
	@GetMapping("/auth/getroommasters")
	public ResponseEntity<List<RoomMaster>> getRoomMasters() {
		List<RoomMaster> roomMaster = service.getRoomMasters();
		return new ResponseEntity<List<RoomMaster>>(roomMaster, HttpStatus.OK);

	}

//	@GetMapping("/admin/getRoomType/{id}")
	@GetMapping("/auth/getroommaster/{id}")
	public ResponseEntity<RoomMaster> getRoomMaster(@PathVariable("id") Integer id) {
		RoomMaster roomMaster = service.getRoomMaster(id);
		return new ResponseEntity<RoomMaster>(roomMaster, HttpStatus.OK);
	}

//	@PostMapping("/admin/createRoomType")
	@PostMapping("/auth/createroommaster")
	public ResponseEntity<?> createRoomMaster(@RequestBody RoomMaster roomMaster) {
		// Validate input
		if (roomMaster == null || roomMaster.getFloorId() == null
				) {
			return ResponseEntity.badRequest().body("RoomMaster name must not be null or empty");
		}

		if (roomMaster == null || roomMaster.getRoomTypeId() == null
				) {
			return ResponseEntity.badRequest().body("RoomMaster title must not be null or empty");
		}

		if (roomMaster == null || roomMaster.getRoomShortName() == null
				|| roomMaster.getRoomShortName().trim().isEmpty()) {
			
			return ResponseEntity.badRequest().body("RoomMaster color must not be null or empty");
		}
		
		if (roomMaster == null || roomMaster.getFloorId() == 0)
				{
			return ResponseEntity.badRequest().body("RoomMaster floorid must not be null or empty");
		}
		
		if (roomMaster == null || roomMaster.getRoomTypeId()== 0)
				 {
			return ResponseEntity.badRequest().body("RoomMaster RoomTypeId must not be null or empty");
		}

		try {
			RoomMaster savedRoomMaster = service.createRoomMaster(roomMaster);
			return ResponseEntity.ok(savedRoomMaster);
		} catch (Exception e) {
			// Log the error (optional)
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the roomMaster");
		}
	}

//@PutMapping("/admin/updateroomtype/{id}")
	@PutMapping("/auth/updateroommaster/{id}")
	public ResponseEntity<?> updateRoomType(@PathVariable Integer id, @RequestBody RoomMaster roomMaster) {
		// Validate input
		if (roomMaster == null || roomMaster.getFloorId() == null
				) {
			return ResponseEntity.badRequest().body("RoomMaster name must not be null or empty");
		}

		if (roomMaster == null || roomMaster.getRoomTypeId() == null
				) {
			return ResponseEntity.badRequest().body("RoomMaster title must not be null or empty");
		}

		if (roomMaster == null || roomMaster.getRoomShortName() == null
				|| roomMaster.getRoomShortName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("RoomMaster color must not be null or empty");
		}
		
		if (roomMaster == null || roomMaster.getFloorId() == 0)
		{
			return ResponseEntity.badRequest().body("RoomMaster floorid must not be null or empty");
		}

		if (roomMaster == null || roomMaster.getRoomTypeId()== 0)
		 {
				return ResponseEntity.badRequest().body("RoomMaster RoomTypeId must not be null or empty");
		 }
		

		try {
			// Find existing RoomType
			RoomMaster existingRoomMaster = service.getRoomMasterById(id);
			if (existingRoomMaster == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RoomMaster with ID " + id + " not found");
			}

			// Update fields
			existingRoomMaster.setFloorId(roomMaster.getFloorId());
			existingRoomMaster.setRoomName(roomMaster.getRoomName());
			existingRoomMaster.setRoomShortName(roomMaster.getRoomShortName());
			existingRoomMaster.setRoomTypeId(roomMaster.getRoomTypeId());

			existingRoomMaster.setHandicap(roomMaster.isHandicap());
			existingRoomMaster.setSmoking(roomMaster.isSmoking());
			existingRoomMaster.setNonRoom(roomMaster.isNonRoom());
			// You can add more setters here for other updatable fields

			// Save updated RoomType
			RoomMaster updatedRoomMaster = service.updateRoomMaster(existingRoomMaster.getId(), existingRoomMaster);

			return ResponseEntity.ok(updatedRoomMaster);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the roomMaster");
		}
	}

//	@DeleteMapping("/admin/deleteRoomType/{id}")
	@DeleteMapping("/auth/deleteroommaster/{id}")
	public ResponseEntity<String> deleteRoomStatus(@PathVariable("id") int id) {
		boolean isDeleted = service.deleteRoomMaster(id);
		if (isDeleted) {
			String responseContent = "RoomMaster has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting RoomMaster from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
