package server.SQL;
import java.sql.*;
import java.util.ArrayList;

import ch.qos.logback.core.rolling.helper.RenameUtil;
import server.Drink.Drink;
import server.Drink.Ingredient;



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
				Drink d = new Drink(drinkId, dName, description, null, stockPhoto, likes, dislikes, publisher);
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
			Drink drink = new Drink();
			System.out.println(rs.toString());
			
			while (rs.next())
			{
				int drinkId=rs.getInt("drinkId");
				String dName=rs.getString("name");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				//Array ingredients=rs.getArray("ingredients");
				//System.out.println(ingredients);

				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");
				String publisher=rs.getString("publisher");
				//Ingredient[] ingredientList = new Ingredient[]{ingredients};
				//drink = new Drink(drinkId, dName, description, ingredientList, stockPhoto, likes, dislikes, publisher);
				
				
				String query_ingreds = "select * from test_schema.drink_ingredient where drink_id = "+ drinkId + " AND "+
					"username = \"" + publisher + "\"";
				Statement smt2 = conn.createStatement();
				ResultSet rs2 = smt2.executeQuery(query_ingreds);
				
				Ingredient[] ingreds = new Ingredient[0];
				if (rs2 != null){
					rs2.last();
					ingreds = new Ingredient[rs2.getRow()];
					rs2.first();
					int i = 0;
					while (rs2.next()){
						ingreds[i++] = new Ingredient(rs2.getString("quantity"),rs2.getString("measurement"),rs2.getString("ingredient"));
					}
				
				}
				
				drink = new Drink(drinkId, dName, description, ingreds, stockPhoto, likes, dislikes, publisher);
				
				
			}
			

			conn.close();
			return drink;


		}catch(Exception e){
			e.printStackTrace();
			return null;
		} 
	}
	   	  
}