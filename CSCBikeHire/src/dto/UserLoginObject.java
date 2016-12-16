package dto;

public class UserLoginObject {
	private String employeeID;
	private String pin;
	
	public String getEmployeeID() {
		return employeeID;
	}
	public void setEmployeeID(String employeeID) {
		this.employeeID = employeeID;
	}
	public String getPin() {
		return pin;
	}
	public void setPin(String pin) {
		this.pin = pin;
	}
	
	public UserLoginObject(String employeeID, String pin) {
		super();
		this.employeeID = employeeID;
		this.pin = pin;
	}
	
	public UserLoginObject() {
		super();
	} 
	
}
