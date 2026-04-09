package com.pms.floor.controller;

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

import com.pms.floor.entity.Floor;
import com.pms.floor.services.IFloorService;
import com.pms.personaldetails.PersonalDetails;

@RestController
public class FloorController {

	private static final Logger logger = LoggerFactory.getLogger(FloorController.class);

	@Autowired
	private IFloorService service;

//	@GetMapping("/admin/getfloors")
	@GetMapping("/user/getfloors")
	public ResponseEntity<List<Floor>> getFloors() {

		List<Floor> floors = service.getFloors();
		return new ResponseEntity<List<Floor>>(floors, HttpStatus.OK);

	}

//	@GetMapping("/admin/getfloor/{id}")
	@GetMapping("/user/getfloor/{id}")
	public ResponseEntity<Floor> getFloor(@PathVariable("id") Integer id) {
		Floor floor = service.getFloor(id);
		return new ResponseEntity<Floor>(floor, HttpStatus.OK);
	}

	@PostMapping("/admin/createfloor")
//	@PostMapping("/auth/createfloor")
	public ResponseEntity<?> createFloor(@RequestBody Floor floor) {
		// Validate input
		if (floor == null || floor.getName() == null || floor.getName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Floor name must not be null or empty");
		}
		
		if (floor == null || floor.getDescription() == null || floor.getDescription().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("floor getDescription must not be null or empty");
		}

		try {
			Floor savedFloor = service.createFloor(floor);
			return ResponseEntity.ok(savedFloor);
		} catch (Exception e) {
			// Log the error (optional)
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while creating the floor");
		}
	}

	@PutMapping("/admin/updatefloor/{id}")
//	@PutMapping("/auth/updatefloor/{id}")
	public ResponseEntity<?> updateFloor(@PathVariable Integer id, @RequestBody Floor floorDetails) {
		// Validate input
		if (floorDetails == null || floorDetails.getName() == null || floorDetails.getName().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Floor name must not be null or empty");
		}
		
		if (floorDetails == null || floorDetails.getDescription() == null || floorDetails.getDescription().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("floor getDescription must not be null or empty");
		}


		try {
			// Find existing floor
			Floor existingFloor = service.getFloorById(id);
			if (existingFloor == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Floor with ID " + id + " not found");
			}

			// Update fields
			existingFloor.setName(floorDetails.getName());
			existingFloor.setDescription(floorDetails.getDescription()); // if you have more fields
			existingFloor.setNoOfRooms(floorDetails.getNoOfRooms());
			// You can add more setters here for other updatable fields

			// Save updated floor
			Floor updatedFloor = service.updateFloor(existingFloor.getId(), existingFloor);

			return ResponseEntity.ok(updatedFloor);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating the floor");
		}
	}

	@DeleteMapping("/admin/deletefloor/{id}")
//	@DeleteMapping("/user/deletefloor/{id}")
	public ResponseEntity<String> deleteFloor(@PathVariable("id") int id) {
		boolean isDeleted = service.deleteFloor(id);
		if (isDeleted) {
			String responseContent = "Floor has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting Floor from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	
	@GetMapping("/user/floor/search")
    public List<Floor> searchFloor(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description) {

        return service.search(name,description);
    }
	

}
