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
import com.pms.floor.entity.Floor;
import com.pms.search.specification.DocumentTypeSpecification;
import com.pms.search.specification.FloorSpecification;
import com.pms.security.configuration.HotelContext;

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
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return documentTypeRepository.findByHotelId(HotelContext.getHotelId());
	}

	@Override
	public DocumentType getDocumentType(Long documentTypeId) {
		return documentTypeRepository.findByIdAndHotelId(documentTypeId,HotelContext.getHotelId());
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
	public boolean deleteDocumentType(Long documentTypeId) {
		DocumentType documentType = documentTypeRepository.findByIdAndHotelId(documentTypeId,HotelContext.getHotelId());
		 boolean isDeleted=true;;
		 if(documentType == null ) {
			 isDeleted=false;
			 throw new RuntimeException("floor not found");
		 }
		 documentTypeRepository.delete(documentType);
		 return isDeleted;
	}

	@Override
	public DocumentType findByIdAndHotelId(Long id) {
		  return documentTypeRepository.findByIdAndHotelId(id,HotelContext.getHotelId());
	}
	
	
	@Override
	public 	List<DocumentType> search(String shortName, String documentTypeName,String documentTypeDescription)
	{   
		Long hotelId = HotelContext.getHotelId();   // 🔥 get from JWT

	     if (hotelId == null) {
	         throw new RuntimeException("Hotel not selected");
	     }
	Specification<DocumentType> spec = Specification
					.where(DocumentTypeSpecification.hasHotelId(hotelId))
	                .and(DocumentTypeSpecification.hasShortName(shortName))
	                .and(DocumentTypeSpecification.hasDocumentTypeName(documentTypeName))
	                .and(DocumentTypeSpecification.hasDocumentTypeDescription(documentTypeDescription));

	        return documentTypeRepository.findAll(spec);
	    }


}
