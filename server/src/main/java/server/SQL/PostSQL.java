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
	Statement smt;
	ResultSet rs;
	private String database;

	public PostSQL(){
		url = "jdbc:mysql://localhost:3306/";
		//url = "jdbc:mysql://us-cdbr-iron-east-01.cleardb.net"; 	//deployment

		try{
			conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
			//conn = DriverManager.getConnection(url, "b6576e130e8d5a", "3c708746");
			smt = conn.createStatement();
		}catch(Exception e){
			e.printStackTrace();
		}
		database = "test_schema";
		//database = "heroku_01bb44a8d7ed741";
	}

	public String insertPost(String text, String image, String username, String geolocation, String date){
		try{
			String query = "insert into "+ this.database+".post "+
				"(text, image, userId, geolocation, date) "+
				"values "+
				"(\""+text+"\", \""+image+"\", (select userId from "+ this.database+".user where userName = \""+geolocation+"\"), \""+geolocation+"\", \""+date+"\")";
			System.out.println(query);

			int insertResult = smt.executeUpdate(query);
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
			rs = smt.executeQuery("select p.postId, p.text, p.image, p.userId, u.userName as username, p.geolocation, p.date from "+ this.database+".post p, "+ this.database+".user u WHERE u.userId = p.userId");
			ArrayList<Post> post = new ArrayList<>();

			while(rs.next())
			{
				String text = rs.getString("text");
				String image = rs.getString("image");
				int userId = rs.getInt("userId");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
				int postId = rs.getInt("postId");
				Post p = new Post(postId, text, image, userId, geolocation, date, rs.getString("username"));
				post.add(p);
			}
			
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
			rs = smt.executeQuery("select * from "+ this.database+".post p, "+ this.database+".user u where u.userName = \""+username+"\" AND u.userId = p.userId" );
			ArrayList<Post> post = new ArrayList<Post>();

			while(rs.next())
			{
				int postId = rs.getInt("postId");
				String text = rs.getString("text");
				String image = rs.getString("image");
				int queryuserId = rs.getInt("userId");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
			

				Post p = new Post(postId, text, image, queryuserId, geolocation, date, "");
				post.add(p);
			}
			conn.close();
			return post;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public String deletePost(int postId){
		try{
			String query = "delete from "+ this.database+".post where postId = \""+postId+"\"";
			System.out.print(query);
			
			int result = smt.executeUpdate(query);
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
			String query = "SELECT p.postId, p.text, p.drinkImage as image, u.userName, u.userId, p.geolocation, p.date, u.profilePhoto, u.name FROM "+ this.database+".post p, "+ this.database+".user u WHERE p.text LIKE '%" + search +"%' AND u.userId = p.userId";
			
			rs = smt.executeQuery(query);
			ArrayList<Post> post = new ArrayList<>(); 
			while(rs.next()) {
				int id = rs.getInt("postId");
				String text = rs.getString("text");
				String image = rs.getString("image");
				int userId = rs.getInt("userId");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
				Post p = new Post(id, text, image, userId, geolocation, date, rs.getString("userName"));
				//p.profileImage = rs.getString("profilePhoto");
				p.name = rs.getString("name");
				post.add(p);
			}
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
	

}