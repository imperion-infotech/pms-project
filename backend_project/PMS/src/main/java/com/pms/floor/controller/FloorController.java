package com.pms.floor.controller;

import java.util.List;
import java.util.Optional;

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

import com.pms.floor.entity.Floor;
import com.pms.floor.services.IFloorService;

@Controller
public class FloorController {
	
	@Autowired
	private IFloorService service;
	
	@GetMapping("/admin/getfloors")
	public ResponseEntity<List<Floor>> getFloors(){
		
		List<Floor> Floors = service.getFloors();
		return new ResponseEntity<List<Floor>>(Floors, HttpStatus.OK);
		
	}
	
	@GetMapping("/user/getfloor/{id}")
	public ResponseEntity<Floor> getFloor(@PathVariable("id") Integer id){
		Floor Floor = service.getFloor(id);
		return new ResponseEntity<Floor>(Floor, HttpStatus.OK);
	}
	
	
	@PostMapping("/createfloor")
	public ResponseEntity<?> createFloor(@RequestBody Floor floor) {
	    // Validate input
	    if (floor == null || floor.getName() == null || floor.getName().trim().isEmpty()) {
	        return ResponseEntity
	                .badRequest()
	                .body("Floor name must not be null or empty");
	    }

	    try {
	        Floor savedFloor = service.createFloor(floor);
	        return ResponseEntity.ok(savedFloor);
	    } catch (Exception e) {
	        // Log the error (optional)
	        e.printStackTrace();
	        return ResponseEntity
	                .status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("An error occurred while creating the floor");
	    }
	}
	
	
	
	
//	@PutMapping("/updatefloor/{id}")
//	public ResponseEntity<Floor> updateFloor(@PathVariable("id") int id, @RequestBody Floor Floor){
//		
//		Floor b = service.updateFloor(id, Floor);
//		return new ResponseEntity<Floor>(b, HttpStatus.OK);
//	}
	
	
	@PutMapping("/updatefloor/{id}")
	public ResponseEntity<?> updateFloor(@PathVariable Integer id, @RequestBody Floor floorDetails) {
	    // Validate input
	    if (floorDetails == null || floorDetails.getName() == null || floorDetails.getName().trim().isEmpty()) {
	        return ResponseEntity
	                .badRequest()
	                .body("Floor name must not be null or empty");
	    }

	    try {
	        // Find existing floor
	       Floor existingFloor = service.getFloorById(id);
	        if (existingFloor == null) {
	            return ResponseEntity
	                    .status(HttpStatus.NOT_FOUND)
	                    .body("Floor with ID " + id + " not found");
	        }

	        // Update fields
	        existingFloor.setName(floorDetails.getName());
	        existingFloor.setDescription(floorDetails.getDescription());
	       
	        
	        existingFloor.setDescription(floorDetails.getDescription()); // if you have more fields
	        // You can add more setters here for other updatable fields

	        // Save updated floor
	        Floor updatedFloor = service.updateFloor(existingFloor.getId(),existingFloor);

	        return ResponseEntity.ok(updatedFloor);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity
	                .status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("An error occurred while updating the floor");
	    }
	}
	
	
	
	@DeleteMapping("/deletefloor/{id}")
	public ResponseEntity<String> deleteFloor(@PathVariable("id") int id){
		boolean isDeleted = service.deleteFloor(id);
		if(isDeleted){
			String responseContent = "Floor has been deleted successfully";
			return new ResponseEntity<String>(responseContent,HttpStatus.OK);
		}
		String error = "Error while deleting Floor from database";
		return new ResponseEntity<String>(error,HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
