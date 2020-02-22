package server.SQL;
import java.sql.*;


public class UserSQL {

	private String url;
	private Connection conn;
	Statement smt;
	ResultSet rs;

	public UserSQL(){
		url = "jdbc:mysql://localhost:3306/";

		try{
		conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
		smt = conn.createStatement();
		}catch(Exception e){
			e.printStackTrace();
		}

	}

	public String getAllUsers(){
		try{
			rs = smt.executeQuery("select * from test_schema.user");
			String all = "User Info:<br>";

			while (rs.next())
			{
				int userId=rs.getInt("userId");
				String userName=rs.getString("userName");
				String password = rs.getString("password");
				String fullName = rs.getString("name");
				String email = rs.getString("email");
				String phoneNum = rs.getString("phoneNumber");
				String profilePhoto=rs.getString("profilePhoto");
				String bio=rs.getString("bio");
				String likedDrinks = rs.getString("likedDrinks");
				String dislikedDrinks = rs.getString("dislikedDrinks");
				String favoriteDrink = rs.getString("favoriteDrink");
				String publishedDrinks = rs.getString("publishedDrinks");
				String postHistory = rs.getString("postHistory");
				String friendsList = rs.getString("friendsList");
				String dateCreated = rs.getString("dateCreated");
				String lastLogin = rs.getString("lastLogin");

			
				all+=userId+"\t"+userName+"\t"+password+"\t"+fullName+"\t"+email+"\t"+phoneNum+"\t"+profilePhoto+"\t"+bio+"\t"+likedDrinks+"\t"+dislikedDrinks+"\t"+favoriteDrink+"\t"+publishedDrinks+"\t"+postHistory+"\t"+friendsList+"\t"+dateCreated+"\t"+lastLogin;
				all+="<br>";
			}
			conn.close();
			System.out.println(all);
			return all;

		}catch(Exception e){
			e.printStackTrace();
			return "/user Fail";
		}
	}


	public String getUser(String name){
		try{
	
			String query = "select * from test_schema.user where userName = \""+name+"\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
			String returnUser = "User: "+name+"<br>";

			while (rs.next())
			{
				int userId=rs.getInt("userId");
				String userName=rs.getString("userName");
				String password = rs.getString("password");
				String fullName = rs.getString("name");
				String email = rs.getString("email");
				String phoneNum = rs.getString("phoneNumber");
				String profilePhoto=rs.getString("profilePhoto");
				String bio=rs.getString("bio");
				String likedDrinks = rs.getString("likedDrinks");
				String dislikedDrinks = rs.getString("dislikedDrinks");
				String favoriteDrink = rs.getString("favoriteDrink");
				String publishedDrinks = rs.getString("publishedDrinks");
				String postHistory = rs.getString("postHistory");
				String friendsList = rs.getString("friendsList");
				String dateCreated = rs.getString("dateCreated");
				String lastLogin = rs.getString("lastLogin");

			
				returnUser+=userId+"\t"+userName+"\t"+password+"\t"+fullName+"\t"+email+"\t"+phoneNum+"\t"+profilePhoto+"\t"+bio+"\t"+likedDrinks+"\t"+dislikedDrinks+"\t"+favoriteDrink+"\t"+publishedDrinks+"\t"+postHistory+"\t"+friendsList+"\t"+dateCreated+"\t"+lastLogin;
				returnUser+="<br>";
			}

			conn.close();
			System.out.println(returnUser);
			return returnUser;


		}catch(Exception e){
			e.printStackTrace();
			return "/user find Fail";
		}
	}

	public boolean checkUniqueUserName(String userName){
		try{
			String query = "select userName from test_schema.user where userName = \""+userName+"\"";
			rs=smt.executeQuery(query);

			String dbName = rs.getString("userName");
			if (userName == dbName){
				System.out.println("Username not unique.");
				return false;
			} else {
				System.out.println("Username is unique.");
				return true;
			}
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Failed query");
			return false;
		}
	}

}