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

			String dbName = " ";
			while(rs.next()){
				dbName= rs.getString("userName");
			}
			if (userName.equals(dbName)){
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

	public boolean insertUser(String userName, String password, String name, String email, String phoneNumber){
		try{
			//first need to checkUniqueUserName
			if (!checkUniqueUserName(userName)) {
				System.out.println("Username not unqiue. Cannot insert new user.");
				return false;
			}
			//if unique then can insert User
			String query = "insert into test_schema.user "+ 
				"(userName, password, name, email, phoneNumber) "+
				"values "+ 
				"(\""+userName+"\", \""+password+"\", \""+name+"\", \""+email+"\", \""+phoneNumber+"\")";
			System.out.println(query);

			int insertResult = smt.executeUpdate(query);

			return true;
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error inserting new user to DB.");
			return false;
		}


	}


	public boolean updatePassword(String userName, String oldPass, String newPass){
		try{
			//first check oldPass is what is in DB
			String query = "select * from test_schema.user where userName = \""+userName+"\"";
			rs = smt.executeQuery(query);

			String p = " ";

			while (rs.next()){
				System.out.println("output: "+rs.getString("userName"));
				p = rs.getString("password");
			}


			//then check if queried password is equal to inputted old password
			System.out.println("OldPass: \""+oldPass+"\", Queried Pass: \""+p+"\"");
			if (!p.equals(oldPass)){
				System.out.println("Old password not correct.");
				return false;
			}
			
			//if it is, then update with new password
			query = "update test_schema.user set password = \""+newPass+"\""+" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);
			
			
			return true;
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Failed updating password.");
			return false;
		}
	}

}