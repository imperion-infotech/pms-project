/**
 * 
 */
package com.pms.room.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pms.building.entity.Building;
import com.pms.floor.entity.Floor;
import com.pms.roomstatus.entity.RoomStatus;
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
	
static final Logger logger = LoggerFactory.getLogger(RoomMaster.class);
	
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
	
	@Column(name="building_id")
	private Integer buildingId;

	@Column(name="smoking")
	private boolean smoking;
	
	@Column(name="handicap")
	private boolean handicap;

	@Column(name="non_room")
	private boolean nonRoom;
	
	@Column(name="created_on", nullable = false, updatable = false)
	@CreationTimestamp // Automatically sets value when entity is persisted
	private Date createdOn;
	
	private String floorName;
	
	private String roomTypeName;
	
	private String buildingName;
	
	private Integer roomStatusId;
	
	private String roomStatus;
	
	public String getBuildingName() {
		return buildingName;
	}

	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}

	
	
	public Integer getRoomStatusId() {
		return roomStatusId;
	}

	public void setRoomStatusId(Integer roomStatusId) {
		this.roomStatusId = roomStatusId;
	}

	@ManyToOne
    @JoinColumn(name = "room_status_table_id", insertable = false, updatable = false)
    private RoomStatus roomStatusTable;

		@OneToOne
	    @JoinColumn(name = "room_type_id", insertable = false, updatable = false)
	    private RoomType roomType;
		
		
		
	    public Building getBuilding() {
			return building;
		}

		public void setBuilding(Building building) {
			this.building = building;
		}

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
	    
	    @ManyToOne
	    @JoinColumn(name = "building_id", insertable = false, updatable = false)
	    private Building building;

	    // Getter for room type name
	    public String getName() {
	        return floor != null ? floor.getName(): null;
	    }
	    
	    public String setFloorName(String floorName) {
	    	return this.floorName=floorName;
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

		public Integer getBuildingId() {
			return buildingId;
		}

		public void setBuildingId(Integer buildingId) {
			this.buildingId = buildingId;
		}

		public String getRoomStatus() {
			return roomStatus;
		}

		public void setRoomStatus(String roomStatus) {
			this.roomStatus = roomStatus;
		}

		public RoomStatus getRoomStatusTable() {
			return roomStatusTable;
		}

		public void setRoomStatusTable(RoomStatus roomStatusTable) {
			this.roomStatusTable = roomStatusTable;
		}
		
	
		
}
