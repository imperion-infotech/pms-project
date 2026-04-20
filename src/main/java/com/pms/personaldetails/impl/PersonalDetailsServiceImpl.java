/**
 * 
 */
package com.pms.personaldetails.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.repository.AuditLogRepository;
import com.pms.auditlog.util.AuditUtil;
import com.pms.personaldetails.PersonalDetails;
import com.pms.personaldetails.PersonalDetailsRepository;
import com.pms.personaldetails.service.IPersonalDetailsService;
import com.pms.search.specification.DocumentDetailsSpecification;
import com.pms.search.specification.PersonalDetailsSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.util.SecurityUtils;

import jakarta.transaction.Transactional;

/**
 * 
 */
@Service
public class PersonalDetailsServiceImpl implements IPersonalDetailsService {

	
	 private final PersonalDetailsRepository repository;
	 private final AuditLogRepository auditRepo;

	    public PersonalDetailsServiceImpl(PersonalDetailsRepository repository, AuditLogRepository auditRepo) {
		super();
		this.repository = repository;
		this.auditRepo = auditRepo;
	}

		public List<PersonalDetails> getAll() {
			
//	        return repository.findAll();
			Long hotelId = HotelContext.getHotelId();
	   		 if (hotelId == null) {
	   	         throw new RuntimeException("Hotel not selected");
	   	     }
	        return repository.findByHotelIdAndIsDeletedFalse(hotelId);
	    }

		/*
	    public PersonalDetails getById(Long id) {
	        return repository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Record not found with id " + id));
	    }
	    */
	    
	    public PersonalDetails getById(Long id) {
	    	Long hotelId = HotelContext.getHotelId();
	   		 if (hotelId == null) {
	   	         throw new RuntimeException("Hotel not selected");
	   	     }
	        return repository.findByIdAndHotelIdAndIsDeletedFalse(id,hotelId)
	                .orElseThrow(() -> new RuntimeException("Record not found"));
	    }
	    

	    @Auditable(action = "CREATE", entity = "PERSONALDETAILS")
	    public PersonalDetails create(PersonalDetails details) {
	        return repository.saveAndFlush(details);
	        
	    }

	    @Auditable(action = "UPDATE", entity = "PERSONALDETAILS")
	    public PersonalDetails update(Long id, PersonalDetails details) {
	        PersonalDetails existing = getById(id);
	        existing.setFirstName(details.getFirstName());
	        existing.setLastName(details.getLastName());
	        existing.setCompanyName(details.getCompanyName());
	        existing.setEmail(details.getEmail());
	        existing.setPhone(details.getPhone());
	        existing.setAddress(details.getAddress());
	        existing.setContactInformationTypeEnum(details.getContactInformationTypeEnum());
	        return repository.save(existing);
	    }

	   /* @Auditable(action = "DELETE", entity = "PERSONALDETAILS")
	    public boolean delete(Long id) {
	    	 repository.deleteById(id);
	    	 return true;
	    }*/
	    
	    	@Auditable(action = "DELETE", entity = "PERSONALDETAILS")
	        @Transactional
	        public void deletePersonalDetails(Long id) {
	    		
	    		Long hotelId = HotelContext.getHotelId();
	   		 if (hotelId == null) {
	   	         throw new RuntimeException("Hotel not selected");
	   	     }

	            PersonalDetails entity = repository.findByIdAndHotelIdAndIsDeletedFalse(id,hotelId)
	                    .orElseThrow(() -> new RuntimeException("Record not found"));

	            // ✅ Soft delete
	            entity.setDeleted(true);
	            entity.setDeletedAt(LocalDateTime.now());
	            entity.setDeletedBy(SecurityUtils.getCurrentUser());

	            repository.save(entity);

	            // ✅ Audit log
	            AuditLog log = new AuditLog();
	            log.setAction("DELETE");
	            log.setEntityName("PERSONAL DETAILS");
	            log.setEntityId(entity.getId().toString());
	            log.setUsername(SecurityUtils.getCurrentUser());
	            log.setTimestamp(LocalDateTime.now());
	            log.setOldValue(AuditUtil.toJson(entity));
	            auditRepo.save(log);
	    }
	    
	    
	    
	    
	    public List<PersonalDetails> search(String firstName,String lastName, String email, String phone, String address) {
	    	Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT
		     if (hotelId == null) {
		         throw new RuntimeException("Hotel not selected");
		     }
	    	Specification<PersonalDetails> spec = Specification
	    			.where(PersonalDetailsSpecification.hasHotelId(hotelId))
	                .and(PersonalDetailsSpecification.isNotDeleted()) // ✅ ADD THIS
	                .and(PersonalDetailsSpecification.hasFirstName(firstName))
	                .and(PersonalDetailsSpecification.hasLastName(lastName))
	                .and(PersonalDetailsSpecification.hasEmail(email))
	                .and(PersonalDetailsSpecification.hasPhone(phone))
	                .and(PersonalDetailsSpecification.hasAddress(address));

	        return repository.findAll(spec);
	    }
	    
}
