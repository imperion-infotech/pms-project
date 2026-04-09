/**
 * 
 */
package com.pms.document.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.pms.document.entity.DocumentType;

/**
 * 
 */
public interface DocumentTypeRepository extends JpaRepository<DocumentType, Integer> , JpaSpecificationExecutor<DocumentType>{
	

}
