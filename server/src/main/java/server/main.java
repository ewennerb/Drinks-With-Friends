package server;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;
import java.sql.*;

@RestController
@SpringBootApplication
public class main {

    @RequestMapping("/")
	//@CrossOrigin(origins = "http://localhost:3000") 	//test
	@CrossOrigin(origins = "http://localhost:3000")		//deployment
    String home() {
	
	try{
		//String url = "jdbc:mysql://localhost:3306/";	//test
		String url = "jdbc:mysql://us-cdbr-iron-east-01.cleardb.net"; 	//deployment
		Connection conn = DriverManager.getConnection(url, "b222c9ba444ad7", "f701e5a8"); //deployment
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