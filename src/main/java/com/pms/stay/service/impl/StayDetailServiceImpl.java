/**
 * 
 */
package com.pms.stay.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.context.BusinessTraceContext;
import com.pms.auditlog.context.RequestTraceContext;
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.repository.AuditLogRepository;
import com.pms.auditlog.util.AuditUtil;
import com.pms.common.service.SoftDeleteService;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;
import com.pms.security.service.BaseHotelService;
import com.pms.security.util.SecurityUtils;
import com.pms.stay.dao.IStatyDetailsDAO;
import com.pms.stay.dao.StayDetailsRepository;
import com.pms.stay.entity.StayDetails;
import com.pms.stay.service.IStayDetailsService;

import jakarta.transaction.Transactional;

/**
 * 
 */
@Service
public class StayDetailServiceImpl extends BaseHotelService implements IStayDetailsService {
	
static final Logger logger = LoggerFactory.getLogger(StayDetailServiceImpl.class);
	
	@Autowired
	private IStatyDetailsDAO dao;
	 private AuditLogRepository auditRepo;
	 private StayDetailsRepository repository;
	 @Autowired
	 private SoftDeleteService softDeleteService;
	
	public StayDetailServiceImpl(IStatyDetailsDAO dao, AuditLogRepository auditRepo, StayDetailsRepository repository) {
		super();
		this.dao = dao;
		this.auditRepo = auditRepo;
		this.repository = repository;
	}

	public List<StayDetails> getStayDetails() {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
			validateHotelAccess(hotelId);
		    if (isSuperAdmin()) 
		    	return repository.findAll();
		    else 
			return repository.findByHotelIdAndIsDeletedFalse(HotelContext.getHotelId());
		
		
	}

	@Auditable(action = "CREATE", entity = "STAYDETAILS")
	public StayDetails createStayDetails(StayDetails stayDetails) {
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    
	    BusinessTraceContext.set(stayDetails.getBusinessTraceId());
	    RequestTraceContext.set(stayDetails.getRequestTraceId());
	    
	    assignHotel(stayDetails, stayDetails.getHotelId());
	    stayDetails.setCreatedBy(userId);
		return repository.saveAndFlush(stayDetails);
	}

	@Auditable(action = "UPDATE", entity = "STAYDETAILS")
	public StayDetails updateStayDetails(Long stayDetailsId, StayDetails stayDetails) {
		 
		validateHotelAccess(stayDetails.getHotelId());
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    stayDetails.setUpdatedBy(userId);
	    stayDetails.setUpdatedOn(LocalDateTime.now());
		repository.saveAndFlush(stayDetails);
		 return getStayDetail(stayDetailsId);
		 
	}
	
	public StayDetails getStayDetail(Long stayDetailsId) {
		Long hotelId = HotelContext.getHotelId();
 		 if (hotelId == null) {
 	         throw new RuntimeException("Hotel not selected");
 	     }
 		validateHotelAccess(hotelId);
		  return repository.findByIdAndHotelIdAndIsDeletedFalse(stayDetailsId,hotelId);
	}

	
	@Auditable(action = "DELETE", entity = "STAYDETAILS")
    @Transactional
    public boolean deleteSoftStayDetails(Long id) {
		
		Long hotelId = HotelContext.getHotelId();
		Long userId = UserContext.getUserId();
		if(userId == null) {
			 throw new RuntimeException("User not selected");
		}
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		 validateHotelAccess(hotelId);
		StayDetails entity = repository.findByIdAndHotelIdAndIsDeletedFalse( id,hotelId);

        // ✅ Soft delete
//        entity.setDeleted(true);
//        entity.setDeletedOn(LocalDateTime.now());
//        entity.setDeletedBy(userId);
//        
//        repository.save(entity);
		
		softDeleteService.softDelete(id, repository);
		

        // ✅ Audit log
        AuditLog log = new AuditLog();
        log.setAction("DELETE");
        log.setEntityName("STAY DETAILS");
        log.setEntityId(entity.getId().toString());
        log.setUsername(SecurityUtils.getCurrentUser());
        log.setTimestamp(LocalDateTime.now());
        log.setOldValue(AuditUtil.toJson(entity));
        auditRepo.save(log);
        if(entity != null)
        {
        	return true;
        } else {
        	return false;
        }
	}
}
