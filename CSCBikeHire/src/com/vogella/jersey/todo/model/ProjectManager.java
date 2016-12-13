package com.vogella.jersey.todo.model;

import java.sql.Connection;
import java.util.ArrayList;

import com.mysql.jdbc.ResultSet;

import dao.Database;
import dao.Project;
import dto.BookingObject;
import dto.UserBookingObject;

public class ProjectManager {

//==========================================================	
// GET	
//==========================================================
	public ArrayList<BookingObject> GetFeeds() throws Exception 
	{
		ArrayList<BookingObject> feeds = null;
		try 
		{
			Database database = new Database();
			Connection connection = database.Get_Connection();
			Project project = new Project();
			feeds = project.GetFeeds(connection);
		}
		catch (Exception e)
		{
			System.out.println("Exception Error 3"); //Console 
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
				System.out.println("Exception Error 3"); //Console 
				throw e;
			}
			return feeds;
		}
//==========================================================	
// END :: Get Current User Bookings	
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
				connection.setAutoCommit(false);    
				String insertEmp1 = "INSERT INTO bikehire.booking (booking.emailAddress, booking.date, booking.timeslot) VALUES ('"+employee+"', '"+date+"', '"+timeslot+"'); ";
				System.out.println("Insert: " + insertEmp1);
				connection.setAutoCommit(false);
				stmt.addBatch(insertEmp1);
				stmt.executeBatch();
				connection.commit();
			}
			catch (Exception e)
			{
				System.out.println("Exception Error Post"); //Console 
				throw e;
			}
			return feeds;
		}
//==========================================================	
// END :: Add New Booking	
//==========================================================
	
	
}
