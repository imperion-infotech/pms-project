/**
 * 
 */
package com.pms.common.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.pms.baseentity.BaseEntity;
import com.pms.common.repository.SoftDeleteRepository;
import com.pms.security.configuration.HotelContext;
import com.pms.security.configuration.UserContext;

import jakarta.transaction.Transactional;

/**
 * 
 */
@Service
public class SoftDeleteService {

    @Transactional
    public <T extends BaseEntity, ID> void softDelete(ID id, SoftDeleteRepository<T, ID> repository) {

        Long hotelId = HotelContext.getHotelId();
        Long userId = UserContext.getUserId();

        T entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!entity.getHotelId().equals(hotelId)) {
            throw new RuntimeException("Unauthorized access");
        }

        entity.setIsDeleted(true);
        entity.setIsActive(false);
        entity.setDeletedBy(userId);
        entity.setDeletedOn(LocalDateTime.now());
        entity.setUpdatedBy(userId);
        entity.setUpdatedOn(LocalDateTime.now());

        repository.save(entity);
    }
}
