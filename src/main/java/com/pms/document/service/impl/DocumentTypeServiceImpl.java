/**
 * 
 */
package com.pms.document.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.auditlog.annotation.Auditable;
import com.pms.document.dao.DocumentTypeRepository;
import com.pms.document.dao.IDocumentTypeDAO;
import com.pms.document.entity.DocumentType;
import com.pms.document.service.IDocumentTypeService;
import com.pms.search.specification.DocumentTypeSpecification;

/**
 * 
 */
@Service
public class DocumentTypeServiceImpl implements IDocumentTypeService {
	
	@Autowired
	private IDocumentTypeDAO dao;
	
	@Autowired
	private DocumentTypeRepository documentTypeRepository;
	
	public DocumentTypeServiceImpl(IDocumentTypeDAO dao, DocumentTypeRepository documentTypeRepository) {
		super();
		this.dao = dao;
		this.documentTypeRepository = documentTypeRepository;
	}

	@Override
	public List<DocumentType> getDocumentTypes() {
//			return dao.getFloors();
		return documentTypeRepository.findAll();
	}

	@Override
	public DocumentType getDocumentType(int documentTypeId) {
		return dao.getDocumentType(documentTypeId);
	}

	@Override
	@Auditable(action = "CREATE", entity = "DOCUMENTTYPE")
	public DocumentType createDocumentType(DocumentType documentType) {
//		return dao.createFloor(Floor);
		 return documentTypeRepository.saveAndFlush(documentType);
	}

	@Override
	@Auditable(action = "UPDATE", entity = "DOCUMENTTYPE")
	public DocumentType updateDocumentType(int documentTypeId, DocumentType documentType) {
		return dao.updateDocumentType(documentTypeId, documentType);
	}

	@Override
	@Auditable(action = "DELETE", entity = "DOCUMENTTYPE")
	public boolean deleteDocumentType(int documentTypeId) {
		return dao.deleteDocumentType(documentTypeId);
	}

	@Override
	public DocumentType findById(Integer id) {
		  return dao.findById(id);
	}
	
	@Override
	public 	List<DocumentType> search(String shortName, String documentTypeName,String documentTypeDescription)
	{   
	Specification<DocumentType> spec = Specification
	                .where(DocumentTypeSpecification.hasShortName(shortName))
	                .and(DocumentTypeSpecification.hasDocumentTypeName(documentTypeName))
	                .and(DocumentTypeSpecification.hasDocumentTypeDescription(documentTypeDescription));

	        return documentTypeRepository.findAll(spec);
	    }


}
