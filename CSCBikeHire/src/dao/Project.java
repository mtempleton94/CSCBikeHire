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
	public ArrayList<BookingObject> GetFeeds(Connection connection) throws Exception
	{
		ArrayList<BookingObject> feedData = new ArrayList<BookingObject>();
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
				BookingObject feedObject = new BookingObject();
				feedObject.setDate(rs.getString("date"));
				feedObject.setTimeslot1(rs.getString("Timeslot1"));
				feedObject.setTimeslot2(rs.getString("Timeslot2"));
				feedObject.setTimeslot3(rs.getString("Timeslot3"));
				feedData.add(feedObject);
			}
			return feedData;
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
			PreparedStatement ps = connection.prepareStatement("SELECT date, timeslot, bikeNumber FROM bikehire.booking WHERE emailAddress = '"+employeeID+"' AND date >= now()-1;");
			System.out.println(ps);
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
// User Login Information	
//===========================================================================================	
public ArrayList<UserLoginObject> GetUserLogin(Connection connection, String employeeID, String pin) throws Exception
{
	ArrayList<UserLoginObject> userBookingData = new ArrayList<UserLoginObject>();
	try
	{
		PreparedStatement ps = connection.prepareStatement("SELECT * FROM bikehire.employee WHERE emailAddress = '"+employeeID+"' AND pin = " + pin);
		ResultSet rs = ps.executeQuery();
				
		while(rs.next())
		{
			UserLoginObject userLoginObject = new UserLoginObject();
			userLoginObject.setEmployeeID(rs.getString("emailAddress"));
			userLoginObject.setPin(rs.getString("pin"));
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
	
	
}
