package com.pms.document.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.context.BusinessTraceContext;
import com.pms.auditlog.context.RequestTraceContext;
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.filter.RequestTraceFilter;
import com.pms.auditlog.repository.AuditLogRepository;
import com.pms.auditlog.util.AuditUtil;
import com.pms.common.service.SoftDeleteService;
import com.pms.document.dao.DocumentDetailsRepository;
import com.pms.document.dao.IDocumentDetailsDAO;
import com.pms.document.entity.DocumentDetails;
import com.pms.document.service.IDocumentDetailsService;
import com.pms.exception.ResourceNotFoundException;
import com.pms.search.specification.DocumentDetailsSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;
import com.pms.security.service.BaseHotelService;
import com.pms.security.util.SecurityUtils;

@Service
public class DocumentDetailsServiceImpl extends BaseHotelService implements IDocumentDetailsService {


private final RequestTraceFilter requestTraceFilter;

static final Logger logger = LoggerFactory.getLogger(DocumentDetailsServiceImpl.class);
	
	@Autowired
	private IDocumentDetailsDAO dao;
	
	@Autowired
	private DocumentDetailsRepository documentDetailsRepository;
	
	@Autowired
	private AuditLogRepository auditRepo;
	
	@Autowired
	private SoftDeleteService softDeleteService;
	
	public DocumentDetailsServiceImpl(IDocumentDetailsDAO dao, DocumentDetailsRepository documentDetailsRepository,
			AuditLogRepository auditRepo, RequestTraceFilter requestTraceFilter) {
		super();
		this.dao = dao;
		this.documentDetailsRepository = documentDetailsRepository;
		this.auditRepo = auditRepo;
		this.requestTraceFilter = requestTraceFilter;
	}

	public List<DocumentDetails> getDocumentDetails() {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
			validateHotelAccess(hotelId);
		    if (isSuperAdmin()) 
		    	return documentDetailsRepository.findAll();
		    else 
			return documentDetailsRepository.findByHotelIdAndIsDeletedFalse(HotelContext.getHotelId());
		 
	}

	@Auditable(action = "CREATE", entity = "DOCUMENTDETAILS")
	public DocumentDetails createDocumentDetails(DocumentDetails documentDetails) {
		Long userId = UserContext.getUserId();

	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    
	    BusinessTraceContext.set(documentDetails.getBusinessTraceId());
	    RequestTraceContext.set(documentDetails.getRequestTraceId());
	    
	    assignHotel(documentDetails, documentDetails.getHotelId());
	    documentDetails.setCreatedBy(userId);
		 return documentDetailsRepository.saveAndFlush(documentDetails);
	}

	@Auditable(action = "UPDATE", entity = "DOCUMENTDETAILS")
	public DocumentDetails updateDocumentDetails(Long documentDetailsId, DocumentDetails documentDetails) {
		Long userId = UserContext.getUserId();
	    if (userId == null) {
	        throw new RuntimeException("User not selected");
	    }
	    validateHotelAccess(documentDetails.getHotelId());
	    documentDetails.setUpdatedBy(userId);
	    documentDetails.setUpdatedOn(LocalDateTime.now());
		return dao.updateDocumentDetails(documentDetailsId, documentDetails);
	}

	public <Optional>DocumentDetails getDocumentDetail(Long documentDetailsId) {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
			validateHotelAccess(hotelId);
		    return documentDetailsRepository.findByIdAndHotelIdAndIsDeletedFalse(documentDetailsId,hotelId)
			            .orElseThrow(() -> new ResourceNotFoundException("Record not found"));
		}

	@Auditable(action = "DELETE", entity = "DOCUMENTDETAILS")
	public boolean deleteDocumentDetails(Long documentDetailsId) {
		Long hotelId = HotelContext.getHotelId();
		 if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
		 DocumentDetails  dDetails = getDocumentDetail(documentDetailsId);
		 validateHotelAccess(hotelId);
		softDeleteService.softDelete(documentDetailsId, documentDetailsRepository);
		
		

         // ✅ Audit log
         AuditLog log = new AuditLog();
         log.setAction("DELETE");
         log.setEntityName("DOCUMENT DETAILS");
         log.setEntityId(documentDetailsId+"");
         log.setUsername(SecurityUtils.getCurrentUser());
         log.setTimestamp(LocalDateTime.now());
         log.setOldValue(AuditUtil.toJson(dDetails));
         auditRepo.save(log);
         if(dDetails != null)
        	 return true;
         else
        	 return false;
         
	}
	
	
	 public List<DocumentDetails> search(String documentTypeEnum, String documentNumber) {
		 Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT
	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
	     validateHotelAccess(hotelId);
	        Specification<DocumentDetails> spec = Specification
	        		.where(DocumentDetailsSpecification.hasHotelId(hotelId))
	        		.and(DocumentDetailsSpecification.isNotDeleted()) // ✅ ADD THIS
	                .and(DocumentDetailsSpecification.hasDocumentTypeEnum(documentTypeEnum))
	                .and(DocumentDetailsSpecification.hasDocumentNumber(documentNumber));

	        return documentDetailsRepository.findAll(spec);
	    }
}
