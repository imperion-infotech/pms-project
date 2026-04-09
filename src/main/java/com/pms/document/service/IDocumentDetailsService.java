/**
 * 
 */
package com.pms.document.service;

import java.util.List;

import com.pms.document.entity.DocumentDetails;

/**
 * 
 */
public interface IDocumentDetailsService {
	
	public DocumentDetails findById(Integer id);
	public List<DocumentDetails> getDocumentDetails();
	public <Optional>DocumentDetails getDocumentDetail(int documentDetailId);
	public DocumentDetails createDocumentDetails(DocumentDetails documentDetails);
	public DocumentDetails updateDocumentDetails(int documentDetailsId, DocumentDetails documentDetails);
	public boolean deleteDocumentDetails(int documentDetailsId);
	 public List<DocumentDetails> search(String documentTypeEnum, String documentNumber);

}
