package server.SQL;
import java.sql.*;


public class DrinkSQL {

	public DrinkSQL(){
	
	}


	public String getAllDrinks(){
		try{
			String url = "jdbc:mysql://localhost:3306/";
			Connection conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
			Statement smt = conn.createStatement();
			ResultSet rs = smt.executeQuery("select * from test_schema.drink");
			String all = "Drink Name<br>";

			while (rs.next())
			{
				all+=rs.getString("name");
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
	   	  
}