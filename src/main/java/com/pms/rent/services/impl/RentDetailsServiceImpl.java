/**
 * 
 */
package com.pms.rent.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.repository.AuditLogRepository;
import com.pms.auditlog.util.AuditUtil;
import com.pms.rent.RentDetails;
import com.pms.rent.dao.IRentDetailsDAO;
import com.pms.rent.dao.impl.RentDetailsRepository;
import com.pms.rent.services.IRentDetailsService;
import com.pms.security.configuration.HotelContext;
import com.pms.security.util.SecurityUtils;
import com.pms.stay.entity.StayDetails;

import jakarta.transaction.Transactional;

/**
 * 
 */
@Service
public class RentDetailsServiceImpl implements IRentDetailsService {
	
	@Autowired
	private IRentDetailsDAO dao;
	
	@Autowired
	RentDetailsRepository rentDetailsRepository;
	
	 private final AuditLogRepository auditRepo;

	public RentDetailsServiceImpl(IRentDetailsDAO dao, RentDetailsRepository rentDetailsRepository,
			AuditLogRepository auditRepo) {
		super();
		this.dao = dao;
		this.rentDetailsRepository = rentDetailsRepository;
		this.auditRepo = auditRepo;
	}

	@Override
	public List<RentDetails> getRentDetails() {
		Long hotelId = HotelContext.getHotelId();
 		 if (hotelId == null) {
 	         throw new RuntimeException("Hotel not selected");
 	     }
		return rentDetailsRepository.findByHotelIdAndIsDeletedFalse(hotelId);
	}
	
	@Auditable(action = "CREATE", entity = "RENTDETAILS")
	public RentDetails createRentDetail(RentDetails rentDetail) {
		
//		return dao.createRentDetail(rentDetail);
		return rentDetailsRepository.saveAndFlush(rentDetail);
	}
	
	@Auditable(action = "UPDATE", entity = "RENTDETAILS")
	@Override
	public RentDetails updateRentDetail(int rentDetailsId, RentDetails rentDetail) {
//		return dao.updateRentDetail(rentDetailsId, rentDetail);
		rentDetailsRepository.saveAndFlush(rentDetail);
		 return getRentDetail(rentDetailsId);
		
	}
	
	public RentDetails getRentDetail(int rentDetailsId) {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		  return rentDetailsRepository.findByIdAndHotelIdAndIsDeletedFalse(Long.valueOf(rentDetailsId),hotelId);
	}

	@Auditable(action = "DELETE", entity = "RENTDETAILS")
	@Override
	public boolean deleteRentDetail(int rentDetailsId) {
		return dao.deleteRentDetail(rentDetailsId);
	}
	
	@Override
	public RentDetails findById(Long id) {
		return dao.findById(id);
	}
	
	@Auditable(action = "DELETE", entity = "STAYDETAILS")
    @Transactional
    public boolean deleteSoftRentDetails(Long id) {

		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		RentDetails entity = rentDetailsRepository.findByIdAndHotelIdAndIsDeletedFalse(id,hotelId);

        // ✅ Soft delete
        entity.setDeleted(true);
        entity.setDeletedAt(LocalDateTime.now());
        entity.setDeletedBy(SecurityUtils.getCurrentUser());

        rentDetailsRepository.save(entity);
        
        // ✅ Audit log
        AuditLog log = new AuditLog();
        log.setAction("DELETE");
        log.setEntityName("RENT DETAILS");
        log.setEntityId(entity.getId()+"");
        log.setOldValue(AuditUtil.toJson(entity));
        log.setUsername(SecurityUtils.getCurrentUser());
        log.setTimestamp(LocalDateTime.now());

        auditRepo.save(log);
        if(entity != null)
        {
        	return true;
        	
        } else {
        	return false;
        }
}
	
	
	

}
