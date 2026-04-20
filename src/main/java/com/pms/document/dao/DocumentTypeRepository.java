/**
 * 
 */
package com.pms.document.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pms.document.entity.DocumentType;
import com.pms.floor.entity.Floor;

/**
 * 
 */
public interface DocumentTypeRepository extends JpaRepository<DocumentType, Integer> , JpaSpecificationExecutor<DocumentType>{
	
List<DocumentType> findByHotelId(Long hotelId);
	
DocumentType findByIdAndHotelId(Long documentTypeId,Long hotelId);
	
	@Query("SELECT d FROM DocumentType d WHERE d.hotelId = :hotelId")
	List<DocumentType> findDocumentTypes(@Param("hotelId") Long hotelId);
	
}
