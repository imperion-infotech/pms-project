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
//		return dao.getFloors();
		return taxMastersRepository.findAll();
	}

	public TaxMaster createTaxMaster(TaxMaster taxMaster) {
//		return dao.createFloor(Floor);
		 return taxMastersRepository.saveAndFlush(taxMaster);
	}

	public TaxMaster updateTaxMaster(int taxMasterId, TaxMaster taxMaster) {
		return dao.updateTaxMaster(taxMasterId, taxMaster);
	}

	public TaxMaster getTaxMaster(int taxMasterId) {
		return dao.getTaxMaster(taxMasterId);
	}

	public boolean deleteTaxMaster(int taxMasterId) {
		return dao.deleteTaxMaster(taxMasterId);
	}
	
	
	 public TaxMaster getTaxMasterById(Integer id) { // ✅ Implemented method
	        return dao.findById(id);
	    }

	 @Override
	 public List<TaxMaster> search(String taxMasterName, String taxTypeEnum) {
	        Specification<TaxMaster> spec = Specification
	                .where(TaxMasterSpecification.hasTaxMasterName(taxMasterName))
	                .and(TaxMasterSpecification.hasTaxTypeEnum(taxTypeEnum));

	        return taxMastersRepository.findAll(spec);
	    }

	
}