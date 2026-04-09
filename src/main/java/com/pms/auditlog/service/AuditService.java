/**
 * 
 */
package com.pms.auditlog.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.pms.auditlog.entity.AuditLog;
import com.pms.auditlog.repository.AuditLogRepository;

import lombok.RequiredArgsConstructor;

/**
 * 
 */
@Service
//@RequiredArgsConstructor
public class AuditService {

	private final AuditLogRepository auditLogRepository;
	
	public AuditService(AuditLogRepository auditLogRepository) {
		super();
		this.auditLogRepository = auditLogRepository;
	}

	@Async
	public void save(AuditLog log) {
		auditLogRepository.save(log);
	}
}
