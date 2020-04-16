package server.SQL;

import java.sql.*;
import java.util.ArrayList;
import server.User.User;
import server.Drink.Drink;
import server.Post.Post;

public class UserSQL {

	private String url;
	private Connection conn;
	Statement smt;
	ResultSet rs;
	private String database;

	public UserSQL(){
		url = "jdbc:mysql://localhost:3306/";
		//url = "jdbc:mysql://b4e9xxkxnpu2v96i.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hiqietg4casioadz"; 	//production
		
		try{
			//conn = DriverManager.getConnection(url, "gzgsvv5r3zidpv57", "xf590wkdp1qeejrj"); //production
			conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");//development
		
			smt = conn.createStatement();
			
		}catch(Exception e){
			e.printStackTrace();
			
		}
		database = "test_schema";		//development
		//database = "hiqietg4casioadz";	//production


	}

	public ArrayList<User> getAllUsers(){
		try{
			rs = smt.executeQuery("select * from "+ this.database+".user");
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
			rs.close();
			smt.close();
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
	
			String query = "select * from "+ this.database+".user where userName = \""+name+"\"";
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
			rs.close();
			smt.close();
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
			String query = "Select * FROM "+ this.database+".user WHERE userName LIKE \"" + searchString + "\"";
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
			rs.close();
			smt.close();
			conn.close();
			//System.out.print(all);
			//System.out.print("INSQL "+user.get(0).userName);
			for (int x = 0; x < user.size(); x++){
				System.out.println("INSQL "+user.get(x).userName);

			}
			

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
			String query = "select userName from "+ this.database+".user where userName = \""+userName+"\"";
			rs=smt.executeQuery(query);

			String dbName = " ";
			while (rs.next()) {
				dbName= rs.getString("userName");
			}
			
			rs.close();
			if (userName.equals(dbName)){
				System.out.println("Username not unique.");
				return false;
			} else {
				System.out.println("Username is unique.");
				return true;
			}
		}catch(SQLException e){
			e.printStackTrace();
			System.out.println("Failed query");
			return false;
		}
	}

	//userName doesUserEmailExists or null
	public String doesUserEmailExist(String email){
		try{
			String query = "select userName from "+ this.database+".user where email = \""+email+"\"";
			rs=smt.executeQuery(query);

			String dbEmail = "";
			while (rs.next()) {
				dbEmail = rs.getString("userName"); 
			}
			System.out.println("dbEmail "+dbEmail);
			rs.close();
			smt.close();
			conn.close();
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
			String query = "insert into "+ this.database+".user "+ 
				"(userName, password, name, email, phoneNumber) "+
				"values "+ 
				"(\""+userName+"\", \""+password+"\", \""+name+"\", \""+email+"\", \""+phoneNumber+"\")";
			System.out.println(query);

			int insertResult = smt.executeUpdate(query);

			smt.close();
			conn.close();
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

			String query = "update "+ this.database+".user set password = \""+newPass+"\""+" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);
			if(updateResult == 1){
				//System.out.print("********* ITS !");
				return "{ \"status\" : \"ok\" }";
			}else if (updateResult == 0) {
				//System.out.print("****** IS 0");
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}
			smt.close();
			conn.close();
			
			return "{ \"status\" : \"Error: SQL update failed.\" }";
			
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Failed updating password.");
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}


	public String updateUsername(String userName, String newUsername){
		try{

			String query = "update "+ this.database+".user set username = \""+newUsername+"\""+" where userName = \""+userName+"\"";
			int updateResultUser = smt.executeUpdate(query);

			if (updateResultUser == 0) {
				//System.out.print("****** IS 0");
				return "{ \"status\" : \"Error: SQL user update failed.\"}";
			}

			String query1 = "update "+ this.database+".drink set publisher = \""+newUsername+"\""+" where publisher = \""+userName+"\"";
			int updateResultDrink = smt.executeUpdate(query1);

			if (updateResultDrink == 0) {
				//System.out.print("****** IS 0");
			//	return "{ \"status\" : \"Error: SQL drink update failed.\"}";
			}

			String query2 =  "update "+ this.database+".drink_ingredient set username = \""+newUsername+"\""+" where username = \""+userName+"\"";
			int updateResultDrinkIngr = smt.executeUpdate(query2);

			if (updateResultDrinkIngr == 0) {
				//System.out.print("****** IS 0");
			//	return "{ \"status\" : \"Error: SQL drink ingr update failed.\"}";
			}

			String query3 =  "update "+ this.database+".drink_likes set userName = \""+newUsername+"\""+" where userName = \""+userName+"\"";
			int updateResultDrinkLikes = smt.executeUpdate(query3);

			if (updateResultDrinkLikes == 0) {
				//System.out.print("****** IS 0");
			//	return "{ \"status\" : \"Error: SQL drink likes update failed.\"}";
			}


			/*if(updateResultUser == 1){
				//System.out.print("********* ITS !");
				return "{ \"status\" : \"ok\" }";
			}else if (updateResultUser == 0) {
				//System.out.print("****** IS 0");
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}*/
			
			smt.close();
			conn.close();
			//return "{ \"status\" : \"Error: SQL update failed.\" }";
			return "{ \"status\" : \"ok\" }";
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Failed updating password.");
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}


	public String insertProfilePhoto(String userName, String profilePhotoPath){
		try{
		
			String query = "update "+ this.database+".user set profilePhoto = \""+profilePhotoPath+"\" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);

			if(updateResult == 1){
				return "{ \"status\" : \"ok\" }";
			} else if (updateResult == 0) {
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			}
			smt.close();
			conn.close();
			
			return "{ \"status\" : \"Error: SQL update failed.\" }";

		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}

	public String updateBio(String userName, String bio){
		try{
			String query = "update "+ this.database+".user set bio = \""+bio+"\" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);
			smt.close();
			conn.close();

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
			String query = "update "+ this.database+".user set favoriteDrink = \""+favDrink+"\" where userName = \""+userName+"\"";
			int updateResult = smt.executeUpdate(query);
			
			smt.close();
			conn.close();

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

			//Likes a drink & Un-Likes a Drink
			if (toggle.equals("on")) { //liking drink
				query = "replace into "+ this.database+".drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '1', '0')";
				backupQuery = "update "+ this.database+".drink_likes set likes = 1, dislikes = 0 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";

			} else if ( toggle.equals("flip") ) {
				System.out.println("FLIPPPPP");
				query = "replace into "+ this.database+".drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '1', '0')";
				backupQuery = "update "+ this.database+".drink_likes set likes = 1, dislikes = 0 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";

			} else { //disliking drink
				query = "replace into "+ this.database+".drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '0', '0')";
				backupQuery = "update "+ this.database+".drink_likes set likes = 0, dislikes = 0 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";
			}
			System.out.println(query);

			int updateResult = smt.executeUpdate(query);
			
			if ( updateResult == 1 ) {
				smt.close();
				conn.close();
				return "{ \"status\" : \"ok\" }";
			} else if(updateResult == 0) {
				
				updateResult = smt.executeUpdate(backupQuery);
				smt.close();
				conn.close();
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

			
			//DISLIKES AND UN-DISLIKES A DRINK
			if (toggle.equals("on")) { //liking drink
				query = "replace into "+ this.database+".drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '0', '1')";
				backupQuery = "update "+ this.database+".drink_likes set likes = 0, dislikes = 1 where userName = \""+userName+"\" and drinkId = \""+drinkId+"\"";
			} else if ( toggle.equals("flip") ) {
				System.out.println("FLIPPPPP");
				query = "replace into "+ this.database+".drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '0', '1')";
				backupQuery = "update "+ this.database+".drink_likes set likes = 0, dislikes = 1 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";

			} else { //disliking drink
				query = "replace into "+ this.database+".drink_likes (userName, drink_id, likes, dislikes) values ('" + userName + "', '" + drinkId + "', '0', '0')";
				backupQuery = "update "+ this.database+".drink_likes set likes = 0, dislikes = 0 where userName = \""+userName+"\" and drink_id = \""+drinkId+"\"";
			}


			int updateResult = smt.executeUpdate(query);
			if ( updateResult == 1 ) {
				smt.close();
				conn.close();
				return "{ \"status\" : \"ok\" }";
			} else if(updateResult == 0) {
				updateResult = smt.executeUpdate(backupQuery);
				smt.close();
				conn.close();
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
		query = "select * from "+ this.database+".drink_likes where username='" + userName + "' AND drink_id='" + drinkId + "'";
		System.out.print(query);

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
			rs.close();
			smt.close();
			conn.close(); 
			return "{\"isLiked\": " + userLikes + ", \"isDisliked\": " + userDislikes + "}";
		}catch(Exception e){
			System.out.print("Didn't exist in DB, so the user hasn't liked it.");
			//Doesn't exist in DB and therefore hasn't been liked or disliked yet
			return "{\"isLiked\": " + userLikes + ", \"isDisliked\": " + userDislikes + "}";
		}

	}
//rod
	public ArrayList<Drink> getLikedDrinks(String userName) {
		String query = "";
		query = "select * from "+ this.database+".drink_likes where userName='" + userName + "' AND likes="+1;
		System.out.println(query);
		ArrayList<Drink> drinks = new ArrayList<>();
		
		Drink drink;
		try{
			smt.close();
			conn.close();
			DrinkSQL ds = new DrinkSQL();
			conn = ds.getConn();
			smt = ds.getSmt();
			rs = smt.executeQuery(query);
			while (rs.next()){
				int drinkId = rs.getInt("drink_id");
				drink = ds.getDrink(drinkId); 
				drinks.add(drink);
			}
			rs.close();
			smt.close();
			conn.close();
			return drinks;
		} catch (Exception e) {
			System.out.print("oof");
		}
		return null;
	}
	public ArrayList<Drink> getDislikedDrinks(String userName) {
		String query = "";
		query = "select * from "+ this.database+".drink_likes where userName='" + userName + "' AND dislikes="+1;
		System.out.println(query);
		ArrayList<Drink> drinks = new ArrayList<>();
		
		Drink drink;
		try{
			smt.close();
			conn.close();
			DrinkSQL ds = new DrinkSQL();
			conn = ds.getConn();
			smt = ds.getSmt();
			rs = smt.executeQuery(query);
			while (rs.next()){
				int drinkId = rs.getInt("drink_id");
				drink = ds.getDrink(drinkId); 
				drinks.add(drink);
			}
			rs.close();
			smt.close();
			conn.close();
			return drinks;
		} catch (Exception e) {
			System.out.print("oof");
		}
		return null;
	}

	public String followUser(String followedUser, String followingUser) {
		try{
			String query = "insert into "+ this.database+".user_followers (userId, followingUserId) values ( (select userId from "+ this.database+".user where userName = \""+followedUser+"\"), (select userId from "+ this.database+".user where userName = \""+followingUser+"\") )";
			
			int updateResult = smt.executeUpdate(query);
			
			smt.close();
			conn.close();

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

	public String unfollowUser(String followedUser, String followingUser) {
		try {
			String query = "delete from "+ this.database+".user_followers where userId = (select userId from "+ this.database+".user where userName = \""+followedUser+"\") and followingUserId = (select userId from "+ this.database+".user where userName = \""+followingUser+"\")";
			
			int updateResult = smt.executeUpdate(query);
			
			smt.close();
			conn.close();

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

	public User[] flagFollowedUsers(User[] users, String activeUserName) {
		

		try{
			String query = "select userId from "+this.database+".user_followers where followingUserId = (select userId from "+ this.database+".user where userName = \""+activeUserName+"\")";
			System.out.println("Follower query: "+query);

			rs=smt.executeQuery(query);

			ArrayList<Integer> followList = new ArrayList<Integer>();

			while (rs.next()) {
				followList.add(rs.getInt("userId")); 
			}

			//System.out.println("followList "+followList.get(0));
		

			for(int x = 0; x < users.length; x++) {
				for(int y=0; y<followList.size(); y++){
					if (users[x].userId == followList.get(y) ) {
						users[x].followedFlag = 1;
						break;
					}
				}
			}
			rs.close();
			smt.close();
			conn.close();
			
			return users;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public class notification{
		int id;
		int followerId;
		int drinkFlag;

		public notification(int id, int publisher, int date) {
			this.id = id;
			this.followerId = publisher;
			this.drinkFlag = date;
		}
	}

	public String getNotificationObjects(String username) {
	
		try{
			String	query1 = "select userId from "+this.database+".user where userName = \""+username+"\"";
			rs=smt.executeQuery(query1);
			
			int userId = 0;
			while(rs.next()){
				userId = rs.getInt("userId");
			}
			System.out.println("userId: "+userId);


			//get notifications from table
			String query2 = "select * from "+this.database+".post_notification where followerUserId = \""+userId+"\"";
			rs=smt.executeQuery(query2);

			ArrayList<notification> notifs = new ArrayList<notification>();
			while(rs.next())
			{
				int postId = rs.getInt("postId");
				int followerId = rs.getInt("followerUserId");
				int drinkFlag = rs.getInt("drinkFlag");

				notifs.add(new notification(postId, followerId, drinkFlag));
			}
			System.out.println("Notifs received: ");
			for(int x=0;x<notifs.size();x++){
				System.out.println("\tnotif : "+notifs.get(x).id+","+notifs.get(x).followerId+", "+notifs.get(x).drinkFlag);
			}


			ArrayList<Drink> drinks = new ArrayList<Drink>();
			//get drink info for drink notifs
			for ( int x =0; x<notifs.size(); x++) {
				if (notifs.get(x).drinkFlag == 1) {
					String query3 = "select name, publisher from "+this.database+".drink where drinkId =\""+notifs.get(x).id+"\"";
					rs=smt.executeQuery(query3);

					Drink d = new Drink();
					while(rs.next()){
						d.publisher = rs.getString("publisher");
						d.name = rs.getString("name");
						d.id = notifs.get(x).id;
						drinks.add(d);
					}
				}
			}
			System.out.println("Drink Notifs received: ");
			for(int x=0;x<drinks.size();x++){
				System.out.println("\tdrink : "+drinks.get(x).id+","+drinks.get(x).publisher);
			}

			//get post info for post notifs
			ArrayList<Post> posts = new ArrayList<Post>();
			for ( int x =0; x<notifs.size(); x++) {
				if (notifs.get(x).drinkFlag == 0) {
					String query4 = "select userId from "+this.database+".post where postId =\""+notifs.get(x).id+"\"";
					query4 = "select userName from "+this.database+".user where userId = (select userId from "+this.database+".post where postId =\""+notifs.get(x).id+"\")";
					rs=smt.executeQuery(query4);

					Post d = new Post();
					while(rs.next()){
						d.text = rs.getString("userName");
						d.postId = notifs.get(x).id;
						posts.add(d);
					}
				}
			}
			System.out.println("Post Notifs received: ");
			for(int x=0;x<posts.size();x++){
				System.out.println("\tPosts : "+posts.get(x).postId+","+posts.get(x).userId);
			}
			
			
			//sort by date/time (maybe can cheat with id instead of time), maybe can cheat with order of post notification db
			String out = "{ \"results\": [ ";


			ArrayList<Integer> list = new ArrayList<Integer>();
			for ( int x = 0; x < notifs.size(); x++) {
				if( notifs.get(x).drinkFlag == 1) {
					for(int y = 0; y<drinks.size(); y++){
						if(drinks.get(y).id == notifs.get(x).id){
							System.out.println("Adding drink to list");
							out+= "{ \"drinkName\" : \""+drinks.get(y).name +"\", \"publisher\" : \"";
							out+= drinks.get(y).publisher+"\", \"drinkFlag\" : 1";
							out+= "}";
						}				
					}
				}else {
					for(int z=0; z<posts.size(); z++) {
						if(posts.get(z).postId == notifs.get(x).id){
							System.out.println("Adding post to list");
							out+= "{ \"postId\" : \""+posts.get(z).postId +"\", \"publisher\" : \"";
							out+= posts.get(z).text+"\", \"drinkFlag\" : 0";
							out+= "}";
						}
					}
				}
				out+=",";
			}
			out = out.substring(0, out.length()-1) + "] }";

			//need to reorder possibly

			
			rs.close();
			smt.close();
			conn.close();
			return out;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
			

	}
}