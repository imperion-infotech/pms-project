package com.pms.personaldetails;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long>, JpaSpecificationExecutor<PersonalDetails> {

	Optional<PersonalDetails> findByIdAndIsDeletedFalse(Long id);
	List<PersonalDetails> findByIsDeletedFalse();
}
