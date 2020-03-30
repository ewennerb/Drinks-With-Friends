package server.SQL;

import java.sql.*;
import java.util.ArrayList;
import server.User.User;
import server.Drink.Drink;

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

	public ArrayList<User> getAllUsers(){
		try{
			rs = smt.executeQuery("select * from test_schema.user");
			String all = "User Info:<br>";
			ArrayList<User> user = new ArrayList<User>();


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
				User u = new User();
				user.add(u);
			
				all+=userId+"\t"+userName+"\t"+password+"\t"+fullName+"\t"+email+"\t"+phoneNum+"\t"+profilePhoto+"\t"+bio+"\t"+likedDrinks+"\t"+dislikedDrinks+"\t"+favoriteDrink+"\t"+publishedDrinks+"\t"+postHistory+"\t"+friendsList+"\t"+dateCreated+"\t"+lastLogin;
				all+="<br>";
			}
			conn.close();
			System.out.println(all);
			return user;

		}catch(Exception e){
			e.printStackTrace();
			return null;//"/user Fail";
		}
	}


	public User getUser(String name){
		try{
	
			String query = "select * from test_schema.user where userName = \""+name+"\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
			//String returnUser = "User: "+name+"<br>";
			User u = new User();

			while (rs.next())
			{
				u.userId=rs.getInt("userId");
				u.userName=rs.getString("userName");
				u.password = rs.getString("password");
				u.name = rs.getString("name");
				u.email = rs.getString("email");
				u.phoneNumber = rs.getString("phoneNumber");
				u.photo = rs.getString("profilePhoto");
				u.bio=rs.getString("bio");
				u.likedDrinks = rs.getString("likedDrinks");
				u.dislikedDrinks = rs.getString("dislikedDrinks");
				u.favoriteDrink = rs.getString("favoriteDrink");
				u.publishedDrinks = rs.getString("publishedDrinks");
				u.postHistory = rs.getString("postHistory");
				u.friendsList = rs.getString("friendsList");
				u.dateCreated = rs.getString("dateCreated");
				u.lastLogin = rs.getString("lastLogin");

			
				//returnUser+=userId+"\t"+userName+"\t"+password+"\t"+fullName+"\t"+email+"\t"+phoneNum+"\t"+profilePhoto+"\t"+bio+"\t"+likedDrinks+"\t"+dislikedDrinks+"\t"+favoriteDrink+"\t"+publishedDrinks+"\t"+postHistory+"\t"+friendsList+"\t"+dateCreated+"\t"+lastLogin;
				//returnUser+="<br>";
			}

			conn.close();
			//System.out.println(returnUser);
			return u;


		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public User[] searchUsers(String request){
		StringBuilder searchString = new StringBuilder("%" + request + "%");
		for (int i = 0; i < request.length(); i++) {
			if (searchString.charAt(i) == ' ') {
				searchString.setCharAt(i, '%');
			}
		}
		System.out.println(searchString);
		try{
			String query = "Select * FROM test_schema.user WHERE userName LIKE \"" + searchString + "\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
			ArrayList<User> user = new ArrayList<User>();
			String all = "User Info:<br>";
			while (rs.next())
			{
				int userId=rs.getInt("userId");
				String userName=rs.getString("userName");
				String password = rs.getString("password");
				String fullName = rs.getString("name");
				String email = rs.getString("email");
				String phoneNum = rs.getString("phoneNumber");
				String photo=rs.getString("profilePhoto");
				String bio=rs.getString("bio");
				String likedDrinks = rs.getString("likedDrinks");
				String dislikedDrinks = rs.getString("dislikedDrinks");
				String favoriteDrink = rs.getString("favoriteDrink");
				String publishedDrinks = rs.getString("publishedDrinks");
				String postHistory = rs.getString("postHistory");
				String friendsList = rs.getString("friendsList");
				String dateCreated = rs.getString("dateCreated");
				String lastLogin = rs.getString("lastLogin");
				int darkMode=0;
				User u = new User(userId, userName, password, fullName, email, phoneNum, photo,bio,likedDrinks, dislikedDrinks, favoriteDrink, publishedDrinks, postHistory, friendsList, dateCreated, lastLogin,darkMode);
				user.add(u);
				//all+=userId+"\t"+userName+"\t"+password+"\t"+fullName+"\t"+email+"\t"+phoneNum+"\t"+photo+"\t"+bio+"\t"+likedDrinks+"\t"+dislikedDrinks+"\t"+favoriteDrink+"\t"+publishedDrinks+"\t"+postHistory+"\t"+friendsList+"\t"+dateCreated+"\t"+lastLogin;
				//all+="<br>";
			}
			conn.close();
			//System.out.print(all);
			//System.out.print("INSQL "+user.get(0).userName);

			User[] outUser = new User[user.size()];
			outUser = user.toArray(outUser);
			return outUser;

		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public boolean checkUniqueUserName(String userName){
		try{
			String query = "select userName from test_schema.user where userName = \""+userName+"\"";
			rs=smt.executeQuery(query);

			String dbName = " ";
			while (rs.next()) {
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

	//userName doesUserEmailExists or null
	public String doesUserEmailExist(String email){
		try{
			String query = "select userName from test_schema.user where email = \""+email+"\"";
			rs=smt.executeQuery(query);

			String dbEmail = "";
			while (rs.next()) {
				dbEmail = rs.getString("userName"); 
			}
			System.out.println("dbEmail "+dbEmail);
			return dbEmail;
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error getting userName from email");
			return null;
		}
	}


	public String insertUser(String userName, String password, String name, String email, String phoneNumber){
		try{
			//first need to checkUniqueUserName
			if (!checkUniqueUserName(userName)) {
				System.out.println("Username not unqiue. Cannot insert new user.");
				return "{ \"status\" : \"Error: user already exists.\"}";
			}
			//if unique then can insert User
			String query = "insert into test_schema.user "+ 
				"(userName, password, name, email, phoneNumber) "+
				"values "+ 
				"(\""+userName+"\", \""+password+"\", \""+name+"\", \""+email+"\", \""+phoneNumber+"\")";
			System.out.println(query);

			int insertResult = smt.executeUpdate(query);

			return "{ \"status\" : \"ok\" }";
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error inserting new user to DB.");
			return "{ \"status\" : \"Error: SQL insert failed.\"}";
		}


	}

	//remove oldPass function
	public String updatePassword(String userName, String newPass){
		try{

			String query = "update test_schema.user set password = \""+newPass+"\""+" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);
			if(updateResult == 1){
				//System.out.print("********* ITS !");
				return "{ \"status\" : \"ok\" }";
			}else if (updateResult == 0) {
				//System.out.print("****** IS 0");
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}
			
			return "{ \"status\" : \"Error: SQL update failed.\" }";
			
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Failed updating password.");
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}


	public String updateUsername(String userName, String newUsername){
		try{

			String query = "update test_schema.user set username = \""+newUsername+"\""+" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);
			if(updateResult == 1){
				//System.out.print("********* ITS !");
				return "{ \"status\" : \"ok\" }";
			}else if (updateResult == 0) {
				//System.out.print("****** IS 0");
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}
			
			return "{ \"status\" : \"Error: SQL update failed.\" }";
			
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Failed updating password.");
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}


	public String insertProfilePhoto(String userName, String profilePhotoPath){
		try{
		
			String query = "update test_schema.user set profilePhoto = \""+profilePhotoPath+"\" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);

			if(updateResult == 1){
				return "{ \"status\" : \"ok\" }";
			} else if (updateResult == 0) {
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}
			
			return "{ \"status\" : \"Error: SQL update failed.\" }";

		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}

	public String updateBio(String userName, String bio){
		try{
			String query = "update test_schema.user set bio = \""+bio+"\" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);

			if (updateResult == 1) {
				return "{ \"status\" : \"ok\" }";
			} else if(updateResult == 0) {
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}

			return "{ \"status\" : \"Error: SQL update failed.\" }";

		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}

	public String updateFavoriteDrink(String userName, String favDrink){
		try{
			String query = "update test_schema.user set favoriteDrink = \""+favDrink+"\" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);

			if ( updateResult == 1 ) {
				return "{ \"status\" : \"ok\" }";
			} else if(updateResult == 0) {
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}

			return "{ \"status\" : \"Error: SQL update failed.\" }";

		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}

	public String likeDrink(String userName, int drinkId, String toggle){
		try{
			String query = "";
			String backupQuery = "";

			DrinkSQL test = new DrinkSQL();

			//Likes a drink & Un-Likes a Drink
			if (toggle.equals("on")) { //liking drink
				query = "replace into test_schema.drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '1', '0')";
				backupQuery = "update test_schema.drink_likes set likes = 1, dislikes = 0 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";

			} else { //disliking drink
				query = "replace into test_schema.drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '0', '0')";
				backupQuery = "update test_schema.drink_likes set likes = 0, dislikes = 0 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";
			}
			System.out.print(query);

			int updateResult = smt.executeUpdate(query);

			if ( updateResult == 1 ) {
				return "{ \"status\" : \"ok\" }";
			} else if(updateResult == 0) {
				updateResult = smt.executeUpdate(backupQuery);
				if (updateResult == 1){
					return "{ \"status\" : \"ok\" }";
				}
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}

//			return "{ \"status\" : \"Error: SQL update failed.\" }";
		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
		return("End of likeDrink in UserSQL.java");
	}

	public String dislikeDrink(String userName, int drinkId, String toggle){
		try{
			String query = "";
			String backupQuery = "";

			DrinkSQL test = new DrinkSQL();

			//DISLIKES AND UN-DISLIKES A DRINK
			if (toggle.equals("on")) { //liking drink
				query = "replace into test_schema.drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '0', '1')";
				backupQuery = "update test_schema.drink_likes set likes = 0, dislikes = 1 where userName = \""+userName+"\" and drinkId = \""+drinkId+"\"";
			} else { //disliking drink
				query = "replace into test_schema.drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '0', '0')";
				backupQuery = "update test_schema.drink_likes set likes = 0, dislikes = 0 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";
			}
			System.out.print("QUERY"+query);

			int updateResult = smt.executeUpdate(query);

			if ( updateResult == 1 ) {
				return "{ \"status\" : \"ok\" }";
			} else if(updateResult == 0) {
				updateResult = smt.executeUpdate(backupQuery);
				if (updateResult == 1){
					return "{ \"status\" : \"ok\" }";
				}
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}

//			return "{ \"status\" : \"Error: SQL update failed.\" }";
		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}

		return("End of dislikeDrink in UserSQL.java");
	}


	public String getLikeStatus(String userName, int drinkId){
		String query = "";
		query = "select * from test_schema.drink_likes where username='" + userName + "' AND drink_id='" + drinkId + "'";
		System.out.print(query);

		DrinkSQL test = new DrinkSQL();
		boolean userLikes = false;
		boolean userDislikes = false;

		try{
			rs = smt.executeQuery(query);
			int l = -1;
			int d = -1;

			while(rs.next()) {
				l = rs.getInt("likes");
				d = rs.getInt("dislikes");
				if (l == 1 && d == 0){
					System.out.print("UserSQL.java:getLikeStatus() - User " + userName + " Likes drink_id=" + drinkId);
					userLikes = true;
					userDislikes = false;
				}else if (l == 0 && d == 1){
					System.out.print("UserSQL.java:getLikeStatus() - User " + userName + " Dislikes drink_id=" + drinkId);
					userLikes = false;
					userDislikes = true;
				}
			}
			return "{\"isLiked\": " + userLikes + ", \"isDisliked\": " + userDislikes + "}";
		}catch(Exception e){
			System.out.print("Didn't exist in DB, so the user hasn't liked it.");
			//Doesn't exist in DB and therefore hasn't been liked or disliked yet
			return "{\"isLiked\": " + userLikes + ", \"isDisliked\": " + userDislikes + "}";
		}

	}
}