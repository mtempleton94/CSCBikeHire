package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
	
	public Connection Get_Connection() throws Exception
	{
		try
		{
			String connectionURL = "jdbc:mysql://localhost:3306/bikehire";
			Connection connection = null;
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			connection = DriverManager.getConnection(connectionURL, "root", "P@ssw0rd");
			return connection;
		}
		catch (SQLException e)
		{
			System.out.println("Error: " + e.getMessage()); 
			throw e;
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage() + e.getMessage()); //Console 
			throw e;
		}
	}
}
