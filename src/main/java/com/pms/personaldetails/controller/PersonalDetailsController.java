/**
 * 
 */
package com.pms.personaldetails.controller;

import java.io.IOException;
import java.util.List;

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

import com.pms.auditlog.util.AuditUtil;
import com.pms.personaldetails.PersonalDetails;
import com.pms.personaldetails.service.IPersonalDetailsService;
import com.pms.util.SnowflakeUtil;

import jakarta.servlet.http.HttpSession;

/**
 * 
 */

import jakarta.validation.Valid;

@RestController
public class PersonalDetailsController {

	
    private final IPersonalDetailsService service;

    public PersonalDetailsController(IPersonalDetailsService service) {
        this.service = service;
    }
    
    @Autowired
	private SnowflakeUtil snowflakeUtil;
	
	@GetMapping("/user/getfoliono")
	public ResponseEntity<Long> getFolioNo(){
		return new ResponseEntity<Long>(snowflakeUtil.generateId(), HttpStatus.OK);
	}

    @GetMapping("/user/getpersonaldetails")
//    @GetMapping("/auth/getpersonaldetails")
    public List<PersonalDetails> getAll() {
        return service.getAll();
    }

    @GetMapping("/user/getpersonaldetail/{id}")
//    @GetMapping("/auth/getpersonaldetail/{id}")
    public ResponseEntity<PersonalDetails> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    
    @PostMapping(value= "/user/createpersonaldetail")
    public ResponseEntity<PersonalDetails> create(@Valid @RequestBody PersonalDetails details) throws IOException {
        return ResponseEntity.ok(service.create(details));
    }
    
    @PutMapping("/user/updatepersonaldetail/{id}")
    public ResponseEntity<PersonalDetails> update(@PathVariable Long id, @Valid @RequestBody PersonalDetails details,HttpSession session) {
    	PersonalDetails existingPersonalDetails = service.getById(id);
    	if(existingPersonalDetails != null) {
    		session.setAttribute("oldValue", AuditUtil.toJson(service.getById(id)));
    	}
    	return ResponseEntity.ok(service.update(id, details));
    }

    @DeleteMapping("/user/deletepersonaldetail/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deletePersonalDetails(id);
        return ResponseEntity.ok("Deleted successfully");
    }
    
    
    /*public ResponseEntity<String> delete(@PathVariable Long id) {
    	boolean isDeleted=  service.delete(id);
        if (isDeleted) {
			String responseContent = "personaldetail has been deleted successfully";
			return new ResponseEntity<String>(responseContent, HttpStatus.OK);
		}
		String error = "Error while deleting personaldetail from database";
		return new ResponseEntity<String>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }*/
    
    @GetMapping("/user/personaldetail/search")
    public List<PersonalDetails> searchPersonalDetails(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String address) {

        return service.search(firstName,lastName, email, phone, address);
    }
    
}

