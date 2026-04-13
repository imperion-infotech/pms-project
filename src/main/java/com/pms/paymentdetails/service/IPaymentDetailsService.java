/**
 * 
 */
package com.pms.paymentdetails.service;

import java.util.List;

import com.pms.paymentdetails.entity.PaymentDetails;
import com.pms.paymentdetails.entity.PaymentDetailsResponseDTO;

/**
 * 
 */
public interface IPaymentDetailsService {
	
	List<PaymentDetails> getAllPaymentDetails();
	PaymentDetails createPaymentDetails(PaymentDetails paymentDetails);
	PaymentDetails updatePaymentDetails(int PaymentDetailsId, PaymentDetails paymentDetails);
	PaymentDetails getPaymentDetailsById(Integer id);
	public boolean deletePaymentDetails(int paymentDetailsId);
    public List<PaymentDetailsResponseDTO> getPaymentsByGuestId(Long guestId);

}
