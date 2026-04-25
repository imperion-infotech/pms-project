/**
 * 
 */
package com.pms.auditlog.aspect;

import java.time.LocalDateTime;
import java.util.UUID;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

//import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.annotation.Auditable;
import com.pms.auditlog.context.BusinessTraceContext;
import com.pms.auditlog.context.RequestTraceContext;
import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.service.AuditService;
import com.pms.auditlog.util.AuditUtil;
import com.pms.security.configuration.HotelContext;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
//@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

	private final AuditService auditService ;
    
    public AuditAspect(AuditService auditService) {
		super();
		this.auditService = auditService;
	}



	@Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {

        String traceId = UUID.randomUUID().toString();
        org.slf4j.MDC.put("traceId", traceId);

        Object result = null;
        boolean success = true;
        String errorMessage = null;

        String method = joinPoint.getSignature().toShortString();
        String newValue = AuditUtil.toJson(joinPoint.getArgs());

        try {
            result = joinPoint.proceed();
        } catch (Exception ex) {
            success = false;
            errorMessage = ex.getMessage();
            throw ex;
        }

        /*AuditLog logEntity = AuditLog.builder()
                .action(auditable.action())
                .entityName(auditable.entity())
                .methodName(method)
                .newValue(newValue)
                .username(AuditUtil.getUsername())
                .traceId(traceId)
                .timestamp(LocalDateTime.now())
                .success(success)
                .errorMessage(errorMessage)
                .build();*/
        
        
        String oldValue = (String) AuditUtil.getSessionAttribute("oldValue");
        AuditUtil.removeSessionAttribute("oldValue");
        
        Long hotelId = HotelContext.getHotelId();
		if (hotelId == null) {
			throw new RuntimeException("Hotel not selected");
		}
     
        
        AuditLog logEntity = new AuditLog();
        logEntity.setAction(auditable.action());
        logEntity.setEntityName(auditable.entity());
        logEntity.setMethodName(method);
        logEntity.setNewValue(newValue);
        logEntity.setUsername(AuditUtil.getUsername());
        logEntity.setRequestTraceId(RequestTraceContext.get());
        logEntity.setBusinessTraceId(BusinessTraceContext.get());
        logEntity.setTimestamp(LocalDateTime.now());
        logEntity.setSuccess(success);
        logEntity.setErrorMessage(errorMessage);
        logEntity.setOldValue(oldValue);
        logEntity.setHotelId(hotelId);
        

        // 🔥 Fix for your Room ID capture
        if (result instanceof com.pms.building.entity.Building building) {
            logEntity.setEntityId(building.getId()+"");
        }

        if (result instanceof com.pms.document.entity.DocumentType documentType) {
            logEntity.setEntityId(documentType.getId()+"");
        }
        
        if (result instanceof com.pms.document.entity.DocumentDetails documentDetails) {
            logEntity.setEntityId(documentDetails.getId()+"");
        }
        
        if (result instanceof com.pms.personaldetails.PersonalDetails personalDetails) {
            logEntity.setEntityId(personalDetails.getId()+"");
        }
        
        if (result instanceof com.pms.stay.entity.StayDetails stayDetails) {
            logEntity.setEntityId(stayDetails.getId()+"");
        }
        
        if (result instanceof com.pms.rent.RentDetails rentDetails) {
            logEntity.setEntityId(rentDetails.getId()+"");
        }
        
        if (result instanceof com.pms.guestdetails.GuestDetails guestDetails) {
            logEntity.setEntityId(guestDetails.getId()+"");
        }

        auditService.save(logEntity);

        MDC.clear();

        return result;
    }
}