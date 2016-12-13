package dto;

public class UserBookingObject {
	private String date;
	private String timeslot;
	private String bikeNumber;
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getTimeslot() {
		return timeslot;
	}
	public void setTimeslot(String timeslot) {
		this.timeslot = timeslot;
	}
	public String getBikeNumber() {
		return bikeNumber;
	}
	public void setBikeNumber(String bikeNumber) {
		this.bikeNumber = bikeNumber;
	}

	public UserBookingObject(String date, String timeslot, String bikeNumber) {
		super();
		this.date = date;
		this.timeslot = timeslot;
		this.bikeNumber = bikeNumber;
	}
	
	public UserBookingObject() {
		super();
	} 
	
}
