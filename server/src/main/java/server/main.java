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
		ResultSet rs = smt.executeQuery("select userName from test_schema.user where userId=1");
		String all="";
		while (rs.next())
		{
			all+=rs.getString("userName");
			System.out.println(all);
		}
		conn.close();
		return all;
	}catch(Exception e){
		e.printStackTrace();
		return "FAIL";
	}


        //return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(main.class, args);
    }

}