/**
 * 
 */
package com.pms.document.dao.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.pms.building.entity.Building;
import com.pms.document.dao.IDocumentDetailsDAO;
import com.pms.document.entity.DocumentDetails;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

/**
 * 
 */
@Transactional
@Repository
public class DocumentDetailsDAOImpl implements IDocumentDetailsDAO {
		
		static final Logger logger = LoggerFactory.getLogger(DocumentDetailsDAOImpl.class);
		
		@PersistenceContext
		private EntityManager entityManager;

		@SuppressWarnings("unchecked")
		public List<DocumentDetails> getDocumentDetails() {
			String hql = "FROM DocumentDetails as atcl ORDER BY atcl.id";
			return (List<DocumentDetails>) entityManager.createQuery(hql).getResultList();
		}
		

		public DocumentDetails getDocumentDetail(int documentDetailId) {
			return entityManager.find(DocumentDetails.class, documentDetailId);
		}

		public DocumentDetails createDocumentDetails(DocumentDetails documentDetails) {
			entityManager.persist(documentDetails);
			DocumentDetails b = getLastInsertedDocumentDetails();
			return b;
		}

		
		public DocumentDetails updateDocumentDetails(int documentDetailsId, DocumentDetails documentDetails) {
			//First We are taking Book detail from database by given book id and 
					// then updating detail with provided book object
			DocumentDetails documentDetailsFromDB = getDocumentDetail(documentDetailsId);
			documentDetailsFromDB.setDocumentNumber(documentDetails.getDocumentNumber());
			documentDetailsFromDB.setDocumentType(documentDetails.getDocumentType());
			documentDetails.setPersonalDetails(documentDetails.getPersonalDetails());
			documentDetails.setFrontImagePath(documentDetails.getFrontImagePath());
			documentDetails.setBackImagePath(documentDetails.getBackImagePath());
			documentDetails.setRemark(documentDetails.getRemark());
			documentDetails.setValidTill(documentDetails.getValidTill());
					entityManager.flush();
					
					//again i am taking updated result of book and returning the book object
					DocumentDetails updatedDocumentDetails = getDocumentDetail(documentDetailsId);
					return updatedDocumentDetails;
		}
		

		public boolean deleteDocumentDetails(int documentDetailsId) {
			DocumentDetails documentDetails = getDocumentDetail(documentDetailsId);
			entityManager.remove(documentDetails);
			
			//we are checking here that whether entityManager contains earlier deleted book or not
			// if contains then book is not deleted from DB that's why returning false;
			boolean status = entityManager.contains(documentDetails);
			if(status){
				return false;
			}
			return true;
		}

		
		/**
		 * This method will get the latest inserted record from the database and return the object of Book class
		 * @return book
		 */
		private DocumentDetails getLastInsertedDocumentDetails(){
			String hql = "from Building order by id DESC";
			Query query = entityManager.createQuery(hql);
			query.setMaxResults(1);
			DocumentDetails documentDetails = (DocumentDetails)query.getSingleResult();
			return documentDetails;
		}

		
		@Override
		public DocumentDetails findById(Integer id) {
			        return entityManager.find(DocumentDetails.class, id);
			    }

}
