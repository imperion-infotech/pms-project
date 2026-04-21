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
import com.pms.common.service.SoftDeleteService;
import com.pms.guestdetails.GuestDetails;
import com.pms.guestdetails.dao.IGuestDetailsDAO;
import com.pms.guestdetails.dao.impl.GuestDetailsRepository;
import com.pms.guestdetails.service.IGuestDetailsService;
import com.pms.paymentdetails.entity.PaymentDetails;
import com.pms.paymentdetails.repository.PaymentDetailsRepository;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;
import com.pms.security.util.SecurityUtils;

import jakarta.transaction.Transactional;

/**
 * 
 */
@Service
public class GuestDetailsServiceImpl implements IGuestDetailsService {
	
	@Autowired
	private IGuestDetailsDAO dao;
	
	@Autowired
	private GuestDetailsRepository guestDetailsRepository;
	
	@Autowired
	private PaymentDetailsRepository paymentDetailsRepository;
	
	@Autowired
	private AuditLogRepository auditLogRepository;
	
	@Autowired
	private SoftDeleteService softDeleteService;
	

	public GuestDetailsServiceImpl(IGuestDetailsDAO dao, GuestDetailsRepository guestDetailsRepository) {
		super();
		this.dao = dao;
		this.guestDetailsRepository = guestDetailsRepository;
	}
	
	@Override
	public List<GuestDetails> getGuestDetails() {
		Long hotelId = HotelContext.getHotelId();
 		 if (hotelId == null) {
 	         throw new RuntimeException("Hotel not selected");
 	     }
//		return guestDetailsRepository.findAll();
		return guestDetailsRepository.findByHotelIdAndIsDeletedFalse(hotelId);
	}
	
	@Override
	public GuestDetails getGuestDetail(Long guestDetailsId) {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		
		return guestDetailsRepository.findByIdAndHotelIdAndIsDeletedFalse(Long.valueOf(guestDetailsId),hotelId);
	                
	}
	@Auditable(action = "CREATE", entity = "GUESTDETAILS")
	public GuestDetails createGuestDetail(GuestDetails guestDetails) {
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    guestDetails.setCreatedBy(userId);
	    return guestDetailsRepository.save(guestDetails);		
		
	}
	@Auditable(action = "UPDATE", entity = "GUESTDETAILS")
	public GuestDetails updateGuestDetails(Long guestDetailsId, GuestDetails guestDetails) {
		
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    guestDetails.setUpdatedBy(userId);
	    guestDetails.setUpdatedOn(LocalDateTime.now());
		return dao.updateGuestDetails(guestDetailsId, guestDetails);
	}
	
	
	@Auditable(action = "DELETE", entity = "STAYDETAILS")
    @Transactional
    public boolean deleteSoftStayDetails(Integer id) {
		
		Long hotelId = HotelContext.getHotelId();
		Long userId = UserContext.getUserId();
		if(userId == null) {
			 throw new RuntimeException("User not selected");
		}
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }

		GuestDetails entity = guestDetailsRepository.findByIdAndHotelIdAndIsDeletedFalse(Long.valueOf(id),hotelId);
		List<PaymentDetails> paymentDetails = paymentDetailsRepository.findByHotelId(hotelId);
		
		entity.setPaymentDetails(paymentDetails);
        softDeleteService.softDelete((long) id, guestDetailsRepository);

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
	
}
