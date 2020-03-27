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

	public PostSQL(){
		url = "jdbc:mysql://localhost:3306/";

		try{
		conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
		smt = conn.createStatement();
		}catch(Exception e){
			e.printStackTrace();
		}
	}

	public String insertPost(String text, String image, String username, String geolocation, String date){
		try{
			String query = "insert into test_schema.post "+
				"(text, image, userName, geolocation, date) "+
				"values "+
				"(\""+text+"\", \""+image+"\", \""+username+"\", \""+geolocation+"\", \""+date+"\")";
			System.out.println(query);

			int insertResult = smt.executeUpdate(query);

			return "{ \"status\" : \"ok\" }";	

		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error inserting post to db");
			return "{ \"status\" : \"Error: SQL insert failed.\"}";
		}

	}

	public ArrayList<Post> getAllPosts(){
		try{
			rs = smt.executeQuery("select * from test_schema.post");
			ArrayList<Post> post = new ArrayList<Post>();

			while(rs.next())
			{
				int postId = rs.getInt("postId");
				String text = rs.getString("text");
				String image = rs.getString("image");
				String username = rs.getString("userName");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
			

				Post p = new Post(postId, text, image, username, geolocation, date);
				post.add(p);
			}
			conn.close();
			return post;


		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public ArrayList<Post> getUserPosts(String userName){
		try{
			rs = smt.executeQuery("select * from test_schema.post where userName = \""+userName+"\"");
			ArrayList<Post> post = new ArrayList<Post>();

			while(rs.next())
			{
				int postId = rs.getInt("postId");
				String text = rs.getString("text");
				String image = rs.getString("image");
				String username = rs.getString("userName");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
			

				Post p = new Post(postId, text, image, username, geolocation, date);
				post.add(p);
			}
			conn.close();
			return post;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

}