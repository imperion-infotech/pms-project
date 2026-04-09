/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.document.entity.DocumentType;

/**
 * 
 */
public class DocumentTypeSpecification {
	
	public static Specification<DocumentType> hasShortName(String shortName) {
        return (root, query, cb) ->
        shortName == null ? null : cb.like(cb.lower(root.get("documentTypeShortName")), "%" + shortName.toLowerCase() + "%");
    }
	
	public static Specification<DocumentType> hasDocumentTypeName(String documentTypeName) {
        return (root, query, cb) ->
        documentTypeName == null ? null : cb.like(cb.lower(root.get("documentTypeName")), "%" + documentTypeName.toLowerCase() + "%");
    }
	
	public static Specification<DocumentType> hasDocumentTypeDescription(String documentTypeDescription) {
        return (root, query, cb) ->
        documentTypeDescription == null ? null : cb.like(cb.lower(root.get("documentTypeDescription")), "%" + documentTypeDescription.toLowerCase() + "%");
    }

}
