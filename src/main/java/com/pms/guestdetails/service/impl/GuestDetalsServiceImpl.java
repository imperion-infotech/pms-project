/**
 * 
 */
package com.pms.guestdetails.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.repository.AuditLogRepository;
import com.pms.auditlog.util.AuditUtil;
import com.pms.guestdetails.GuestDetails;
import com.pms.guestdetails.dao.IGuestDetailsDAO;
import com.pms.guestdetails.dao.impl.GuestDetailsRepository;
import com.pms.guestdetails.service.IGuestDetailsService;
import com.pms.security.util.SecurityUtils;
import com.pms.stay.entity.StayDetails;

import jakarta.transaction.Transactional;

/**
 * 
 */
@Service
public class GuestDetalsServiceImpl implements IGuestDetailsService {
	
	@Autowired
	private IGuestDetailsDAO dao;
	
	@Autowired
	private GuestDetailsRepository guestDetailsRepository;
	
	@Autowired
	private AuditLogRepository auditLogRepository;
	

	public GuestDetalsServiceImpl(IGuestDetailsDAO dao, GuestDetailsRepository guestDetailsRepository) {
		super();
		this.dao = dao;
		this.guestDetailsRepository = guestDetailsRepository;
	}
	
	@Override
	public List<GuestDetails> getGuestDetails() {
//		return guestDetailsRepository.findAll();
		return guestDetailsRepository.findByIsDeletedFalse();
	}
	
	@Override
	public GuestDetails getGuestDetail(int guestDetailsId) {
//		return dao.getGuestDetail(guestDetailsId);
		return guestDetailsRepository.findByIdAndIsDeletedFalse(guestDetailsId)
	                .orElseThrow(() -> new RuntimeException("Record not found"));
	}
	@Auditable(action = "CREATE", entity = "GUESTDETAILS")
	public GuestDetails createGuestDetail(GuestDetails guestDetails) {
		
		return dao.createGuestDetails(guestDetails);
	}
	@Auditable(action = "UPDATE", entity = "GUESTDETAILS")
	public GuestDetails updateGuestDetails(int guestDetailsId, GuestDetails guestDetails) {
		return dao.updateGuestDetails(guestDetailsId, guestDetails);
	}
	
	@Auditable(action = "DELETE", entity = "GUESTDETAILS")
	public boolean deleteGuestDetail(int guestDetailsId)
	{ 
		return dao.deleteGuestDetails(guestDetailsId);
	}
	
	@Auditable(action = "DELETE", entity = "STAYDETAILS")
    @Transactional
    public boolean deleteSoftStayDetails(Integer id) {

		GuestDetails entity = dao.findById(id);

        // ✅ Soft delete
        entity.setDeleted(true);
        entity.setDeletedAt(LocalDateTime.now());
        entity.setDeletedBy(SecurityUtils.getCurrentUser());
        
        guestDetailsRepository.save(entity);

        // ✅ Audit log
        AuditLog log = new AuditLog();
        log.setAction("DELETE");
        log.setEntityName("STAY DETAILS");
        log.setEntityId(entity.getId()+"");
        log.setUsername(SecurityUtils.getCurrentUser());
        log.setTimestamp(LocalDateTime.now());
        log.setOldValue(AuditUtil.toJson(entity));
        auditLogRepository.save(log);
        if(entity != null)
        {
        	return true;
        } else {
        	return false;
        }
}
	
	public GuestDetails findById(Integer id)
	{
		return dao.findById(id);
	}


}
