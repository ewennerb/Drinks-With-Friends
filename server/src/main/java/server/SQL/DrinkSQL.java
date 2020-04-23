package server.SQL;


import java.sql.*;
import java.util.ArrayList;


import org.apache.commons.dbcp2.*;

import java.util.*;

import server.Drink.Drink;
import server.Drink.Ingredient;

public class DrinkSQL {

	private String url;
	private Connection conn;
	Statement smt;
	ResultSet rs;
	public int topResultDrinkId = 0;
	private String database;
	BasicDataSource bds;
	public int recentDrinkId = 0;
	

	public DrinkSQL() {
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


	public ArrayList<Drink> getAllDrinks(){
		ArrayList<Drink> drink = new ArrayList<Drink>();
		try{
			//String url = "jdbc:mysql://localhost:3306/";
			//Connection conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
			//Statement smt = conn.createStatement();
			rs = smt.executeQuery("select * from "+ this.database+".drink");

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
					"FROM "+ this.database+".drink_ingredient " +
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
				rs2.close();
				smt2.close();
				if (!(rs2.isClosed() && smt2.isClosed())){
					System.out.println("ingredient all is not closed");
				}
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				Drink d = new Drink(drinkId, dName, description,  ingreds, stockPhoto, likes, dislikes, publisher);
				drink.add(d);


				
			}
			rs.close();
			smt.close();
			
			conn.close();
			if (!(rs.isClosed() && smt.isClosed() && conn.isClosed())){
				System.out.println("drink all is not closed");
				System.out.println("	rs: " + rs.isClosed());
				System.out.println("	smt: " + smt.isClosed());
				System.out.println("	conn: " + conn.isClosed());
			}

		}catch(Exception e){
			e.printStackTrace();
			try {
				rs.close();
				smt.close();
				conn.close();
				if (!(rs.isClosed() && smt.isClosed() && conn.isClosed())){
					System.out.println("drink all exception is not closed");
					System.out.println("	rs: " + rs.isClosed());
					System.out.println("	smt: " + smt.isClosed());
					System.out.println("	conn: " + conn.isClosed());
				}
			} catch (SQLException se) {
				se.printStackTrace();
			}
		}
		return drink;
	}

	public Drink getDrink(String drinkName, String owner){
		try{

			String query = "select * from "+ this.database+".drink where name = \""+drinkName+"\" AND publisher = \"" + owner+"\"";
			System.out.println(query);
			rs = smt.executeQuery(query);
			Drink drink = new Drink();
			int drinkId = -1;
			while (rs.next())
			{
				drinkId=rs.getInt("drinkId");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");

				String query_ingreds = "SELECT quantity, measurement, ingredient " +
					"FROM "+ this.database+".drink_ingredient " +
					"WHERE drink_id = "+ drinkId + " AND username = \"" + owner + "\"";
				System.out.println(query_ingreds);
				Statement smt2 = conn.createStatement();
				ResultSet rs2 = smt2.executeQuery(query_ingreds);
				ArrayList<Ingredient> ii = new ArrayList<>();
				Ingredient[] ingreds;
				while (rs2.next()){
					ii.add(new Ingredient(rs2.getString("quantity"),rs2.getString("measurement"),rs2.getString("ingredient")));
				}
				rs2.close();
				smt2.close();
				if (!(rs2.isClosed() && smt2.isClosed())){
					System.out.println("ingredient find is not closed");
				}
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				drink = new Drink(drinkId, drinkName, description,  ingreds, stockPhoto, likes, dislikes, owner);
				System.out.println(drink);

			}
			rs.close();
			updateLookedAt(drinkId);

			smt.close();
			conn.close();
			
			if (!(rs.isClosed() && smt.isClosed() && conn.isClosed())){
				System.out.println("drink find is not closed");
				System.out.println("	rs: " + rs.isClosed());
				System.out.println("	smt: " + smt.isClosed());
				System.out.println("	conn: " + conn.isClosed());
			}
			return drink;


		}catch(Exception e){
			e.printStackTrace();
			try {
				rs.close();
				smt.close();
				conn.close();
				if (!(rs.isClosed() && smt.isClosed() && conn.isClosed())){
					System.out.println("drink find exception is not closed");
					System.out.println("	rs: " + rs.isClosed());
					System.out.println("	smt: " + smt.isClosed());
					System.out.println("	conn: " + conn.isClosed());
				}
			} catch (SQLException se) {
				se.printStackTrace();
			}
			return null;
		}
	}

	public Drink[] searchIngredients(String request) {
		System.out.print("ingredient searching");
		StringBuilder searchString = new StringBuilder("%" + request + "%");
		for (int i = 0; i < request.length(); i++) {
			if (searchString.charAt(i) == ' ') {
				searchString.setCharAt(i, '%');
			}
		}
		System.out.println("Search String: "+searchString);
		try{
			
			String query = "SELECT * FROM "+ this.database+".drink d "+
				"where d.drinkId in (select drink_id from "+ this.database+".drink_ingredient where ingredient like \""+searchString+"\")";
			System.out.println(query);
			rs = smt.executeQuery(query);

			//ArrayList<Ingredient> ingredients = new ArrayList<Ingredient>();
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
					"FROM "+ this.database+".drink_ingredient " +
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
				rs2.close();
				smt2.close();
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				Drink d = new Drink(drinkId, dName, description,  ingreds, stockPhoto, likes, dislikes, publisher);
				drink.add(d);


			}
			rs.close();
			smt.close();
			conn.close();
			//add to Array
			Drink[] outDrink = new Drink[drink.size()];
			outDrink = drink.toArray(outDrink);
			return outDrink;

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
		int topResultId = 0;
		int matchFlag = -1;
		int mostLikeId = 0;
		int mostLikes = -1;

		System.out.println(searchString);
		try {
	
			String query = "";
			if ( flag == 0 )
				query = "Select * FROM "+ this.database+".drink WHERE name LIKE \"" + searchString + "\"";
			else if ( flag == 1 )
				query = "Select * FROM "+ this.database+".drink WHERE name LIKE \"" + searchString + "\" and publisher = \"IBA_Official\"";
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

				if ( dName.toLowerCase().equals(request.toLowerCase().trim()) && matchFlag != 1) {
					System.out.println("***********************************\nSearch = result exactly!\n********************");
					topResultId = drinkId;
					matchFlag = 1;
				} else if ( matchFlag != 1 ) {
					//record drink with most likes
					if ( likes > mostLikes ) {
						mostLikes = likes;
						mostLikeId = drinkId;
					}
				}
				
				String query_ingreds = "SELECT quantity, measurement, ingredient " +
					"FROM "+ this.database+".drink_ingredient " +
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
				rs2.close();
				smt2.close();
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				Drink d = new Drink(drinkId, dName, description,  ingreds, stockPhoto, likes, dislikes, publisher);
				drink.add(d);


			}
			
			rs.close();
			smt.close();
			conn.close();
			//ArrayList<Drink> similar = new ArrayList<Drink>();
			if ( matchFlag == 1 ) {
				System.out.println("Perfect match detected!!!!!!!!!!!!!!!!!!!!!!\nDrinkID: "+topResultId);
				topResultDrinkId = topResultId;
				//similar = getSimilarDrinks(topResultId);
			} else {
				System.out.println("No perfect match: mostliked: "+mostLikes+" and id: "+mostLikeId+" and drink size: "+drink.size());
				topResultDrinkId = mostLikeId;
				if (mostLikeId == 0 && drink.size() != 0) {
					topResultDrinkId = drink.get(0).id;
					System.out.println("OUTPUT: "+drink.get(0).name);
				}
				//similar = getSimilarDrinks(mostLikeId);
			}
			
			
			

			Drink[] outDrink = new Drink[drink.size()];
			outDrink = drink.toArray(outDrink);
			return outDrink;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	public Drink[] getSimilarDrinks() {
		ArrayList<Drink> sim = new ArrayList<Drink>();

		try{
			String query = "SELECT d.drinkId, d.name, d.stockPhoto, d.description, d.likes, d.dislikes, d.publisher "+
				"FROM "+ this.database+".drink d, "+ this.database+".drink_tags dt "+
				"where tag_id in (select tag_id from "+ this.database+".drink_tags dt2 where dt2.drink_id = \""+topResultDrinkId+"\") "+
				"and d.drinkId = dt.drink_id";

			System.out.println(query);
			rs = smt.executeQuery(query);
		
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
					"FROM "+ this.database+".drink_ingredient " +
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
				rs2.close();
				smt2.close();
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				Drink d = new Drink(drinkId, dName, description,  ingreds, stockPhoto, likes, dislikes, publisher);
				sim.add(d);

			}
			//sort through similar drinks
			//Pair<Drink, int> p = new Pair<Drink, int>(sim.get(1), 1);
			Map<Drink, Integer> p = new HashMap<Drink, Integer>();
			ArrayList<Drink> newL = new ArrayList<Drink>();
			//p.put(sim.get(1), 1);
			for (int x = 0; x < sim.size(); x++)
			{
				Drink d = sim.get(x);
				int containsFlag=0;
				for (int a =0; a<newL.size();a++){
					if(newL.get(a).id == d.id){
						containsFlag = 1;
						break;
					}
				}
				if(containsFlag==1)
					continue;

				int id = d.id;
				int count = 1;

				if (x == sim.size() - 1) {
					p.put(sim.get(x), 1);
					continue;
				}

				for (int y = x+1; y < sim.size(); y++) {
					if (sim.get(y).id == id) {
						//multiple found
						count++;
					}
				}
				System.out.println("Drink added: "+sim.get(x).name+", and count: "+count);

				p.put(sim.get(x), count);
				newL.add(d);
			}
			

			Set< Map.Entry<Drink, Integer> > st = p.entrySet();
			for (Map.Entry<Drink, Integer> me:st) {
				System.out.print(me.getKey().name+":");
				System.out.println(me.getValue());
			}

			LinkedHashMap<Drink, Integer> sortedList = new LinkedHashMap<>();
			p.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).forEachOrdered(x -> sortedList.put(x.getKey(), x.getValue()));
			System.out.println("SORTED MAP: "+sortedList);
 
			ArrayList<Drink> finalSorted = new ArrayList<Drink>();
			Set<Drink> keys = sortedList.keySet();
			for(Drink k:keys){
				finalSorted.add(k);
			}
			rs.close();
			smt.close();
			conn.close();
			Drink[] outDrink = new Drink[finalSorted.size()];
			outDrink = finalSorted.toArray(outDrink);
			return outDrink;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	public boolean insertDrink(Drink d){
		System.out.println("inserting");
		try {
			//check if user already added dirnk
			String query = "INSERT into "+ this.database+".drink "+
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
				query += "INSERT INTO "+ this.database+".drink_ingredient (username, drink_id, ingredient, measurement, quantity) "+
				"VALUES "+
				"(\""+d.publisher+"\", \""+id+"\", \""+i.ingredient+"\", \"" + i.measurement+"\", \""+ i.quantity+"\");";
				Statement smt2 = conn.createStatement();
				success = smt2.executeUpdate(query);
				if (success == 0) {
					System.out.println("add ingredients fail");
					return false;
				}
				smt2.close();
			}

			String query3 = "select drinkId from "+this.database+".drink where publisher = \""+d.publisher+"\" and name = \""+d.name+"\"";
			rs = smt.executeQuery(query3);

			int retPostId = 0;
			while(rs.next())
			{
				retPostId = rs.getInt("drinkId");
			}
			System.out.println("RECENT DRINK ID***: "+retPostId);
			recentDrinkId = retPostId;

			rs.close();

			smt.close();
			conn.close();
			
		} catch (Exception e) {
			System.out.println("fail");
			e.printStackTrace();
		}
		return true;
	}

	public String notifyUser(int drinkId, String publisher) {
		try {
			String query1 = "select followingUserId from "+this.database+".user_followers where userId = (select userId from "+ this.database+".user where userName = \""+publisher+"\")";
			System.out.println("Follower query: "+query1);

			rs=smt.executeQuery(query1);

			ArrayList<Integer> followList = new ArrayList<Integer>();

			while (rs.next()) {
				followList.add(rs.getInt("followingUserId")); 
			}

			rs.close();
			//addRows to post_notif database
			String query2 = "";
			for ( int x = 0; x <followList.size(); x++){
				query2 = "insert into "+ this.database+".post_notification (postId, followerUserId, drinkFlag) values ('"+drinkId+"', '"+followList.get(x)+"', 1)";
				int updateResult = smt.executeUpdate(query2);
				
				if(updateResult == 0) {
					return "{ \"status\" : \"Error: SQL update failed.\"}";
				}
			}


			smt.close();
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
			String query = "delete from "+this.database+".post_notification where postId = \""+postId+"\" and followerUserId = (select userId from "+ this.database+".user where userName = \""+username+"\") and drinkFlag = 1";
			System.out.println(query);

			int result2 = smt.executeUpdate(query);

			smt.close();
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


	public String[] getDrinkNamesStartingWith(char let){
		System.out.println("Getting drinks starting with " + let);
		ArrayList<String> dnames = new ArrayList<>();

		try {
			String query = "SELECT DISTINCT d.name, d.publisher " +
			"FROM "+ this.database+".drink d "+
			"WHERE d.name like \""+let+"%\" " + 
			"ORDER BY d.name ASC";

			rs = smt.executeQuery(query);
			while (rs.next()) {
				dnames.add(rs.getString("name"));
				dnames.add(rs.getString("publisher"));
			}
			rs.close();
			smt.close();
			conn.close();
		} catch (Exception e) {


		}
		String[] outDrink = new String[dnames.size()];
		outDrink = dnames.toArray(outDrink);

		return outDrink;
	}

	public Drink[] getRecommended(String username){
		try {

			String query = "Select d.name, d.publisher, d.stockPhoto, d.description, d.drinkId, d.likes, d.dislikes"+
			" FROM "+ this.database+".drink_recommendation dr, "+ this.database+".user u, "+ this.database+".drink d WHERE u.userName = '" + username + "' AND dr.user_id = u.userId AND d.drinkId = dr.drink_id";
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
					"FROM "+ this.database+".drink_ingredient " +
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
				rs2.close();
				smt2.close();
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				Drink d = new Drink(drinkId, dName, description,  ingreds, stockPhoto, likes, dislikes, publisher);
				System.out.println(d.toString());
				drink.add(d);


			}
			rs.close();
			smt.close();
			conn.close();
			Drink[] outDrink = new Drink[drink.size()];
			outDrink = drink.toArray(outDrink);
			return outDrink;
		} catch (Exception e) {
			return null;
		}
	}

	public String likeDrink(int drinkId, String toggle){
		String query = "";
		try{
			if (toggle.equals("on")){
				query = "update "+ this.database+".drink set likes = likes + 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("off")){
				query = "update "+ this.database+".drink set likes = likes - 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("flip")){
				query = "update "+ this.database+".drink set likes = likes + 1, dislikes = dislikes - 1 where drinkId = \""+drinkId+"\"";
			}
			int updateResult = smt.executeUpdate(query);

			rs = smt.executeQuery("select * from "+ this.database+".drink where drinkId = \""+drinkId+"\"");
			int updatedLikes = -1;
			int updatedDislikes = -1;
			while (rs.next()){
				updatedLikes = rs.getInt("likes");
				updatedDislikes = rs.getInt("dislikes");
			}
			rs.close();
			smt.close();
			conn.close();
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
				query = "update "+ this.database+".drink set dislikes = dislikes + 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("off")){
				query = "update "+ this.database+".drink set dislikes = dislikes - 1 where drinkId = \""+drinkId+"\"";
			}else if (toggle.equals("flip")){
				query = "update "+ this.database+".drink set likes = likes - 1, dislikes = dislikes + 1 where drinkId = \""+drinkId+"\"";
			}
			
			int updateResult = smt.executeUpdate(query);

			rs = smt.executeQuery("select * from "+ this.database+".drink where drinkId = \""+drinkId+"\"");
			int updatedLikes = -1;
			int updatedDislikes = -1;
			while (rs.next()){
				updatedLikes = rs.getInt("likes");
				updatedDislikes = rs.getInt("dislikes");
			}
			rs.close();
			smt.close();
			conn.close();
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
//rod adition test
	public Drink getDrink(int drinkId){
		try {
			Drink drink = new Drink();
			String query = "SELECT * from "+ this.database+".drink where drinkId = "+ drinkId ;
			System.out.println(query);
			rs = smt.executeQuery(query);
			// Drink drink = new Drink();
			while (rs.next()) {
			//int drinkId=rs.getInt("drinkId");
				String drinkName=rs.getString("name");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				String owner=rs.getString("publisher");
				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");

				String query_ingreds = "SELECT quantity, measurement, ingredient " +
					"FROM "+ this.database+".drink_ingredient " +
					"WHERE drink_id = "+ drinkId + " AND username = \"" + owner + "\"";
				//System.out.println(query_ingreds);
				Statement smt2 = conn.createStatement();
				ResultSet rs2 = smt2.executeQuery(query_ingreds);
				ArrayList<Ingredient> ii = new ArrayList<>();
				Ingredient[] ingreds;
				while (rs2.next()){
					ii.add(new Ingredient(rs2.getString("quantity"),rs2.getString("measurement"),rs2.getString("ingredient")));
				}
				rs2.close();
				smt2.close();
				if (!(rs2.isClosed() && smt2.isClosed())){
					System.out.println("ingredient find is not closed");
				}
				ingreds = new Ingredient[ii.size()];
				ingreds = ii.toArray(ingreds);
				drink = new Drink(drinkId, drinkName, description,  ingreds, stockPhoto, likes, dislikes, owner);

				System.out.println(drink);
			}
			
			rs.close();
			smt.close();
			conn.close();
				
			if (!(rs.isClosed() && smt.isClosed() && conn.isClosed())){
				System.out.println("getdrinkbyid is not closed");
				System.out.println("	rs: " + rs.isClosed());
				System.out.println("	smt: " + smt.isClosed());
				System.out.println("	conn: " + conn.isClosed());
			}
			return drink;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
	public ArrayList<Drink> getPublishedDrinks(String user){
		try {
			ArrayList<Drink> drinks = new ArrayList<Drink>();
			Drink drink = new Drink();
			String query = "select * from test_schema.drink where publisher = '"+ user + "'" ;
			System.out.println(query);
			rs = smt.executeQuery(query);

			while (rs.next()) {
				int drinkId=rs.getInt("drinkId");
				String drinkName=rs.getString("name");
				String stockPhoto=rs.getString("stockPhoto");
				String description=rs.getString("description");
				String owner=user;
				int likes=rs.getInt("likes");
				int dislikes=rs.getInt("dislikes");
	
				String query_ingreds = "SELECT quantity, measurement, ingredient " +
					"FROM test_schema.drink_ingredient " +
					"WHERE drink_id = "+ drinkId + " AND username = \"" + owner + "\"";
				//System.out.println(query_ingreds);
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
				drinks.add(drink);
			}
			conn.close();
			return drinks;
		} catch (Exception e){
			System.out.println("oof");
			return null;
		}
	}

//end of rod stuff

	public Statement getSmt(){
		return this.smt;
	}
	
	public Connection getConn(){
		return this.conn;
	}


	public Drink[] getTopLikedDrinks(){
		try {
		//get 15 most likeDrink
		String query = "SELECT * FROM test_schema.drink ORDER BY likes DESC LIMIT 15";
		System.out.println(query);

		rs = smt.executeQuery(query);

		ArrayList<Drink> drink = new ArrayList<Drink>();
		while (rs.next()) {
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

		//remove drinks with 0 likesi n list
		ArrayList<Drink> retList = new ArrayList<Drink>();
		for (int x = 0; x<drink.size(); x++) {
			if (drink.get(x).likes != 0) {
				System.out.println("Returning: "+drink.get(x).name);
				retList.add(drink.get(x));
			}
		}


		conn.close();
		//add to Array
		Drink[] outDrink = new Drink[retList.size()];
		outDrink = retList.toArray(outDrink);
		return outDrink;


		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	/*
	
			String query = "SELECT * FROM test_schema.drink d "+
				"where d.drinkId in (select drink_id from test_schema.drink_ingredient where ingredient like \""+searchString+"\")";
			System.out.println(query);
			rs = smt.executeQuery(query);

			//ArrayList<Ingredient> ingredients = new ArrayList<Ingredient>();
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
			//add to Array
			Drink[] outDrink = new Drink[drink.size()];
			outDrink = drink.toArray(outDrink);
			return outDrink;
*/

//	public String removeLikeDrink(int drinkId, int flag){
//		try{
//			String query = "";
//
//			if (flag==1)
//				query = "update "+ this.database+".drink set likes = likes - 1 where likes > 0 and drinkId = \""+drinkId+"\"";
//			else if (flag==-1)
//				query = "update "+ this.database+".drink set dislikes = dislikes - 1 where dislikes > 0 and drinkId = \""+drinkId+"\"";
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

	public Integer[] getOldDrinks(){
		ArrayList<Integer> oDrinks = new ArrayList<>();
		try {
			
			String query = "SELECT * FROM " + this.database + ".dotd";
			rs = smt.executeQuery(query);
			while (rs.next()) {
				oDrinks.add(rs.getInt("drinkId"));
			}
			rs.close();
			smt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
			try {
				rs.close();
				smt.close();
				conn.close();
			} catch (SQLException se) {
				se.printStackTrace();
			}

		}
		Integer[] oldDotd = new Integer[oDrinks.size()];
		oldDotd = oDrinks.toArray(oldDotd);
		return oldDotd;
	}
	public boolean addDOTD(boolean trunc_flag, int drink_id) {
		try {
			String query;
			if (trunc_flag) {
				query = "TRUNCATE table " + this.database + ".dotd";
				smt.executeUpdate(query);
			}
			query = "INSERT INTO " + this.database + ".dotd (drinkId) VALUES (" + drink_id + ");";
			smt.executeUpdate(query);
			smt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
			try {
				smt.close();
				conn.close();
			} catch(SQLException se) {
				se.printStackTrace();
			}
		}
		return true;
	}
	public Drink getDOTD(){
		System.out.println("Setting Drink of the Day");
		try {
			String query = "SELECT * FROM "+ this.database+".dotd dt, "+this.database+".drink d, "+this.database +".drink_ingredient di" +
				" WHERE dt.drinkId = d.drinkId AND dt.iddotd = (SELECT MAX(iddotd) FROM "+this.database+".dotd) AND di.drink_id = d.drinkId";
			rs = smt.executeQuery(query);
			Drink d;
			boolean f = true;
			ArrayList<Ingredient> ii = new ArrayList<>();
			String name = "";
			String des = "";
			int drinkId = 0;
			String photo = "";
			int likes = 0;
			int dislikes = 0;
			String publisher = "";

			while (rs.next()) {
				if (f) {
					f = false;
					name = rs.getString("name");
					des = rs.getString("description");
					drinkId = rs.getInt("drinkId");
					photo = rs.getString("stockPhoto");
					likes = rs.getInt("likes");
					dislikes = rs.getInt("dislikes");
					publisher = rs.getString("publisher");
				}
				ii.add(new Ingredient(rs.getString("quantity"), rs.getString("measurement"), rs.getString("ingredient")));
				
				//Drink(int id, String name, String description, Ingredient[] ingredients, String photo, int likes, int dislikes, String publisher)
			}
			
			Ingredient[] ingred = new Ingredient[ii.size()];
			ingred = ii.toArray(ingred);
			rs.close();
			smt.close();
			conn.close();
			d = new Drink(drinkId, name, des, ingred, photo, likes, dislikes, publisher);
			return d;
		} catch (Exception e) {
			e.printStackTrace();
			
			try {
				if (rs != null) {
					rs.close();
				}
				smt.close();
				conn.close();
				return new Drink(-1, "Add Your Drink!", "Describe Your Drink!", new Ingredient[]{new Ingredient("What's in it?","","")}, "", 0,0,"Could be you!");
			} catch (SQLException se) {
				se.printStackTrace();
				return new Drink(-1, "Add Your Drink!", "Describe Your Drink!", new Ingredient[]{new Ingredient("What's in it?","","")}, "", 0,0,"Could be you!");
			}
			
		}
	}
	public void updateLookedAt(int drinkid){
		try {
			String query = "UPDATE " + this.database + ".drink SET lookedUp = lookedUp + 1 " +
				"WHERE drinkId = " + drinkid;
			smt.executeUpdate(query);
			//closes in getDrink(dname, publisher)
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Drink[] getTrending(){
		System.out.println("Getting trending drinks");
		ArrayList<Drink> dnames = new ArrayList<>();

		try {
			String query = "SELECT * FROM " + this.database + ".drink " +
				"ORDER BY lookedUp DESC LIMIT 10";

			rs = smt.executeQuery(query);
			while (rs.next()) {
				dnames.add(
					new Drink(
						rs.getInt("drinkId"),
						rs.getString("name"),
						rs.getString("description"),
						new Ingredient[]{new Ingredient("","","")},
						rs.getString("stockPhoto"),
						rs.getInt("likes"),
						rs.getInt("dislikes"),
						rs.getString("publisher")
					)
				);
				//Drink(int id, String name, String description, Ingredient[] ingredients, String photo, int likes, int dislikes, String publisher)
			}
			rs.close();
			smt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
			try {
				if (rs != null) {
					rs.close();
				}
				smt.close();
				conn.close();
			} catch (SQLException se) {
				se.printStackTrace();
			}

		}
		Drink[] outDrink = new Drink[dnames.size()];
		outDrink = dnames.toArray(outDrink);
		
		return outDrink;
	}

	public String editDrink(Drink d){
		try {
			smt.close();
			String query = "UPDATE " + this.database + ".drink SET name = ?, description = ?" + ((d.photo.equals("")) ? " " : ", stockPhoto = ? ") +
				"WHERE drinkId = ?";
			System.out.println(query);
			PreparedStatement psmt_temp = conn.prepareStatement(query);
			psmt_temp.setString(1, d.name);
			psmt_temp.setString(2, d.description);
			
			if (d.photo.equals("")){
				psmt_temp.setInt(3, d.id);
			} else {
				psmt_temp.setString(3, d.photo);
				psmt_temp.setInt(4, d.id);
			}
			
			System.out.println(d.toString());
			int status = psmt_temp.executeUpdate();
			psmt_temp.close();
			conn.close();
			String msg = "";
			if (status == 1) {
				msg = "{ status: 'ok'}";
			} else {
				msg =  "{ status: 'error updating drink'}";
			}
			System.out.println(msg + " status: " +status);
			return msg;
		} catch (Exception e) {
			e.printStackTrace();
			try {
				if (rs != null) {
					rs.close();
				}
				smt.close();
				conn.close();
			} catch (SQLException se) {
				se.printStackTrace();
			}
			return "{ 'status': 'error updating drink'}";
		}
	}

}