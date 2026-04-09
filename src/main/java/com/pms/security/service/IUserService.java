/**
 * 
 */
package com.pms.security.service;

import com.pms.security.dto.RegisterRequest;
import com.pms.security.entity.User;

/**
 * 
 */
public interface IUserService {
	
	public User registerNewUser(RegisterRequest request);
	

}
