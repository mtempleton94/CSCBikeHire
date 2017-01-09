package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.mysql.jdbc.Statement;

import dto.BookingObject;
import dto.UserBookingObject;
import dto.UserLoginObject;

public class Project 
{	
//===========================================================================================
// All User Bookings 	
//===========================================================================================	
	public ArrayList<BookingObject> GetAllBookings(Connection connection) throws Exception
	{
		ArrayList<BookingObject> bookingsData = new ArrayList<BookingObject>();
		try
		{
			PreparedStatement ps = connection.prepareStatement("select DATE_FORMAT(date,'%d/%m/%Y') AS date, "
					+ "sum(case when timeslot = 1 then 1 else 0 end) Timeslot1 , "
					+ "sum(case when timeslot = 2 then 1 else 0 end) Timeslot2 , "
					+ "sum(case when timeslot = 3 then 1 else 0 end) Timeslot3 "
					+ "from booking where date >= now()-1 group by date");
			
			ResultSet rs = ps.executeQuery();
			
			while(rs.next())
			{
				BookingObject bookingsObject = new BookingObject();
				bookingsObject.setDate(rs.getString("date"));
				bookingsObject.setTimeslot1(rs.getString("Timeslot1"));
				bookingsObject.setTimeslot2(rs.getString("Timeslot2"));
				bookingsObject.setTimeslot3(rs.getString("Timeslot3"));
				bookingsData.add(bookingsObject);
			}
			return bookingsData;
		}
		catch(Exception e)
		{
			throw e;
		}
	}
//===========================================================================================
// END :: All User Bookings 	
//===========================================================================================		
	
	
//===========================================================================================
// Bookings for Current User 	
//===========================================================================================	
	public ArrayList<UserBookingObject> GetUserBookings(Connection connection, String employeeID) throws Exception
	{
		ArrayList<UserBookingObject> userBookingData = new ArrayList<UserBookingObject>();
		try
		{
			//PreparedStatement ps = connection.prepareStatement("SELECT date, timeslot, bikeNumber FROM bikehire.booking WHERE emailAddress = '"+employeeID+"' AND date >= now()-1;");
			String query = "SELECT date, timeslot, bikeNumber FROM bikehire.booking WHERE emailAddress = ? AND date >= now()-1;";
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setString(1, employeeID);
			ResultSet rs = ps.executeQuery();
			
			while(rs.next())
			{
				UserBookingObject userBookingObject = new UserBookingObject();
				userBookingObject.setDate(rs.getString("date"));
				userBookingObject.setTimeslot(rs.getString("timeslot"));
				userBookingObject.setBikeNumber(rs.getString("bikeNumber"));
				userBookingData.add(userBookingObject);
			}
			return userBookingData;
		}
		catch(Exception e)
		{
			throw e;
		}
	}
//===========================================================================================	
// END :: Bookings for Current User 	
//===========================================================================================	
	
	
	
//===========================================================================================
// User Hash for Account Verification
//===========================================================================================	
	public ArrayList<UserLoginObject> GetUserHash(Connection connection, String employeeID, String hash) throws Exception
	{
		ArrayList<UserLoginObject> userHashData = new ArrayList<UserLoginObject>();
		try
		{
			//PreparedStatement ps = connection.prepareStatement("SELECT * FROM bikehire.employee WHERE emailAddress = '"+employeeID+"' AND hash = '"+ hash+"'");
			String query = "SELECT * FROM bikehire.employee WHERE emailAddress = ? AND hash = ?";
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setString(1, employeeID);
			ps.setString(2, hash);
			ResultSet rs = ps.executeQuery();
			
			while(rs.next())
			{
				UserLoginObject userLoginObject = new UserLoginObject();
				userLoginObject.setEmployeeID(rs.getString("emailAddress"));
				userLoginObject.setHash(rs.getString("hash"));
				userHashData.add(userLoginObject);
			}
			return userHashData;
		}
		catch(Exception e)
		{
			throw e;
		}
	}
//===========================================================================================	
// END :: User Hash for Account Verification	
//===========================================================================================	
	
	
	
//===========================================================================================
// User Login Information	
//===========================================================================================	
	public ArrayList<UserLoginObject> GetUserLogin(Connection connection, String employeeID, String pin) throws Exception
	{
		ArrayList<UserLoginObject> userBookingData = new ArrayList<UserLoginObject>();
		try
		{
			//PreparedStatement ps = connection.prepareStatement("SELECT * FROM bikehire.employee WHERE emailAddress = '"+employeeID+"' AND pin = " + pin);
			String query = "SELECT * FROM bikehire.employee WHERE emailAddress = ? AND pin = ?";
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setString(1, employeeID);
			ps.setString(2, pin);
			ResultSet rs = ps.executeQuery();
					
			while(rs.next())
			{
				UserLoginObject userLoginObject = new UserLoginObject();
				userLoginObject.setEmployeeID(rs.getString("emailAddress"));
				userLoginObject.setPin(rs.getString("pin"));
				userLoginObject.setVerified(rs.getString("accountVerified"));
				userBookingData.add(userLoginObject);
			}
			return userBookingData;
		}
		catch(Exception e)
		{
			throw e;
		}
	}
//===========================================================================================	
// END :: User Login Information
//===========================================================================================	
	
	
	
//===========================================================================================
// Retrieve user ID to check if they exist
//===========================================================================================	
	public ArrayList<UserLoginObject> GetUserExists(Connection connection, String employeeID) throws Exception
	{
		ArrayList<UserLoginObject> userBookingData = new ArrayList<UserLoginObject>();
		try
		{
			//PreparedStatement ps = connection.prepareStatement("SELECT emailAddress, accountVerified FROM bikehire.employee WHERE emailAddress = '"+employeeID+"'");
			String query = "SELECT emailAddress, accountVerified FROM bikehire.employee WHERE emailAddress = ?";
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setString(1, employeeID);
			ResultSet rs = ps.executeQuery();
					
			while(rs.next())
			{
				UserLoginObject userLoginObject = new UserLoginObject();
				userLoginObject.setEmployeeID(rs.getString("emailAddress"));
				userLoginObject.setVerified(rs.getString("accountVerified"));
				userBookingData.add(userLoginObject);
			}
			return userBookingData;
		}
		catch(Exception e)
		{
			throw e;
		}
	}
//===========================================================================================	
// END :: Retrieve user ID to check if they exist
//===========================================================================================
	
	
}
