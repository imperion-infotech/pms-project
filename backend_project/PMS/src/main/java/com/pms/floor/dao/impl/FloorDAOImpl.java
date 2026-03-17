package com.pms.floor.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.pms.floor.dao.IFloorDAO;
import com.pms.floor.entity.Floor;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Transactional
@Repository
public class FloorDAOImpl implements IFloorDAO {
	
	@PersistenceContext
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public List<Floor> getFloors() {
		String hql = "FROM Book as atcl ORDER BY atcl.id";
		return (List<Floor>) entityManager.createQuery(hql).getResultList();
	}
	

	public Floor getFloor(int floorId) {
		return entityManager.find(Floor.class, floorId);
	}

	public Floor createFloor(Floor floor) {
		entityManager.persist(floor);
		Floor b = getLastInsertedFloor();
		return b;
	}

	public Floor updateFloor(int floorId, Floor floor) {
		//First We are taking Book detail from database by given book id and 
				// then updating detail with provided book object
				Floor floorFromDB = getFloor(floorId);
				floorFromDB.setName(floor.getName());
				floorFromDB.setDescription(floor.getDescription());
				
				
				entityManager.flush();
				
				//again i am taking updated result of book and returning the book object
				Floor updatedFloor = getFloor(floorId);
				
				return updatedFloor;
	}

	public boolean deleteFloor(int floorId) {
		Floor floor = getFloor(floorId);
		entityManager.remove(floor);
		
		//we are checking here that whether entityManager contains earlier deleted book or not
		// if contains then book is not deleted from DB that's why returning false;
		boolean status = entityManager.contains(floor);
		if(status){
			return false;
		}
		return true;
	}

	
	/**
	 * This method will get the latest inserted record from the database and return the object of Book class
	 * @return book
	 */
	private Floor getLastInsertedFloor(){
		String hql = "from Book order by id DESC";
		Query query = entityManager.createQuery(hql);
		query.setMaxResults(1);
		Floor floor = (Floor)query.getSingleResult();
		return floor;
	}


	@Override
	public Optional<Floor> findById(Integer id) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}


//	@Override
//	public Book CreateBook(Book book) {
//		// TODO Auto-generated method stub
//		return null;
//	}
//
//
//	@Override
//	public Book book(int BookId, Book book) {
//		// TODO Auto-generated method stub
//		return null;
//	}
//	

}
