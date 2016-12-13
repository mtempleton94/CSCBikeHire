package dto;

public class BookingObject {
	
	private String date;
	private String timeslot1;
	private String timeslot2;
	private String timeslot3;
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTimeslot1() {
		return timeslot1;
	}

	public void setTimeslot1(String timeslot1) {
		this.timeslot1 = timeslot1;
	}

	public String getTimeslot2() {
		return timeslot2;
	}

	public void setTimeslot2(String timeslot2) {
		this.timeslot2 = timeslot2;
	}

	public String getTimeslot3() {
		return timeslot3;
	}

	public void setTimeslot3(String timeslot3) {
		this.timeslot3 = timeslot3;
	}

	public BookingObject(String date, String timeslot1, String timeslot2, String timeslot3) {
		super();
		this.date = date;
		this.timeslot1 = timeslot1;
		this.timeslot2 = timeslot2;
		this.timeslot3 = timeslot3;
	}
	
	public BookingObject() {
		super();
	} 
	

	
	
}
