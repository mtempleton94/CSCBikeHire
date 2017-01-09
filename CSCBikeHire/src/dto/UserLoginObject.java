package dto;

public class UserLoginObject {
	private String employeeID;
	private String pin;
	private String hash;
	private String verified;
	
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
	public String getHash() {
		return hash;
	}
	public void setHash(String hash) {
		this.hash = hash;
	}
	public String getVerified() {
		return verified;
	}
	public void setVerified(String verified) {
		this.verified = verified;
	}
	
	
	public UserLoginObject(String employeeID, String pin, String hash, String verified) {
		super();
		this.employeeID = employeeID;
		this.pin = pin;
		this.hash = hash;
		this.verified = verified;

	}
	
	public UserLoginObject() {
		super();
	} 
	
}
