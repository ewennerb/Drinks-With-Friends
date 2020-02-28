package server.SQL;
import java.io.Console;
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
			ArrayList<Drink> drink = new ArrayList<Drink>();
			
			while (rs.next())
			{
				int drinkId=rs.getInt("drinkId");
				String dName=rs.getString("name");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");
				String publisher=rs.getString("publisher");

				String query_ingreds = "SELECT quantity, measurement, ingredient " +
					"FROM test_schema.drink_ingredient " + 
					"WHERE drink_id = "+ drinkId + " AND username = \"" + publisher + "\"";
				Statement smt2 = conn.createStatement();
				ResultSet rs2 = smt2.executeQuery(query_ingreds);
				ArrayList<Ingredient> ii = new ArrayList<>();
				Ingredient[] ingreds;
				if (rs2 != null){
					
					while (rs2.next()){
						ii.add(new Ingredient(rs2.getString("quantity"),rs2.getString("measurement"),rs2.getString("ingredient")));
					}
				
				}
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				Drink d = new Drink(drinkId, dName, description,  ingreds, stockPhoto, likes, dislikes, publisher);
				drink.add(d);

				
			}
			conn.close();
			return drink;

		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public Drink getDrink(String drinkName, String owner){
		try{
	
			String query = "select * from test_schema.drink where name = \""+drinkName+"\" AND publisher = \"" + owner+"\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
			Drink drink = new Drink();
			
			while (rs.next())
			{
				int drinkId=rs.getInt("drinkId");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");

				String query_ingreds = "SELECT quantity, measurement, ingredient " +
					"FROM test_schema.drink_ingredient " + 
					"WHERE drink_id = "+ drinkId + " AND username = \"" + owner + "\"";
				System.out.println(query_ingreds);
				Statement smt2 = conn.createStatement();
				ResultSet rs2 = smt2.executeQuery(query_ingreds);
				ArrayList<Ingredient> ii = new ArrayList<>();
				Ingredient[] ingreds;
				rs2.last();
				System.out.println(rs2.getRow());
				rs2.first();
				while (rs2.next()){
					System.out.println(rs2.getString("quantity"));
					ii.add(new Ingredient(rs2.getString("quantity"),rs2.getString("measurement"),rs2.getString("ingredient")));
				}
				
				
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				drink = new Drink(drinkId, drinkName, description,  ingreds, stockPhoto, likes, dislikes, owner);
				System.out.println(drink);
				
			}
			
			conn.close();
			return drink;


		}catch(Exception e){
			return null;
		} 
	}

	public boolean insertDrink(Drink d){
		System.out.println("inserting");
		try {
			//check if user already added dirnk
			String query = "INSERT into test_schema.drink "+ 
				"(name, stockphoto, description, likes, dislikes, publisher) "+
				"VALUES "+ 
				"(\""+d.name+"\", \""+d.photo+"\", \""+d.description+"\", "+0+", "+0+ ", \"" + d.publisher+"\")";
				
			System.out.println(query);
			int success = smt.executeUpdate(query, Statement.RETURN_GENERATED_KEYS);
			if (success == 0) {
				System.out.println("add drink fail");
			}
			ResultSet gk = smt.getGeneratedKeys();
			long id = -1;
			while (gk.next()) {
				id = gk.getInt(1);
			}
			for (Ingredient i : d.ingredients) {
				
				query = "";
				query += "INSERT INTO test_schema.drink_ingredient (username, drink_id, ingredient, measurement, quantity) "+
				"VALUES "+ 
				"(\""+d.publisher+"\", \""+id+"\", \""+i.ingredient+"\", \"" + i.measurement+"\", \""+ i.quantity+"\");";
				Statement smt2 = conn.createStatement();
				success = smt2.executeUpdate(query);
				if (success == 0) {
					System.out.println("add ingredients fail");
				}
			}

		} catch (Exception e) {
			System.out.println("fail");
			e.printStackTrace();
		}

		return true;
	}
	   	  
}