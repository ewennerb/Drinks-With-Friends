package server;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;
import java.sql.*;

@RestController
@SpringBootApplication
public class main {

    @RequestMapping("/")
    String home() {
	
	try{
		String url = "jdbc:mysql://localhost:3306/";
		Connection conn = DriverManager.getConnection(url, "root", "1234DrinksWithFriends");
		Statement smt = conn.createStatement();
		ResultSet rs = smt.executeQuery("select * from test_schema.user");
		String all="UserName\n\nPassword<br>";
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

    }

    public static void main(String[] args) {
        SpringApplication.run(main.class, args);
    }

}