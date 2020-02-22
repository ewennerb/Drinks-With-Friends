package server.SQL;
import java.sql.*;


public class DrinkSQL {

	private String url;
	private Connection conn;
	Statement smt;
	ResultSet rs;


	public DrinkSQL(){
		url = "jdbc:mysql://localhost:3306/";

		try{
		conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
		smt = conn.createStatement();
		}catch(Exception e){
			e.printStackTrace();
		}

		
	}


	public String getAllDrinks(){
		try{
			//String url = "jdbc:mysql://localhost:3306/";
			//Connection conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
			//Statement smt = conn.createStatement();
			rs = smt.executeQuery("select * from test_schema.drink");
			String all = "Drink Info:<br>";

			while (rs.next())
			{
				int drinkId=rs.getInt("drinkId");
				String dName=rs.getString("name");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				String ingredients=rs.getString("ingredients");
				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");
				String publisher=rs.getString("publisher");


				all+=drinkId+"\t"+dName+"\t"+stockPhoto+"\t"+description+"\t"+ingredients+"\t"+likes+"\t"+dislikes+"\t"+publisher;
				all+="<br>";
			}
			conn.close();
			System.out.println(all);
			return all;

		}catch(Exception e){
			e.printStackTrace();
			return "/drink Fail";
		}
	}

	public String getDrink(String drinkName){
		try{
	
			String query = "select * from test_schema.drink where name = \""+drinkName+"\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
			String returnDrink = "Drink: "+drinkName+"<br>";

			while (rs.next())
			{
				int drinkId=rs.getInt("drinkId");
				String dName=rs.getString("name");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				String ingredients=rs.getString("ingredients");
				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");
				String publisher=rs.getString("publisher");


				returnDrink+=drinkId+"\t"+dName+"\t"+stockPhoto+"\t"+description+"\t"+ingredients+"\t"+likes+"\t"+dislikes+"\t"+publisher;
				returnDrink+="<br>";
			}

			conn.close();
			System.out.println(returnDrink);
			return returnDrink;


		}catch(Exception e){
			e.printStackTrace();
			return "/drink find Fail";
		}
	}
	   	  
}