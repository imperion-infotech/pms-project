/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.building.entity.Building;
import com.pms.document.entity.DocumentDetails;
import com.pms.personaldetails.PersonalDetails;

/**
 * 
 */
public class DocumentDetailsSpecification {
	
	public static Specification<DocumentDetails> isNotDeleted() {
	    return (root, query, criteriaBuilder) ->
	            criteriaBuilder.isFalse(root.get("isDeleted"));
	}
	
	public static Specification<DocumentDetails> hasDocumentTypeEnum(String documentTypeEnum) {
        return (root, query, cb) ->
        documentTypeEnum == null ? null : cb.like(cb.lower(root.get("documentType")), "%" + documentTypeEnum.toLowerCase() + "%");
    }
	
	public static Specification<DocumentDetails> hasDocumentNumber(String documentNumber) {
        return (root, query, cb) ->
        documentNumber == null ? null : cb.like(cb.lower(root.get("documentNumber")), "%" + documentNumber.toLowerCase() + "%");
    }

	
	

}
