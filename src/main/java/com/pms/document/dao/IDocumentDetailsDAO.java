/**
 * 
 */
package com.pms.document.dao;

import java.util.List;

import com.pms.document.entity.DocumentDetails;

/**
 * 
 */
public interface IDocumentDetailsDAO {
	
	public DocumentDetails findById(Integer id);
	public List<DocumentDetails> getDocumentDetails();
	public DocumentDetails getDocumentDetail(int documentDetailId);
	public DocumentDetails createDocumentDetails(DocumentDetails documentDetails);
	public DocumentDetails updateDocumentDetails(int documentDetailsId, DocumentDetails documentDetails);
	public boolean deleteDocumentDetails(int documentDetailsId);
}
