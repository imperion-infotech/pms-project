/**
 * 
 */
package com.pms.room.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.floor.entity.Floor;
import com.pms.roomtype.entity.RoomType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name="room_master")
public class RoomMaster {
	
static final Logger logger = LoggerFactory.getLogger(Floor.class);
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private int id;
	
	@Column(name="room_name")
	private String roomName;
	
	@Column(name="room_short_name")
	private String roomShortName;
	
	@Column(name="room_type_id")
	private Integer roomTypeId;
	
	@Column(name="floor_id")
	private Integer floorId;

	@Column(name="smoking")
	private boolean smoking;
	
	@Column(name="handicap")
	private boolean handicap;

	@Column(name="non_room")
	private boolean nonRoom;
	
	@Column(name="created_on", nullable = false, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;
	
	private String name;
	
	private String roomTypeName;
	
		@ManyToOne
	    @JoinColumn(name = "room_type_id", insertable = false, updatable = false)
	    private RoomType roomType;

	    // Getter for room type name
	    public String getRoomTypeName() {
	        return roomType != null ? roomType.getRoomTypeName(): null;
	    }
	    
	    public String setRoomTypeName(String roomTypeName) {
	    	return this.roomTypeName=roomTypeName;
	    }
	    
	    
	    @ManyToOne
	    @JoinColumn(name = "floor_id", insertable = false, updatable = false)
	    private Floor floor;

	    // Getter for room type name
	    public String getName() {
	        return floor != null ? floor.getName(): null;
	    }
	    
	    public String setName(String name) {
	    	return this.name=name;
	    }
	    
		public RoomType getRoomType() {
			return roomType;
		}

		public void setRoomType(RoomType roomType) {
			this.roomType = roomType;
		}

		public Floor getFloor() {
			return floor;
		}

		public void setFloor(Floor floor) {
			this.floor = floor;
		}

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getRoomName() {
			return roomName;
		}

		public void setRoomName(String roomName) {
			this.roomName = roomName;
		}

		public String getRoomShortName() {
			return roomShortName;
		}

		public void setRoomShortName(String roomShortName) {
			this.roomShortName = roomShortName;
		}

		

		public Integer getRoomTypeId() {
			return roomTypeId;
		}


		public void setRoomTypeId(Integer roomTypeId) {
			this.roomTypeId = roomTypeId;
		}


		public Integer getFloorId() {
			return floorId;
		}


		public void setFloorId(Integer floorId) {
			this.floorId = floorId;
		}


		public boolean isSmoking() {
			return smoking;
		}

		public void setSmoking(boolean smoking) {
			this.smoking = smoking;
		}

		public boolean isHandicap() {
			return handicap;
		}

		public void setHandicap(boolean handicap) {
			this.handicap = handicap;
		}

		public boolean isNonRoom() {
			return nonRoom;
		}

		public void setNonRoom(boolean nonRoom) {
			this.nonRoom = nonRoom;
		}

		public Date getCreatedOn() {
			return createdOn;
		}

		public void setCreatedOn(Date createdOn) {
			this.createdOn = createdOn;
		}
	
}
