package model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.ArrayList;

import com.mysql.jdbc.ResultSet;

import dao.Database;
import dao.Project;
import dto.BookingObject;
import dto.UserBookingObject;
import dto.UserLoginObject;

public class ProjectManager {

//==========================================================	
// Get All Bookings	
//==========================================================
	public ArrayList<BookingObject> GetAllBookings() throws Exception 
	{
		ArrayList<BookingObject> feeds = null;
		try 
		{
			Database database = new Database();
			Connection connection = database.Get_Connection();
			Project project = new Project();
			feeds = project.GetAllBookings(connection);
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); //Console 
			throw e;
		}
		return feeds;
	}
//==========================================================	
// END :: GET	
//==========================================================

	
//==========================================================	
// Get Current User Bookings	
//==========================================================
	public ArrayList<UserBookingObject> GetUserBookings(String employeeID) throws Exception 
	{
		ArrayList<UserBookingObject> feeds = null;
		try 
		{
			Database database = new Database();
			Connection connection = database.Get_Connection();
			Project project = new Project();
			feeds = project.GetUserBookings(connection, employeeID);
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); //Console 
			throw e;
		}
		return feeds;
	}
//==========================================================	
// END :: Get Current User Bookings	
//==========================================================
	
	
//==========================================================	
// Get User Login Info	
//==========================================================
	public ArrayList<UserLoginObject> GetUserLogin(String employeeID, String pin) throws Exception 
	{
		ArrayList<UserLoginObject> feeds = null;
		try 
		{
			Database database = new Database();
			Connection connection = database.Get_Connection();
			Project project = new Project();
			feeds = project.GetUserLogin(connection, employeeID, pin);
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); //Console 
			throw e;
		}
		return feeds;
	}
//==========================================================	
// END :: Get User Login Info
//==========================================================


//==========================================================	
// Check if a user already exists	
//==========================================================
	public ArrayList<UserLoginObject> GetUserExists(String employeeID) throws Exception 
	{
		ArrayList<UserLoginObject> feeds = null;
		try 
		{
			Database database = new Database();
			Connection connection = database.Get_Connection();
			Project project = new Project();
			feeds = project.GetUserExists(connection, employeeID);
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); //Console 
			throw e;
		}
		return feeds;
	}
//==========================================================	
// END :: Check if a user already exists
//==========================================================
	
	
	
	
//==========================================================	
// Get User Hash
//==========================================================
	public ArrayList<UserLoginObject> GetUserHash(String employeeID, String hash) throws Exception 
	{
		ArrayList<UserLoginObject> feeds = null;
		try 
		{
			Database database = new Database();
			Connection connection = database.Get_Connection();
			Project project = new Project();
			feeds = project.GetUserHash(connection, employeeID, hash);
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); 
			throw e;
		}
		return feeds;
	}
//==========================================================	
//END :: Get User Hash	
//==========================================================


//==========================================================	
// Create a New user
//==========================================================
	public static void CreateUser(String employee, String pin, String hash) throws Exception 
	{
		Connection connection = null;
		PreparedStatement ps = null;
		try 
		{
			Database database = new Database();
			connection = database.Get_Connection();
			String query = "INSERT INTO `bikehire`.`employee` (`emailAddress`, `pin`, `accountVerified`, `hash`) VALUES (?, ?, '0', ?);";
			ps = connection.prepareStatement(query);
			ps.setString(1, employee);
			ps.setString(2, pin);
			ps.setString(3, hash);
			ps.executeUpdate();
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); 
			throw e;
		}
		finally 
		{
			if (ps != null) {
				ps.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
	}		
//==========================================================	
//END :: Create a New user
//==========================================================

//==========================================================	
// Update hash for a user
//==========================================================
	public static void UpdateHash(String employee, String hash) throws Exception 
	{
		Connection connection = null;
		PreparedStatement ps = null;
		try 
		{
			Database database = new Database();
			connection = database.Get_Connection();
			String query = "UPDATE bikehire.employee SET hash=? WHERE emailAddress = ?;";
			ps = connection.prepareStatement(query);
			ps.setString(1, hash);
			ps.setString(2, employee);
			ps.executeUpdate();
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); 
			throw e;
		}
		finally 
		{
			if (ps != null) {
				ps.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
	}		
//==========================================================	
//END :: Update hash for a user
//==========================================================
	
	
	
	
//==========================================================	
// Update pin for a user
//==========================================================
	public static void UpdatePin(String employee, String pin) throws Exception 
	{
		Connection connection = null;
		PreparedStatement ps = null;
		try 
		{
			Database database = new Database();
			connection = database.Get_Connection();
			String query = "UPDATE bikehire.employee SET pin= ? WHERE emailAddress = ?;";
			ps = connection.prepareStatement(query);
			ps.setString(1, pin);
			ps.setString(2, employee);
			ps.executeUpdate();
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); 
			throw e;
		}
		finally 
		{
			if (ps != null) {
				ps.close();
			}
			if (connection != null) {
				connection.close();
			}
		}
	}		
//==========================================================	
//END :: Update pin for a user
//==========================================================
	
	
	
//==========================================================	
// Add New Booking	
//==========================================================
		public static void PostFeeds(String employee, String date, String timeslot) throws Exception 
		{
			Connection connection = null;
			PreparedStatement ps = null;
			try 
			{
				Database database = new Database();
				connection = database.Get_Connection();
				String query = "INSERT INTO bikehire.booking (booking.emailAddress, booking.date, booking.timeslot, booking.bikeNumber) "
						+ "SELECT ?, ?, ?,  "
						+ "AssignBikeNum((SELECT COUNT(*) FROM bikehire.booking WHERE date=? AND timeslot=?), "
						+ "(SELECT MAX(bikeNumber) FROM  booking WHERE booking.date = ? AND timeslot = ?))";
				
				ps = connection.prepareStatement(query);
				ps.setString(1, employee);
				ps.setString(2, date);
				ps.setString(3, timeslot);
				ps.setString(4, date);
				ps.setString(5, timeslot);
				ps.setString(6, date);
				ps.setString(7, timeslot);
				ps.executeUpdate();
			}
			catch (Exception e)
			{
				System.out.println("Exception: " + e.getMessage()); 
				throw e;
			}
			finally 
			{
				if (ps != null) {
					ps.close();
				}
				if (connection != null) {
					connection.close();
				}
			}
		}
//==========================================================	
// END :: Add New Booking	
//==========================================================
	
		
//==========================================================	
// Verify Employee Account	
//==========================================================
		public static void UpdateVerified(String employee) throws Exception 
		{
			Connection connection = null;
			PreparedStatement ps = null;
			try 
			{
				Database database = new Database();
				connection = database.Get_Connection();
				String query = "UPDATE employee SET accountverified=1 WHERE emailAddress= ?; ";
				ps = connection.prepareStatement(query);
				ps.setString(1, employee);
				ps.executeUpdate();
			}
			catch (Exception e)
			{
				System.out.println("Exception: " + e.getMessage()); 
				throw e;
			}
			finally 
			{
				if (ps != null) {
					ps.close();
				}
				if (connection != null) {
					connection.close();
				}
			}
		}
//==========================================================	
// END :: Verify Employee Account	
//==========================================================
		
		
		
//==========================================================	
// Delete a Booking	
//==========================================================
public static void DeleteBooking(String employee, String date, String timeslot) throws Exception 
{
	Connection connection = null;
	PreparedStatement ps = null;
	try 
	{
		Database database = new Database();
		connection = database.Get_Connection();
		String query = "DELETE FROM bikehire.booking WHERE emailAddress=? AND date=? AND timeslot=?;";
		ps = connection.prepareStatement(query);
		ps.setString(1, employee);
		ps.setString(2, date);
		ps.setString(3, timeslot);
		ps.executeUpdate();
	}
	catch (Exception e)
	{
		System.out.println("Exception: " + e.getMessage()); 
		throw e;
	}
	finally 
	{
		if (ps != null) {
			ps.close();
		}
		if (connection != null) {
			connection.close();
		}
	}
}
//==========================================================	
// END :: Delete a Booking	
//==========================================================



//==========================================================	
//Delete a User Account	
//==========================================================
public static void DeleteAccount(String employee, String pin) throws Exception 
{
	Connection connection = null;
	PreparedStatement ps = null;
	try 
	{
		Database database = new Database();
		connection = database.Get_Connection();
		String query = "DELETE FROM bikehire.employee WHERE emailAddress= ? AND pin= ?;";
		ps = connection.prepareStatement(query);
		ps.setString(1, employee);
		ps.setString(2, pin);
		ps.executeUpdate();
	}
	catch (Exception e)
	{
		System.out.println("Exception: " + e.getMessage()); 
		throw e;
	}
	finally 
	{
		if (ps != null) {
			ps.close();
		}
		if (connection != null) {
			connection.close();
		}
	}
}
//==========================================================	
//END :: Delete a User Account	
//==========================================================
}
