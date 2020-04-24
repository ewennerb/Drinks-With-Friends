package server.SQL;

import java.sql.*;
import java.util.ArrayList;
import server.User.User;
import server.Drink.Drink;

import ch.qos.logback.core.rolling.helper.RenameUtil;
import server.Post.Post;


public class PostSQL {

	private String url;
	private Connection conn;
	//Statement smt;
	PreparedStatement psmt;
	ResultSet rs;
	private String database;
	public int recentPostId = 0;

	public PostSQL(){
		url = "jdbc:mysql://localhost:3306/";
		url = "jdbc:mysql://b4e9xxkxnpu2v96i.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hiqietg4casioadz"; 	//production
		
		try{
			conn = DriverManager.getConnection(url, "gzgsvv5r3zidpv57", "xf590wkdp1qeejrj"); //production
			//conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");//development
		
			//smt = conn.createStatement();
			
		}catch(Exception e){
			e.printStackTrace();
			
		}
		database = "test_schema";		//development
		database = "hiqietg4casioadz";	//production

	}

	public String insertPost(String text, String image, String username, String geolocation, String date){
		try{
			String query = "insert into "+ this.database+".post "+
				"(text, image, userId, geolocation, date) "+
				"values "+
				"(?, ?, (select userId from "+ this.database+".user where userName = ?), ?, ?)";
			System.out.println(query);
			psmt = conn.prepareStatement(query);
			psmt.setString(1, text);
			psmt.setString(2, image);
			psmt.setString(3, username);
			psmt.setString(4, geolocation);
			psmt.setString(5, date);

			int insertResult = psmt.executeUpdate();

			String query3 = "select postId from "+this.database+".post where text = ? and userId = (select userId from "+ this.database+".user where userName = ?)";
			psmt = conn.prepareStatement(query3);
			psmt.setString(1, text);
			psmt.setString(2, username);

			rs = psmt.executeQuery();

			int retPostId = 0;
			while(rs.next())
			{
				retPostId = rs.getInt("postId");
			}
			recentPostId = retPostId;

			rs.close();
			psmt.close();
			//smt.close();
			conn.close();

			return "{ \"status\" : \"ok\" }";	

		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error inserting post to db");
			return "{ \"status\" : \"Error: SQL insert failed.\"}";
		}

	}

	public Post[] getAllPosts(){
		try{
			//rs = smt.executeQuery("select p.postId, p.text, p.image, p.userId, u.userName as username, p.geolocation, p.date from "+ this.database+".post p, "+ this.database+".user u WHERE u.userId = p.userId");
			psmt = conn.prepareStatement("select p.postId, p.text, p.image, p.userId, u.userName as username, p.geolocation, p.date from "+ this.database+".post p, "+ this.database+".user u WHERE u.userId = p.userId");
			rs = psmt.executeQuery();

			ArrayList<Post> post = new ArrayList<>();

			while(rs.next())
			{
				String text = rs.getString("text");
				String image = rs.getString("image");
				int userId = rs.getInt("userId");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
				int postId = rs.getInt("postId");
				Post p = new Post(postId, text, image, userId, rs.getString("username"), geolocation, date);
				post.add(p);
			}
			rs.close();
			psmt.close();
			//smt.close();
			conn.close();
			Post[] outPost = new Post[post.size()];
			outPost = post.toArray(outPost);
			return outPost;


		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public ArrayList<Post> getUserPosts(String username){
		try{
			System.out.print("select * from "+ this.database+".post p, "+ this.database+".user u where u.userName = \""+username+"\" AND u.userId = p.userId" );
			psmt = conn.prepareStatement("select * from "+ this.database+".post p, "+ this.database+".user u where u.userName = ? AND u.userId = p.userId" );
			psmt.setString(1, username);
			rs = psmt.executeQuery();

			ArrayList<Post> post = new ArrayList<Post>();

			while(rs.next())
			{
				int postId = rs.getInt("postId");
				String text = rs.getString("text");
				String image = rs.getString("image");
				int queryuserId = rs.getInt("userId");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
			

				Post p = new Post(postId, text, image, queryuserId, "", geolocation, date);
				post.add(p);
			}
			rs.close();
			psmt.close();
			//smt.close();
			conn.close();
			return post;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public String deletePost(int postId){
		try{
			String query = "delete from "+ this.database+".post where postId = ?";
			System.out.print(query);
			psmt = conn.prepareStatement(query);
			psmt.setInt(1, postId);
			
			int result = psmt.executeUpdate();

			String query2 = "delete from "+this.database+".post_notification where postId = ?";
			psmt = conn.prepareStatement(query2);
			psmt.setInt(1, postId);

			int result2 = psmt.executeUpdate();

			//String query3 = "delete from "+this.database+".drink_map where postId = \""+postId+"\"";
			//int result3 =smt.executeUpdate(query3);
			psmt.close();
			//smt.close();
			conn.close();
			return "{ \"status\" : \"ok\" }";
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error inserting post to db");
			return "{ \"status\" : \"Error: SQL insert failed.\"}";
		}

	}

	public Post[] searchPost(String search) {
		try{
			String query = "SELECT p.postId, p.text, p.image, u.userName, u.userId, p.geolocation, p.date, u.profilePhoto, u.name FROM "+ this.database+".post p, "+ this.database+".user u WHERE p.text LIKE \"%\"?\"%\" AND u.userId = p.userId";
			psmt = conn.prepareStatement(query);
			psmt.setString(1, search);

			//rs = smt.executeQuery(query);
			rs = psmt.executeQuery();
			ArrayList<Post> post = new ArrayList<>(); 
			while(rs.next()) {
				int id = rs.getInt("postId");
				String text = rs.getString("text");
				String image = rs.getString("image");
				int userId = rs.getInt("userId");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
				Post p = new Post(id, text, image, userId, rs.getString("userName"), geolocation, date);
				//p.profileImage = rs.getString("profilePhoto");
				p.name = rs.getString("name");
				post.add(p);
			}
			rs.close();
			psmt.close();
			//smt.close();
			conn.close();
			Post[] outPost = new Post[post.size()];
			outPost = post.toArray(outPost);
			return outPost;
			
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error searching post to db");
			return null;
		}
	}

	public Post[] getPost(int postId) {
		try{
			String query = "SELECT p.postId, p.text, p.image, u.userName, u.userId, p.geolocation, p.date, u.profilePhoto, u.name FROM "+ this.database+".post p, "+ this.database+".user u WHERE p.postId = ? AND u.userId = p.userId";
			psmt = conn.prepareStatement(query);
			psmt.setInt(1, postId);


			rs = psmt.executeQuery();
			ArrayList<Post> post = new ArrayList<>(); 
			while(rs.next()) {
				int id = rs.getInt("postId");
				String text = rs.getString("text");
				String image = rs.getString("image");
				int userId = rs.getInt("userId");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
				Post p = new Post(id, text, image, userId, rs.getString("userName"), geolocation, date);
	
				//add stuff to get geolocation figure out formatting
				p.name = rs.getString("name");
				post.add(p);
			}
			rs.close();
			psmt.close();
			//smt.close();
			conn.close();
			Post[] outPost = new Post[post.size()];
			outPost = post.toArray(outPost);
			return outPost;
			
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error searching post to db");
			return null;
		}
	}

	public String notifyUser(int postId, String username) {
		try {
		
			//getFollowing Users
			String query1 = "select followingUserId from "+this.database+".user_followers where userId = (select userId from "+ this.database+".user where userName = ?)";
			System.out.println("Follower query: "+query1);
			psmt = conn.prepareStatement(query1);
			psmt.setString(1, username);

			rs=psmt.executeQuery();

			ArrayList<Integer> followList = new ArrayList<Integer>();

			while (rs.next()) {
				followList.add(rs.getInt("followingUserId")); 
			}

			rs.close();
			//addRows to post_notif database
			String query2 = "";
			for ( int x = 0; x <followList.size(); x++){
				query2 = "insert into "+ this.database+".post_notification (postId, followerUserId, drinkFlag) values (?, ?, 0)";
				psmt = conn.prepareStatement(query2);
				psmt.setInt(1, postId);
				psmt.setInt(2, followList.get(x));
		
				int updateResult = psmt.executeUpdate();
				
				if(updateResult == 0) {
					return "{ \"status\" : \"Error: SQL update failed.\"}";
				}
			}

			psmt.close();
			//smt.close();
			conn.close();

			return "{ \"status\" : \"ok\" }";
		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
		

	}

	public String removeNotification(int postId, String username){
	
		//delete post notification from db
		//need to figure out should this return the post/drink?
		try{
			String query = "delete from "+this.database+".post_notification where postId = ? and followerUserId = (select userId from "+ this.database+".user where userName = ?)";
			psmt = conn.prepareStatement(query);
			psmt.setInt(1, postId);
			psmt.setString(2, username);
			
			System.out.println(query);

			int result2 = psmt.executeUpdate();

			psmt.close();
			//smt.close();
			conn.close();
		
		
			if (result2 == 0)
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			else
				return "{ \"status\" : \"ok\" }";
		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}

	}

	public String updatePost(Post post){
		try {
			String query = "update "+this.database+".post set text = ? , image = ? ,  date = ? where postId= ? ";			
			psmt = conn.prepareStatement(query);
			psmt.setString(1, post.text);
			psmt.setString(2, post.image);
			psmt.setString(3, post.date);
			psmt.setInt(4, post.postId);
			
			System.out.println(query);
			System.out.println(psmt);

			int result2 = psmt.executeUpdate();

			psmt.close();
			conn.close();
			
			System.out.println("UPDATEd POST");
			System.out.println(post);
			if (result2 == 0)
				return "{ \"status\" : \"Error: SQL update failed.\"}";
			else
				return "{ \"status\" : \"ok\" }";
	
		} catch (Exception e){
			e.printStackTrace();
			return "ope";
		}

	}


	/*
	public String insertGeotag(Post p, String addr, String locName) {
		try{
			//getUserId
			String query1 = "select userId from "+ this.database+".user where userName = \""+p.geolocation+"\"";
			System.out.println(query1);

			rs = smt.executeQuery(query1);
			int userId = 0;
			while(rs.next()){
				userId = rs.getInt("userId");
			}
			System.out.print("UserId: "+userId);

			//insert into drink_map
			//String query2 = "insert into "+this.database+".drink_map (userId, locationName, address, postId) values (\""+userId+"\", \""+addr+"\", \""+locName+"\", \""+p.postId+"\")";
			//System.out.println(query2);

			//int result = smt.executeUpdate(query2);

			//if(result != 1)
			//	return "{ \"status\" : \"Error: SQL update failed.\"}";

			rs.close();
			smt.close();
			conn.close();
			return "{ \"status\" : \"ok\" }";
		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
	}*/
	

}