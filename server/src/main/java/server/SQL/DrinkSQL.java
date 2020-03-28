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
					"WHERE drink_id = "+ drinkId + " AND username = \"" + publisher + "\""; // to get only official drinks set publisher to DrinksWithFriends or Null
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
				while (rs2.next()){
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

	public Ingredient[] searchIngredients(String request) {
		System.out.print("ingredient searching");
		StringBuilder searchString = new StringBuilder("%" + request + "%");
		for (int i = 0; i < request.length(); i++) {
			if (searchString.charAt(i) == ' ') {
				searchString.setCharAt(i, '%');
			}
		}
		System.out.println("Search String: "+searchString);
		try{
			
			String query = "select * from test_schema.drink_ingredient where ingredient LIKE \""+searchString+"\"";
			System.out.println(query);
			rs = smt.executeQuery(query);

			ArrayList<Ingredient> ingredients = new ArrayList<Ingredient>();
			while(rs.next())
			{
				//getResults
				//add to arraylist
				String username = rs.getString("username");
				int drinkId = rs.getInt("drink_id");
				String ingredient = rs.getString("ingredient");
				String measurement = rs.getString("measurement");
				String quantity = rs.getString("quantity");

				Ingredient i = new Ingredient(username, drinkId, ingredient, measurement, quantity);
				ingredients.add(i);
			}
			conn.close();
			//add to Array
			Ingredient[] outList = new Ingredient[ingredients.size()];
			outList = ingredients.toArray(outList);
			return outList;

		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public Drink[] searchDrink(String request, int flag) {
		System.out.println("searching");
		StringBuilder searchString = new StringBuilder("%" + request + "%");
		for (int i = 0; i < request.length(); i++) {
			if (searchString.charAt(i) == ' ') {
				searchString.setCharAt(i, '%');
			}
		}
		System.out.println(searchString);
		try {

			String query = "";
			if ( flag == 0 )
				query = "Select * FROM test_schema.drink WHERE name LIKE \"" + searchString + "\"";
			else if ( flag == 1 )
				query = "Select * FROM test_schema.drink WHERE name LIKE \"" + searchString + "\" and publisher = \"iba\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
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
			Drink[] outDrink = new Drink[drink.size()];
			outDrink = drink.toArray(outDrink);
			return outDrink;
		} catch (Exception e) {
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
				return false;
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
					return false;
				}
			}

		} catch (Exception e) {
			System.out.println("fail");
			e.printStackTrace();
		}

		return true;
	}

	public String[] getDrinkNamesStartingWith(char let){
		System.out.println("Getting drinks starting with " + let);
		ArrayList<String> dnames = new ArrayList<>();

		try {
			String query = "SELECT DISTINCT d.name, d.publisher " +
			"FROM test_schema.drink d "+
			"WHERE d.name like \""+let+"%\"";

			rs = smt.executeQuery(query);
			while (rs.next()) {
				dnames.add(rs.getString("name"));
				dnames.add(rs.getString("publisher"));
			}
		} catch (Exception e) {


		}
		String[] outDrink = new String[dnames.size()];
		outDrink = dnames.toArray(outDrink);

		return outDrink;
	}

	public String likeDrink(int drinkId, String toggle){
		String query = "";
		try{
			if (toggle.equals("on")){
				query = "update test_schema.drink set likes = likes + 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("off")){
				query = "update test_schema.drink set likes = likes - 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("flip")){
				query = "update test_schema.drink set likes = likes + 1, dislikes = dislikes - 1 where drinkId = \""+drinkId+"\"";
			}
			int updateResult = smt.executeUpdate(query);

			rs = smt.executeQuery("select * from test_schema.drink where drinkId = \""+drinkId+"\"");
			int updatedLikes = -1;
			int updatedDislikes = -1;
			while (rs.next()){
				updatedLikes = rs.getInt("likes");
				updatedDislikes = rs.getInt("dislikes");
			}


//			if(updateResult == 1) {
				return "{ \"likes\" : \""+ updatedLikes + "\", \"dislikes\": \"" + updatedDislikes + "\"}";
//			} else if(updateResult == 0) {
//				return "{ \"status\" : \"Error: SQL update failed.\"}";
//			}

//			return "{ \"status\" : \"Error: SQL update failed.\" }";
		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
//		return("\nSomething has gone wrong in DrinkSQL.java:likeDrink()\n");
	}

	public String dislikeDrink(int drinkId, String toggle){
		String query = "";
		try{
			if(toggle.equals("on")){
				query = "update test_schema.drink set dislikes = dislikes + 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("off")){
				query = "update test_schema.drink set dislikes = dislikes - 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("flip")){
				query = "update test_schema.drink set likes = likes - 1, dislikes = dislikes + 1 where drinkId = \""+drinkId+"\"";
			}
			int updateResult = smt.executeUpdate(query);

			rs = smt.executeQuery("select * from test_schema.drink where drinkId = \""+drinkId+"\"");
			int updatedLikes = -1;
			int updatedDislikes = -1;
			while (rs.next()){
				updatedLikes = rs.getInt("likes");
				updatedDislikes = rs.getInt("dislikes");
			}

//			if(updateResult == 1) {
			return "{ \"likes\" : \""+ updatedLikes + "\", \"dislikes\": \"" + updatedDislikes + "\"}";
//			} else if(updateResult == 0) {
//				return "{ \"status\" : \"Error: SQL update failed.\"}";
//			}

//			return "{ \"status\" : \"Error: SQL update failed.\" }";
		}catch(Exception e){
			e.printStackTrace();
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}
//		return("\nSomething has gone wrong in DrinkSQL.java:dislikeDrink()\n");
	}

//	public String removeLikeDrink(int drinkId, int flag){
//		try{
//			String query = "";
//
//			if (flag==1)
//				query = "update test_schema.drink set likes = likes - 1 where likes > 0 and drinkId = \""+drinkId+"\"";
//			else if (flag==-1)
//				query = "update test_schema.drink set dislikes = dislikes - 1 where dislikes > 0 and drinkId = \""+drinkId+"\"";
//
//			int updateResult = smt.executeUpdate(query);
//
//			if(updateResult == 1) {
//				return "{ \"status\" : \"ok\" }";
//			} else if(updateResult == 0) {
//				return "{ \"status\" : \"Error: SQL update failed.\"}";
//			}
//
//			return "{ \"status\" : \"Error: SQL update failed.\" }";
//		}catch(Exception e){
//			e.printStackTrace();
//			return "{ \"status\" : \"Error: SQL update failed.\"}";
//		}
//		return("Something on the backend is wrong in DrinkSQL.java:");
//	}
}