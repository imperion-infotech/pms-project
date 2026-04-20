/**
 * 
 */
package com.pms.taxmaster.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.pms.floor.entity.Floor;
import com.pms.search.specification.FloorSpecification;
import com.pms.search.specification.TaxMasterSpecification;
import com.pms.security.configuration.HotelContext;
import com.pms.taxmaster.dao.ITaxMasterDAO;
import com.pms.taxmaster.dao.TaxMastersRepository;
import com.pms.taxmaster.entity.TaxMaster;
import com.pms.taxmaster.service.ITaxMasterService;

/**
 * 
 */
@Service
public class TaxMasterServiceImpl implements ITaxMasterService {
	
	static final Logger logger = LoggerFactory.getLogger(TaxMasterServiceImpl.class);
	
	@Autowired
	private ITaxMasterDAO dao;
	
	@Autowired
	private TaxMastersRepository taxMastersRepository;
	
	

	public TaxMasterServiceImpl(ITaxMasterDAO dao, TaxMastersRepository taxMastersRepository) {
		super();
		this.dao = dao;
		this.taxMastersRepository = taxMastersRepository;
	}

	public List<TaxMaster> getTaxMasters() {
		Long hotelId = HotelContext.getHotelId();

	    if (hotelId == null) {
	        throw new RuntimeException("Hotel not selected");
	    }
		return taxMastersRepository.findByHotelId(HotelContext.getHotelId());
	}

	public TaxMaster createTaxMaster(TaxMaster taxMaster) {
//		return dao.createFloor(Floor);
		 return taxMastersRepository.saveAndFlush(taxMaster);
	}

	public TaxMaster updateTaxMaster(int taxMasterId, TaxMaster taxMaster) {
		return dao.updateTaxMaster(taxMasterId, taxMaster);
	}

	public TaxMaster getTaxMaster(int taxMasterId) {
		return taxMastersRepository.findByIdAndHotelId(taxMasterId,HotelContext.getHotelId());
	}

	public boolean deleteTaxMaster(int taxMasterId) {
		TaxMaster taxMaster = taxMastersRepository.findByIdAndHotelId(taxMasterId,HotelContext.getHotelId());
		 boolean isDeleted=true;;
		 if(taxMaster == null ) {
			 isDeleted=false;
			 throw new RuntimeException("taxMaster not found");
		 }
		 taxMaster.setIsDeleted(true);
		 taxMaster.setIsActive(false);
		 TaxMaster b= taxMastersRepository.save(taxMaster);
			if(b.getId() != 0)
			{
				isDeleted=true;
			} else 
			{
				isDeleted=false;
			}
			return isDeleted;
	}
	
	
	 @Override
	 public List<TaxMaster> search(String taxMasterName, String taxTypeEnum) {
		 Long hotelId = HotelContext.getHotelId(); 
	        Specification<TaxMaster> spec = Specification
	        		.where(TaxMasterSpecification.hasHotelId(hotelId)) 
	                .and(TaxMasterSpecification.hasTaxMasterName(taxMasterName))
	                .and(TaxMasterSpecification.hasTaxTypeEnum(taxTypeEnum));

	        return taxMastersRepository.findAll(spec);
	    }

	 @Override
	 public TaxMaster getTaxMasterByIdAndHotelID(Integer id) {
		 return taxMastersRepository.findByIdAndHotelId(id,HotelContext.getHotelId());
	 }

	
}