/**
 * 
 */
package com.pms.search.specification;

import org.springframework.data.jpa.domain.Specification;

import com.pms.paymenttype.entity.PaymentType;

/**
 * 
 */
public class PaymentTypeSpecification {
	
//	String paymentTypeName,String paymentTypeShortName, String categoryName, String description
	public static Specification<PaymentType> hasPaymentTypeName(String paymentTypeName) {
        return (root, query, cb) ->
        paymentTypeName == null ? null : cb.like(cb.lower(root.get("paymentTypeName")), "%" + paymentTypeName.toLowerCase() + "%");
    }
	
	public static Specification<PaymentType> hasPaymentTypeShortName(String paymentTypeShortName) {
        return (root, query, cb) ->
        paymentTypeShortName == null ? null : cb.like(cb.lower(root.get("paymentTypeShortName")), "%" + paymentTypeShortName.toLowerCase() + "%");
    }
	
	public static Specification<PaymentType> hasCategoryName(String categoryName) {
        return (root, query, cb) ->
        categoryName == null ? null : cb.like(cb.lower(root.get("categoryName")), "%" + categoryName.toLowerCase() + "%");
    }
	
	public static Specification<PaymentType> hasDescription(String description) {
        return (root, query, cb) ->
        description == null ? null : cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%");
    }

}
