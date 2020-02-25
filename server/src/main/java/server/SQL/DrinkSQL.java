package server.SQL;
import java.sql.*;
import java.util.ArrayList;
import server.Drink.Drink;



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


	public ArrayList<Drink> getAllDrinks(){
		try{
			//String url = "jdbc:mysql://localhost:3306/";
			//Connection conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
			//Statement smt = conn.createStatement();
			rs = smt.executeQuery("select * from test_schema.drink");
			String all = "Drink Info:<br>";
			ArrayList<Drink> drink = new ArrayList<Drink>();
			
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
				String[] ingredientList = new String[]{ingredients};
				Drink d = new Drink(drinkId, dName, description, ingredientList, stockPhoto, likes, dislikes, publisher);
				drink.add(d);

				all+=drinkId+"\t"+dName+"\t"+stockPhoto+"\t"+description+"\t"+ingredients+"\t"+likes+"\t"+dislikes+"\t"+publisher;
				all+="<br>";
			}
			conn.close();
			System.out.println(all);
			return drink;

		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public Drink getDrink(String drinkName){
		try{
	
			String query = "select * from test_schema.drink where name = \""+drinkName+"\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
			String returnDrink = "Drink: "+drinkName+"<br>";
			Drink drink = new Drink();


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
				String[] ingredientList = new String[]{ingredients};
				drink = new Drink(drinkId, dName, description, ingredientList, stockPhoto, likes, dislikes, publisher);

				returnDrink+=drinkId+"\t"+dName+"\t"+stockPhoto+"\t"+description+"\t"+ingredients+"\t"+likes+"\t"+dislikes+"\t"+publisher;
				returnDrink+="<br>";
			}

			conn.close();
			System.out.println(returnDrink);
			return drink;


		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
	   	  
}