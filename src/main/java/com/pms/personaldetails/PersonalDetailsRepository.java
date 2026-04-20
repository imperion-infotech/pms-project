package com.pms.personaldetails;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long>, JpaSpecificationExecutor<PersonalDetails> {

	Optional<PersonalDetails> findByIdAndHotelIdAndIsDeletedFalse(Long id, Long hotelId);
	List<PersonalDetails> findByHotelIdAndIsDeletedFalse(Long hotelId);
}
