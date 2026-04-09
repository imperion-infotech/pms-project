/**
 * 
 */
package com.pms.guestdetails.dao.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.pms.document.dao.DocumentDetailsRepository;
import com.pms.document.entity.DocumentDetails;
import com.pms.guestdetails.GuestDetails;
import com.pms.guestdetails.dao.IGuestDetailsDAO;
import com.pms.personaldetails.PersonalDetails;
import com.pms.personaldetails.PersonalDetailsRepository;
import com.pms.rent.RentDetails;
import com.pms.rent.dao.impl.RentDetailsRepository;
import com.pms.room.dao.impl.RoomMasterRepository;
import com.pms.room.entity.RoomMaster;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

/**
 * 
 */
@Transactional
@Repository
public class GuestDetailsDAOImpl implements IGuestDetailsDAO {

	static final Logger logger = LoggerFactory.getLogger(GuestDetailsDAOImpl.class);

	@Autowired
	private GuestDetailsRepository guestDetailsRepository;

	@Autowired
	private RoomMasterRepository roomMasterRepository;

	@Autowired
	private PersonalDetailsRepository personalDetailsRepository;

	@Autowired
	private DocumentDetailsRepository documentDetailsRepository;

	@Autowired
	private RentDetailsRepository rentDetailsRepository;

	@PersistenceContext
	private EntityManager entityManager;

	public List<GuestDetails> getGuestDetails() {

//		String hql = "FROM GuestDetails as atcl ORDER BY atcl.id";
		return guestDetailsRepository.findAll();
	}

	public GuestDetails getGuestDetail(int guestDetailsId) {
		return entityManager.find(GuestDetails.class, guestDetailsId);
	}

	@Override
	public GuestDetails createGuestDetails(GuestDetails guestDetails) {

//		entityManager.persist(guestDetails);
//		GuestDetails b = getLastInsertedGuestDetail();

		// PersonalDetails
		/*PersonalDetails personal = personalDetailsRepository.findById(guestDetails.getPersonalDetails().getId())
				.orElseThrow(() -> new RuntimeException("Personal not found"));

		guestDetails.setPersonalDetails(personal);

		// RentDetails
		if (guestDetails.getRentDetails() != null) {
			RentDetails rent = rentDetailsRepository.findById(guestDetails.getRentDetails().getId())
					.orElseThrow(() -> new RuntimeException("Rent not found"));

			guestDetails.setRentDetails(rent);
		}

		// DocumentDetails (List)
		if (guestDetails.getDocumentDetails() != null) {
			List<DocumentDetails> docs = documentDetailsRepository
					.findAllById(guestDetails.getDocumentDetails().stream().map(DocumentDetails::getId).toList());
			List<DocumentDetails> listDocs = guestDetails.getDocumentDetails();

			if (docs != null && !docs.isEmpty()) {
				List<Integer> ids = docs.stream().map(DocumentDetails::getId).toList();
				List<DocumentDetails> dbDocs = documentDetailsRepository.findAllById(ids);

				guestDetails.setDocumentDetails(dbDocs);
			}
		}*/
		GuestDetails b = guestDetailsRepository.saveAndFlush(guestDetails);
		return b;
	}

	// TODO: CHANGE LATER TWINKLE
//		Optional<RentDetails> rDetails = rentDetailsRepository.findById(b.getRentId());
//		rDetails.ifPresent(rent -> {
//		    // use doc
//			b.setRentDetails(rent);
//		});

	// TODO: CHANGE BELOW CODE : TWINKLE
//		Optional<PersonalDetails> pDetails = personalDetailsRepository.findById((long) b.getPersonalDetailsId());
//		pDetails.ifPresent(pdet -> {
//		    // use doc
//			b.setPersonalDetails(pdet);
//		});

	@Override
	public GuestDetails updateGuestDetails(int guestDetailsId, GuestDetails guestDetails) {

		GuestDetails guestDetailsDB = getGuestDetail(guestDetailsId);
		guestDetailsDB.setCheckInDate(guestDetails.getCheckInDate());
		guestDetailsDB.setCheckInTime(guestDetails.getCheckInTime());
		guestDetailsDB.setCheckOutDate(guestDetails.getCheckOutDate());
		guestDetailsDB.setCheckOutTime(guestDetails.getCheckOutTime());
//		guestDetailsDB.setDocumentDetails(guestDetails.getDocumentDetails());
		guestDetailsDB.setGuestDetailsStatus(guestDetails.getGuestDetailsStatus());
		//guestDetailsDB.setPersonalDetails(guestDetails.getPersonalDetails());
//		guestDetailsDB.setRentDetails(guestDetails.getRentDetails());
		guestDetailsDB.setRoomMaster(guestDetails.getRoomMaster());
		guestDetailsDB.setNoOfDays(guestDetails.getNoOfDays());
		/*RentDetails rent = rentDetailsRepository.findById(guestDetails.getRentDetails().getId())
				.orElseThrow(() -> new RuntimeException("Rent not found"));
		guestDetailsDB.setRentDetails(rent);*/

		// ✅ Extract IDs from request
		/*List<Integer> docIds = guestDetails.getDocumentDetails().stream().map(DocumentDetails::getId).toList();

		// ✅ Fetch MANAGED entities from DB
		List<DocumentDetails> managedDocs = documentDetailsRepository.findAllById(docIds);

		// ✅ SET ONLY managed entities (VERY IMPORTANT)
		guestDetailsDB.setDocumentDetails(managedDocs);

		guestDetailsDB.setDocumentDetails(managedDocs);

		PersonalDetails pDetails = personalDetailsRepository.findById(guestDetails.getPersonalDetails().getId())
				.orElseThrow(() -> new RuntimeException("Personal Details not found"));
		guestDetailsDB.setPersonalDetails(pDetails);*/

//		entityManager.flush();
		guestDetailsRepository.save(guestDetailsDB);
		GuestDetails updatedGuestDetails = getGuestDetail(guestDetailsId);

		return updatedGuestDetails;
	}

	@Override
	public boolean deleteGuestDetails(int guestDetailsId) {

		GuestDetails guestDetails = getGuestDetail(guestDetailsId);
		entityManager.remove(guestDetails);

		// we are checking here that whether entityManager contains earlier deleted book
		// or not
		// if contains then book is not deleted from DB that's why returning false;
		boolean status = entityManager.contains(guestDetails);
		if (status) {
			return false;
		}
		return true;
	}

	public GuestDetails findById(Integer id) {

		return entityManager.find(GuestDetails.class, id);
	}

	private GuestDetails getLastInsertedGuestDetail() {
		String hql = "from GuestDetails order by id DESC";
		Query query = entityManager.createQuery(hql);
		query.setMaxResults(1);
		GuestDetails guestDetails = (GuestDetails) query.getSingleResult();
		return guestDetails;
	}

}
