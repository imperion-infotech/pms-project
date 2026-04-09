/**
 * 
 */
package com.pms.document.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="document_type")
public class DocumentType {
	
static final Logger logger = LoggerFactory.getLogger(DocumentType.class);
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private int id;
	
	@Column(name="document_type_short_name")
	private String documentTypeShortName;
	
	@Column(name="document_type_name")
	private String documentTypeName;
	
	@Column(name="document_type_description")
	private String documentTypeDescription;
	
	@Column(name="document_type_category")
	private String documentTypeCategory;
	
	@Column(name="document_type_default")
	private boolean documentTypeDefault;
	
	@Column(name="created_on", nullable = false, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}
	
	public String getDocumentTypeCategory() {
		return documentTypeCategory;
	}

	public void setDocumentTypeCategory(String documentTypeCategory) {
		this.documentTypeCategory = documentTypeCategory;
	}

	public String getDocumentTypeShortName() {
		return documentTypeShortName;
	}

	public void setDocumentTypeShortName(String documentTypeShortName) {
		this.documentTypeShortName = documentTypeShortName;
	}

	public String getDocumentTypeName() {
		return documentTypeName;
	}

	public void setDocumentTypeName(String documentTypeName) {
		this.documentTypeName = documentTypeName;
	}

	public String getDocumentTypeDescription() {
		return documentTypeDescription;
	}

	public void setDocumentTypeDescription(String documentTypeDescription) {
		this.documentTypeDescription = documentTypeDescription;
	}

	public boolean getDocumentTypeDefault() {
		return documentTypeDefault;
	}

	public void setDocumentTypeDefault(boolean documentTypeDefault) {
		this.documentTypeDefault = documentTypeDefault;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("DocumentType [id=");
		builder.append(id);
		builder.append(", documentTypeShortName=");
		builder.append(documentTypeShortName);
		builder.append(", documentTypeName=");
		builder.append(documentTypeName);
		builder.append(", documentTypeDescription=");
		builder.append(documentTypeDescription);
		builder.append(", documentTypeCategory=");
		builder.append(documentTypeCategory);
		builder.append(", documentTypeDefault=");
		builder.append(documentTypeDefault);
		builder.append(", createdOn=");
		builder.append(createdOn);
		builder.append("]");
		return builder.toString();
	}

}
