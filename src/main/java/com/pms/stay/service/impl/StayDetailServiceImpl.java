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
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.repository.AuditLogRepository;
import com.pms.auditlog.util.AuditUtil;
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
public class StayDetailServiceImpl  implements IStayDetailsService {
	
static final Logger logger = LoggerFactory.getLogger(StayDetailServiceImpl.class);
	
	@Autowired
	private IStatyDetailsDAO dao;
	 private final AuditLogRepository auditRepo;
	 private final StayDetailsRepository repository;
	
	public StayDetailServiceImpl(IStatyDetailsDAO dao, AuditLogRepository auditRepo, StayDetailsRepository repository) {
		super();
		this.dao = dao;
		this.auditRepo = auditRepo;
		this.repository = repository;
	}

	public List<StayDetails> getStayDetails() {
//		return dao.getStayDetails();
		 return repository.findByIsDeletedFalse();
	}

	@Auditable(action = "CREATE", entity = "STAYDETAILS")
	public StayDetails createStayDetails(StayDetails stayDetails) {
		
//		return dao.createStayDetails(stayDetails);
		return repository.saveAndFlush(stayDetails);
	}

	@Auditable(action = "UPDATE", entity = "STAYDETAILS")
	public StayDetails updateStayDetails(int stayDetailsId, StayDetails stayDetails) {
		//return dao.updateStayDetails(stayDetailsId, stayDetails);
		 repository.saveAndFlush(stayDetails);
		 return getStayDetail(stayDetailsId);
		 
	}

	public StayDetails getStayDetail(int stayDetailsId) {
		  return repository.findByIdAndIsDeletedFalse(stayDetailsId)
	                .orElseThrow(() -> new RuntimeException("Record not found"));
	}

	@Auditable(action = "DELETE", entity = "STAYDETAILS")
	public boolean deleteStayDetails(int stayDetailsId) {
		return dao.deleteStayDetails(stayDetailsId);
	}
	
	@Auditable(action = "DELETE", entity = "STAYDETAILS")
    @Transactional
    public boolean deleteSoftStayDetails(Long id) {

		StayDetails entity = dao.findById(id);

        // ✅ Soft delete
        entity.setDeleted(true);
        entity.setDeletedAt(LocalDateTime.now());
        entity.setDeletedBy(SecurityUtils.getCurrentUser());
        
        repository.save(entity);

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

	public StayDetails findById(Long id) {
		return dao.findById(id);
	}

}
