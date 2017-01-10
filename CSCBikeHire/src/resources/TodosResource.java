package resources;

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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import com.google.gson.Gson;

import dto.BookingObject;
import dto.UserBookingObject;
import dto.UserLoginObject;
import model.ProjectManager;

import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

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
        		feedData = projectManager.GetAllBookings();
        		Gson gson = new Gson();
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
             		ArrayList<UserBookingObject> feedData = null; 
             		ProjectManager projectManager= new ProjectManager();
             		feedData = projectManager.GetUserBookings(employeeID);
             		Gson gson = new Gson();
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
//Retrieve Verification Hash For a User        
//======================================================================
@GET
@Path("/userverify/{employeeID}/{hash}")
@Produces("application/json")
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
public Response userHashFeed(@PathParam("employeeID") String employeeID,
		@PathParam("hash") String hash) throws IOException 
{
	String feeds = null;
	try
	{
		ArrayList<UserLoginObject> feedData = null; 
		ProjectManager projectManager= new ProjectManager();
		feedData = projectManager.GetUserHash(employeeID, hash);
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
//END :: Retrieve Verification Hash For a User         
//======================================================================    

   


//======================================================================
// Check if a DB record already exists for a user        
//======================================================================
@GET
@Path("/finduser/{employeeID}")
@Produces("application/json")
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
public Response userExistsFeed(@PathParam("employeeID") String employeeID) throws IOException 
{
	String feeds = null;
	try
	{
		ArrayList<UserLoginObject> feedData = null; 
		ProjectManager projectManager= new ProjectManager();
		feedData = projectManager.GetUserExists(employeeID);
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
//END :: Check if a DB record already exists for a user       
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
                     @FormParam("hash") String hash,
                     @Context HttpServletResponse servletResponse) throws IOException {
     	try
     	{
     		sendVerificationEmail(employeeID, hash);
     		ProjectManager.CreateUser(employeeID, pin, hash);
     	} 
     	catch(Exception e) {
     		System.out.println("Exception: " + e.getMessage());
     	}
     }
//======================================================================
//END :: Create a New User        
//======================================================================

static Properties mailServerProperties;
static Session getMailSession;
static MimeMessage generateMailMessage;
     
public static void sendVerificationEmail(String employeeID, String hash) throws AddressException, MessagingException
{
	//String verifyLink = "http://localhost:8080/CSCBikeHire/verifyaccount.html?employeeID="+employeeID+"&hash="+hash;
	//generateAndSendEmail();
}

public static void generateAndSendEmail() throws AddressException, MessagingException {
	 
	// Step1
	System.out.println("\n 1st ===> setup Mail Server Properties..");
	mailServerProperties = System.getProperties();
	mailServerProperties.put("mail.smtp.port", "587");
	mailServerProperties.put("mail.smtp.auth", "true");
	mailServerProperties.put("mail.smtp.starttls.enable", "true");
	System.out.println("Mail Server Properties have been setup successfully..");

	// Step2
	System.out.println("\n\n 2nd ===> get Mail Session..");
	getMailSession = Session.getDefaultInstance(mailServerProperties, null);
	generateMailMessage = new MimeMessage(getMailSession);
	generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress("mitchelltempleton94@gmail.com"));
	generateMailMessage.setSubject("Greetings from Crunchify..");
	String emailBody = "Test email by Crunchify.com JavaMail API example. " + "<br><br> Regards, <br>Crunchify Admin";
	generateMailMessage.setContent(emailBody, "text/html");
	System.out.println("Mail Session has been created successfully..");

	// Step3
	System.out.println("\n\n 3rd ===> Get Session and Send mail");
	Transport transport = getMailSession.getTransport("smtp");

	// Enter your correct gmail UserID and Password
	// if you have 2FA enabled then provide App Specific Password
	transport.connect("smtp.gmail.com", "un", "pw");
	transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
	transport.close();
}



//======================================================================
// Update Hash for a user    
//======================================================================      
   @POST
   @Path("/updatehash")
   @Produces(MediaType.TEXT_HTML)
   @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
   public void updateHash(@FormParam("employeeID") String employeeID,
                   @FormParam("hash") String hash,
                   @Context HttpServletResponse servletResponse) throws IOException {
   	try{
   		//Send Verification Email to the user
   		sendVerificationEmail(employeeID, hash);
   		ProjectManager.UpdateHash(employeeID, hash);
   	} catch(Exception e) {
   		System.out.println("Exception: " + e.getMessage());
   	}
   }
//======================================================================
//END :: Update Hash for a user        
//======================================================================


   
   
//======================================================================
// Update Pin for a user    
//======================================================================      
   @POST
   @Path("/updatepin")
   @Produces(MediaType.TEXT_HTML)
   @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
   public void updatepin(@FormParam("employeeID") String employeeID,
                   @FormParam("pin") String pin,
                   @Context HttpServletResponse servletResponse) throws IOException {
   	try{
   		ProjectManager.UpdatePin(employeeID, pin);
   	} catch(Exception e) {
   		System.out.println("Exception: " + e.getMessage());
   	}
   }
//======================================================================
//END :: Update Pin for a user        
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
        		ProjectManager.PostFeeds(employeeID, date, timeslot);
        	} catch(Exception e) {
        		System.out.println("Exception: " + e.getMessage());
        	}
        }
//======================================================================
// END :: Add a New Booking      
//======================================================================
       

//======================================================================
// Update Account verified Field for User      
//======================================================================     
        @POST
        @Path("/updateverified")
        @Produces(MediaType.TEXT_HTML)
        @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
        public void updateVerified(@FormParam("employeeID") String employeeID,
             @Context HttpServletResponse servletResponse) throws IOException {
        	try{
        		ProjectManager.UpdateVerified(employeeID);
        	} catch(Exception e) {
        		System.out.println("Exception: " + e.getMessage());
        	}
        }      
//======================================================================
// END :: Update Account verified Field for User      
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
             		ProjectManager.DeleteBooking(employeeID, date, timeslot);
             	} catch(Exception e) {
             		System.out.println("Exception: " + e.getMessage());
             	}
             }
//======================================================================
// END :: Delete a Booking      
//======================================================================
             
             
//======================================================================
// Delete a User      
//======================================================================      
@DELETE
@Path("/deleteuser/{employeeID}/{pin}")
@Produces(MediaType.TEXT_HTML)
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
public void deleteAccount(@PathParam("employeeID") String employeeID,
		@PathParam("pin") String pin,
        @Context HttpServletResponse servletResponse) throws IOException 
		{
	       	try
	       	{
	            ProjectManager.DeleteAccount(employeeID, pin);
	       	} 
	       	catch(Exception e) 
	       	{
	       		System.out.println("Exception: " + e.getMessage());
	        }
		}
//======================================================================
// END :: Delete a User       
//======================================================================          
             
             
             
        
        
        

}