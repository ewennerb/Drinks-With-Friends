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
			rs = smt.executeQuery("select p.postId, p.text, p.image, p.userName, p.geolocation, p.date from test_schema.post p");
			ArrayList<Post> post = new ArrayList<>();

			while(rs.next())
			{
				String text = rs.getString("text");
				String image = rs.getString("image");
				String username = rs.getString("userName");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
				int postId = rs.getInt("postId");
				Post p = new Post(postId, text, image, username, geolocation, date);
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

	public String deletePost(int postId){
		try{
			String query = "delete from test_schema.post where postId = \""+postId+"\"";
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
			String query = "SELECT p.text, p.image, p.userName, p.geolocation, p.date, u.profilePhoto, u.name FROM test_schema.post p, test_schema.user u WHERE p.text LIKE '%" + search +"%' AND u.userName = p.userName";
			
			rs = smt.executeQuery(query);
			ArrayList<Post> post = new ArrayList<>(); 
			while(rs.next()) {
				String text = rs.getString("text");
				String image = rs.getString("image");
				String username = rs.getString("userName");
				String geolocation = rs.getString("geolocation");
				String date = rs.getString("date");
				Post p = new Post(0, text, image, username, geolocation, date);
				p.profileImage = rs.getString("profilePhoto");
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
	public String[] getPostUsernames(Post[] posts) {
		
		try{
			ArrayList<String> outPost = new ArrayList<>();
			String query = "";
			for (Post p: posts){
				query = "";
				query += "SELECT u.userName, p.postId "+
					"FROM test_schema.user u, test_schema.post p "+
					"WHERE u.userName = '" + p.userName+"' AND p.userName = u.userName" ;
				
				Statement smt2 = conn.createStatement();
				rs = smt2.executeQuery(query);
				while(rs.next()){
					outPost.add(rs.getString("userName") + "::" + rs.getString("postId"));
					System.out.println(rs.getString("userName") + " " + rs.getString("postId"));
				}
			}
			conn.close();
			String[] out_names = new String[outPost.size()];
			out_names = outPost.toArray(out_names);

			return out_names;
			
		}catch(Exception e){
			e.printStackTrace();
			System.out.println("Error searching post to db");
			return null;
		}
	}

}