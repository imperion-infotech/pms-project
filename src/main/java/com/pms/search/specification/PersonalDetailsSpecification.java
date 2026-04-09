/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.personaldetails.PersonalDetails;

/**
 * 
 */
public class PersonalDetailsSpecification {
	
	public static Specification<PersonalDetails> isNotDeleted() {
	    return (root, query, criteriaBuilder) ->
	            criteriaBuilder.isFalse(root.get("isDeleted"));
	}
	
	public static Specification<PersonalDetails> hasFirstName(String firstName) {
        return (root, query, cb) ->
                firstName == null ? null : cb.like(cb.lower(root.get("firstName")), "%" + firstName.toLowerCase() + "%");
    }
	
	public static Specification<PersonalDetails> hasLastName(String lastName) {
        return (root, query, cb) ->
                lastName == null ? null : cb.like(cb.lower(root.get("lastName")), "%" + lastName.toLowerCase() + "%");
    }


    public static Specification<PersonalDetails> hasEmail(String email) {
        return (root, query, cb) ->
                email == null ? null : cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<PersonalDetails> hasPhone(String phone) {
        return (root, query, cb) ->
                phone == null ? null : cb.equal(root.get("phone"), phone);
    }

    public static Specification<PersonalDetails> hasAddress(String address) {
        return (root, query, cb) ->
        address == null ? null : cb.like(cb.lower(root.get("address")), "%" + address.toLowerCase() + "%");
    }
}