package server;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;

@RestController
@SpringBootApplication
public class main {

    @RequestMapping("/")
	//@CrossOrigin(origins = "http://localhost:3000") 	//test
	@CrossOrigin //(origins = "https://fiveo-clocksomewhere.firebaseapp.com/", maxAge =  3600, allowedHeaders = "*")     //production
    String home() {
		/*
		try{
			String url = "jdbc:mysql://localhost:3306/";	//test
			url = "ofcmikjy9x4lroa2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com"; 	//deployment
			//Connection conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends"); //test
			Connection conn = DriverManager.getConnection(url, "iggb2ocyzjwrmrhp", "j9ta66pmslvbuok0"); //deployment
			Statement smt = conn.createStatement();
			String all="UserName\n\nPassword<br>";
			
			ResultSet rs = smt.executeQuery("select * from test_schema.user");
			
			while (rs.next())
			{
				all+=rs.getString("userName");
				all+="\n\n";
				all+=rs.getString("password");
				all+="<br>";
				System.out.println(all);
			}
			
			conn.close();
			return all;
		}catch(Exception e){
			e.printStackTrace();
			return "FAIL";
		}
		*/
		return "test";
    }

    public static void main(String[] args) {
        SpringApplication.run(main.class, args);
    }

}