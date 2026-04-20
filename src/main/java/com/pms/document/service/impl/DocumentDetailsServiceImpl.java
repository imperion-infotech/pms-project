package com.pms.document.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.repository.AuditLogRepository;
import com.pms.auditlog.util.AuditUtil;
import com.pms.document.dao.DocumentDetailsRepository;
import com.pms.document.dao.IDocumentDetailsDAO;
import com.pms.document.entity.DocumentDetails;
import com.pms.document.service.IDocumentDetailsService;
import com.pms.exception.ResourceNotFoundException;
import com.pms.search.specification.DocumentDetailsSpecification;
import com.pms.search.specification.FloorSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.util.SecurityUtils;

@Service
public class DocumentDetailsServiceImpl implements IDocumentDetailsService {


static final Logger logger = LoggerFactory.getLogger(DocumentDetailsServiceImpl.class);
	
	@Autowired
	private IDocumentDetailsDAO dao;
	
	@Autowired
	private DocumentDetailsRepository documentDetailsRepository;
	private final AuditLogRepository auditRepo;

	
	public DocumentDetailsServiceImpl(IDocumentDetailsDAO dao, DocumentDetailsRepository documentDetailsRepository,
			AuditLogRepository auditRepo) {
		super();
		this.dao = dao;
		this.documentDetailsRepository = documentDetailsRepository;
		this.auditRepo = auditRepo;
	}

	

	public List<DocumentDetails> getDocumentDetails() {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		 return documentDetailsRepository.findByHotelIdAndIsDeletedFalse(hotelId);
	}

	@Auditable(action = "CREATE", entity = "DOCUMENTDETAILS")
	public DocumentDetails createDocumentDetails(DocumentDetails documentDetails) {
//		return dao.createFloor(Floor);
		 return documentDetailsRepository.saveAndFlush(documentDetails);
	}

	@Auditable(action = "UPDATE", entity = "DOCUMENTDETAILS")
	public DocumentDetails updateDocumentDetails(int documentDetailsId, DocumentDetails documentDetails) {
		return dao.updateDocumentDetails(documentDetailsId, documentDetails);
	}

	public <Optional>DocumentDetails getDocumentDetail(int documentDetailsId) {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		    return documentDetailsRepository.findByIdAndHotelIdAndIsDeletedFalse(documentDetailsId,hotelId)
			            .orElseThrow(() -> new ResourceNotFoundException("Record not found"));
		}

	@Auditable(action = "DELETE", entity = "DOCUMENTDETAILS")
	public boolean deleteDocumentDetails(int documentDetailsId) {
		
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		
		DocumentDetails entity = documentDetailsRepository.findByIdAndHotelIdAndIsDeletedFalse(documentDetailsId,hotelId)
                 .orElseThrow(() -> new RuntimeException("Record not found"));
         // ✅ Soft delete
         entity.setDeleted(true);
         entity.setDeletedAt(LocalDateTime.now());
         entity.setDeletedBy(SecurityUtils.getCurrentUser());

         documentDetailsRepository.save(entity);

         // ✅ Audit log
         AuditLog log = new AuditLog();
         log.setAction("DELETE");
         log.setEntityName("DOCUMENT DETAILS");
         log.setEntityId(entity.getId()+"");
         log.setUsername(SecurityUtils.getCurrentUser());
         log.setTimestamp(LocalDateTime.now());
         log.setOldValue(AuditUtil.toJson(entity));
         auditRepo.save(log);
         if(entity != null)
        	 return true;
         else
        	 return false;
         
	}
	
	 public List<DocumentDetails> search(String documentTypeEnum, String documentNumber) {
		 Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT
	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
	        Specification<DocumentDetails> spec = Specification
	        		.where(DocumentDetailsSpecification.hasHotelId(hotelId))
	        		.and(DocumentDetailsSpecification.isNotDeleted()) // ✅ ADD THIS
	                .and(DocumentDetailsSpecification.hasDocumentTypeEnum(documentTypeEnum))
	                .and(DocumentDetailsSpecification.hasDocumentNumber(documentNumber));

	        return documentDetailsRepository.findAll(spec);
	    }


}
