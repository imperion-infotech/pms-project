/**
 * 
 */
package com.pms.roomstatus.entity;

/**
 * 
 */
import java.io.Serializable;
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



@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="room_status")
public class RoomStatus implements Serializable {
	
	static final Logger logger = LoggerFactory.getLogger(RoomStatus.class);
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="room_status_id")
	private int id;
	
	@Column(name="room_status_name")
	private String roomStatusName;
	
	@Column(name="room_status_title")
	private String roomStatusTitle;
	
	
	@Column(name="room_status_color")
	private String roomStatusColor;
	
	@Column(name="room_status_text_color")
	private String roomStatusTextColor;
	
	@Column(name="created_on", nullable = false, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getRoomStatusName() {
		return roomStatusName;
	}

	public void setRoomStatusName(String roomStatusName) {
		this.roomStatusName = roomStatusName;
	}

	public String getRoomStatusTitle() {
		return roomStatusTitle;
	}

	public void setRoomStatusTitle(String roomStatusTitle) {
		this.roomStatusTitle = roomStatusTitle;
	}

	public String getRoomStatusColor() {
		return roomStatusColor;
	}

	public void setRoomStatusColor(String roomStatusColor) {
		this.roomStatusColor = roomStatusColor;
	}

	public String getRoomStatusTextColor() {
		return roomStatusTextColor;
	}

	public void setRoomStatusTextColor(String roomStatusTextColor) {
		this.roomStatusTextColor = roomStatusTextColor;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("RoomStatus [id=");
		builder.append(id);
		builder.append(", roomStatusName=");
		builder.append(roomStatusName);
		builder.append(", roomStatusTitle=");
		builder.append(roomStatusTitle);
		builder.append(", roomStatusColor=");
		builder.append(roomStatusColor);
		builder.append(", roomStatusTextColor=");
		builder.append(roomStatusTextColor);
		builder.append(", createdOn=");
		builder.append(createdOn);
		builder.append("]");
		return builder.toString();
	}

}

