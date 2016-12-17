package com.vogella.jersey.todo.resources;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces; 
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import com.google.gson.Gson;
import com.vogella.jersey.todo.model.ProjectManager;

import dto.BookingObject;
import dto.UserBookingObject;
import dto.UserLoginObject;

// Will map the resource to the URL todos
@Path("/todos")
public class TodosResource {

        // Allows to insert contextual objects into the class,
        // e.g. ServletContext, Request, Response, UriInfo
        @Context
        UriInfo uriInfo;
        @Context
        Request request;
        
//======================================================================
// Retrieve Existing Bookings        
//======================================================================
        @GET
        @Path("/data")
        @Produces("application/json")
        public Response feed()
        {
        String feeds = null;
        	try
        	{
        		ArrayList<BookingObject> feedData = null; 
        		ProjectManager projectManager= new ProjectManager();
        		feedData = projectManager.GetFeeds();
        		Gson gson = new Gson();
        		System.out.println(gson.toJson(feedData));
        		feeds = gson.toJson(feedData);
        	}
        	catch (Exception e)
        	{
        		System.out.println("Exception Error"); //Console 
        	}
        return Response.ok().entity(feeds)
        		.header("Access-Control-Allow-Origin", "*")
        		.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS, HEAD")
        		.build();
        } 
//======================================================================
// END :: Retrieve Existing Bookings        
//======================================================================
        

        
//======================================================================
// Retrieve Current User Bookings        
//======================================================================
             @GET
             @Path("/userbookings/{employeeID}")
             @Produces("application/json")
             @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
             public Response userFeed(@PathParam("employeeID") String employeeID) throws IOException 
             {
             String feeds = null;
             	try
             	{
             		System.out.println(employeeID);
             		ArrayList<UserBookingObject> feedData = null; 
             		ProjectManager projectManager= new ProjectManager();
             		feedData = projectManager.GetUserBookings(employeeID);
             		Gson gson = new Gson();
             		System.out.println(gson.toJson(feedData));
             		feeds = gson.toJson(feedData);
             	}
             	catch (Exception e)
             	{
             		System.out.println("Exception Error"); //Console 
             	}
             return Response.ok().entity(feeds)
             		.header("Access-Control-Allow-Origin", "*")
             		.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS, HEAD")
             		.build();
             } 
//======================================================================
// END :: Retrieve Current User Bookings        
//======================================================================
        
        
//======================================================================
// Retrieve Login Data For a User        
//======================================================================
@GET
@Path("/userlogin/{employeeID}/{pin}")
@Produces("application/json")
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
public Response userLoginFeed(@PathParam("employeeID") String employeeID, @PathParam("pin") String pin) throws IOException 
{
	String feeds = null;
	try
	{
		System.out.println("HERE> "+pin);
		ArrayList<UserLoginObject> feedData = null; 
		ProjectManager projectManager= new ProjectManager();
		feedData = projectManager.GetUserLogin(employeeID, pin);
		Gson gson = new Gson();
		feeds = gson.toJson(feedData);
	}
	catch (Exception e)
	{
		System.out.println("Exception Error");  
	}
return Response.ok().entity(feeds)
		.header("Access-Control-Allow-Origin", "*")
		.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS, HEAD")
		.build();
} 
//======================================================================
// END :: Retrieve Login Data For a User        
//======================================================================     
   


//======================================================================
//Create a New User    
//======================================================================      
     @POST
     @Path("/createuser")
     @Produces(MediaType.TEXT_HTML)
     @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
     public void createUser(@FormParam("employeeID") String employeeID,
                     @FormParam("pin") String pin,
                     @Context HttpServletResponse servletResponse) throws IOException {
     	try{
     		System.out.println("Create New User: "+employeeID+"  "+pin);
             ArrayList<UserLoginObject> feedData = null; 
     		ProjectManager projectManager= new ProjectManager();
     		feedData = projectManager.CreateUser(employeeID, pin);
             //servletResponse.sendRedirect("../create_todo.html");
     	} catch(Exception e) {
     		System.out.println("Exception: " + e.getMessage());
     	}
     }
//======================================================================
//END :: Create a New User        
//======================================================================





        
//======================================================================
// Add a New Booking      
//======================================================================      
        @POST
        @Produces(MediaType.TEXT_HTML)
        @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
        public void postBooking(@FormParam("employeeID") String employeeID,
                        @FormParam("date") String date,
                        @FormParam("timeslot") String timeslot,
                        @Context HttpServletResponse servletResponse) throws IOException {
        	try{
        		System.out.println("POST " + employeeID +" "+ date +" "+ timeslot);
                ArrayList<BookingObject> feedData = null; 
        		ProjectManager projectManager= new ProjectManager();
        		feedData = projectManager.PostFeeds(employeeID, date, timeslot);
                servletResponse.sendRedirect("../create_todo.html");
        	} catch(Exception e) {
        		System.out.println("Exception: " + e.getMessage());
        	}
        }
//======================================================================
// END :: Add a New Booking      
//======================================================================
        

//======================================================================
// Delete a Booking      
//======================================================================      
             @DELETE
             @Path("/delete/{employeeID}/{date}/{timeslot}")
             @Produces(MediaType.TEXT_HTML)
             @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
             public void deleteBooking(@PathParam("employeeID") String employeeID,
            		 @PathParam("date") String date,
            		 @PathParam("timeslot") String timeslot,
                     @Context HttpServletResponse servletResponse) throws IOException {
             	try{
             		System.out.println("DELETE " + employeeID +" "+ date +" "+ timeslot);
                     ArrayList<BookingObject> feedData = null; 
             		ProjectManager projectManager= new ProjectManager();
             		feedData = projectManager.DeleteBooking(employeeID, date, timeslot);
                    // servletResponse.sendRedirect("../../../create_todo.html");
             	} catch(Exception e) {
             		System.out.println("Exception: " + e.getMessage());
             	}
             }
//======================================================================
// END :: Delete a Booking      
//======================================================================
        
        
        

}