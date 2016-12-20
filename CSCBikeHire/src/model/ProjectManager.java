package model;

import java.sql.Connection;
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
	public ArrayList<UserLoginObject> CreateUser(String employee, String pin, String hash) throws Exception 
	{
		ArrayList<UserLoginObject> feeds = null;
		try 
		{
			Database database = new Database();
			Connection connection = database.Get_Connection();
			java.sql.Statement stmt = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
			connection.setAutoCommit(false);    
			String insertEmp1 = "INSERT INTO `bikehire`.`employee` (`emailAddress`, `pin`, `accountVerified`, `hash`) VALUES ('"+employee+"', '"+pin+"', '0', '"+hash+"');";
			connection.setAutoCommit(false);
			stmt.addBatch(insertEmp1);
			stmt.executeBatch();
			connection.commit();
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage()); 
			throw e;
		}
		return feeds;
	}		
//==========================================================	
//END :: Create a New user
//==========================================================

		
//==========================================================	
// Add New Booking	
//==========================================================
		public ArrayList<BookingObject> PostFeeds(String employee, String date, String timeslot) throws Exception 
		{
			ArrayList<BookingObject> feeds = null;
			try 
			{
				Database database = new Database();
				Connection connection = database.Get_Connection();
				java.sql.Statement stmt = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
				
				
				String insertEmp1 = "INSERT INTO bikehire.booking (booking.emailAddress, booking.date, booking.timeslot, booking.bikeNumber) "
						+ "SELECT '"+employee+"', '"+date+"', '"+timeslot+"',  "
						+ "IF((SELECT MAX(bikeNumber) FROM  booking WHERE date = '"+date+"' AND timeslot = '"+timeslot+"')>0, MAX(bikeNumber)+1, '1') "
						+ "FROM  booking "
						+ "WHERE booking.date = '"+date+"' AND timeslot = '"+timeslot+"';";
				
				connection.setAutoCommit(false);
				stmt.addBatch(insertEmp1);
				stmt.executeBatch();
				connection.commit();
			}
			catch (Exception e)
			{
				System.out.println("Exception: " + e.getMessage()); 
				throw e;
			}
			return feeds;
		}
//==========================================================	
// END :: Add New Booking	
//==========================================================
	
		
//==========================================================	
// Verify Employee Account	
//==========================================================
		public ArrayList<UserLoginObject> UpdateVerified(String employee) throws Exception 
		{
			ArrayList<UserLoginObject> feeds = null;
			try 
			{
				Database database = new Database();
				Connection connection = database.Get_Connection();
				java.sql.Statement stmt = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
				connection.setAutoCommit(false);    
				String insertEmp1 = "UPDATE employee SET accountverified=1 WHERE emailAddress='"+employee+"'; ";
				connection.setAutoCommit(false);
				stmt.addBatch(insertEmp1);
				stmt.executeBatch();
				connection.commit();
			}
			catch (Exception e)
			{
				System.out.println("Exception: " + e.getMessage()); 
				throw e;
			}
			return feeds;
		}
//==========================================================	
// END :: Verify Employee Account	
//==========================================================
		
		
		
//==========================================================	
// Delete a Booking	
//==========================================================
public ArrayList<BookingObject> DeleteBooking(String employee, String date, String timeslot) throws Exception 
{
	ArrayList<BookingObject> feeds = null;
	try 
	{
		Database database = new Database();
		Connection connection = database.Get_Connection();
		java.sql.Statement stmt = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
		connection.setAutoCommit(false);    
		String deleteStatement = "DELETE FROM bikehire.booking WHERE emailAddress='"+employee+"' AND date='"+date+"' AND timeslot='"+timeslot+"';";
		System.out.println("Delete: " + deleteStatement);
		connection.setAutoCommit(false);
		stmt.addBatch(deleteStatement);
		stmt.executeBatch();
		connection.commit();
	}
	catch (Exception e)
	{
		System.out.println("Exception: " + e.getMessage()); 
		throw e;
	}
	return feeds;
}
//==========================================================	
// END :: Delete a Booking	
//==========================================================



//==========================================================	
//Delete a User Account	
//==========================================================
public ArrayList<UserLoginObject> DeleteAccount(String employee, String pin) throws Exception 
{
	ArrayList<UserLoginObject> feeds = null;
	try 
	{
		Database database = new Database();
		Connection connection = database.Get_Connection();
		java.sql.Statement stmt = connection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
		connection.setAutoCommit(false);    
		String deleteStatement = "DELETE FROM bikehire.employee WHERE emailAddress='"+employee+"' AND pin='"+pin+"';";
		connection.setAutoCommit(false);
		stmt.addBatch(deleteStatement);
		stmt.executeBatch();
		connection.commit();
	}
	catch (Exception e)
	{
		System.out.println("Exception: " + e.getMessage()); 
		throw e;
	}
	return feeds;
}
//==========================================================	
//END :: Delete a User Account	
//==========================================================




	
}
