package server.User;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import server.SQL.UserSQL;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="/user")
public class UserController {

    @GetMapping("")
    public String findAll() {
        //find a single user
		UserSQL users = new UserSQL();
		ArrayList<User> list = users.getAllUsers();
		String out = "";
		for (User user : list) {
			out += user.userId + "\t";
			out += user.darkMode + "\t";
			out += user.userName + "\t";
			out += user.password + "\t";
			out += user.name + "\t";
			out += user.email + "\t";
			out += user.phoneNumber + "\t";
			out += user.photo + "\t";
			out += user.bio + "\t";
			out += user.likedDrinks + "\t";
			out += user.dislikedDrinks + "\t";
			out += user.favoriteDrink + "\t";
			out += user.publishedDrinks + "\t";
			out += user.postHistory + "\t";
			out += user.friendsList + "\t";
			out += user.dateCreated + "\t";
			out += user.lastLogin + "\t";
		}
		return out;
    }

    @GetMapping("/{name}")
    public String findUser(@PathVariable String name) {
        //find a single user
		System.out.println("User: "+ name);
		UserSQL users = new UserSQL();
		//testing updatePassword - change vals to retest
		//users.updatePassword(name, "newPass", "newtestpass");
		//testing insertUser
		//users.insertUser(name, "testInsP1", "testInsNme1", "testInsEmail1", "testInsPhone1");
		//testing uniqueUserName
		//users.checkUniqueUserName(name);


        return users.getUser(name);
    }

	@GetMapping("/find/{email}")
	public String findUserNameByEmail(@PathVariable String email) 
			throws JsonParseException, JsonMappingException, IOException {
		System.out.print("testing" + email);


/*		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(email, User.class);
*/
		ObjectMapper om2 = new ObjectMapper();
		SimpleModule sm2 = new SimpleModule("UserSerializer", new Version(1, 0, 0, null, null, null));
		sm2.addSerializer(User.class, new UserSerializer());
		om2.registerModule(sm2);

		UserSQL users = new UserSQL();
		return "{ \"username\": " + om2.writeValueAsString( users.doesUserEmailExist(email) ) + "}";
	}

    @PostMapping("/")
    public boolean insertUser(@RequestBody String username) 
			throws JsonParseException, JsonMappingException, IOException {
        //save a single user
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(username, User.class);
		System.out.print(u.toString());

		UserSQL users = new UserSQL();
		users.insertUser(username, "testInsP1", "testInsNme1", "testInsEmail1", "testInsPhone1");	

        return true;
    }

    @DeleteMapping("/delete")
    public String deleteUser() {
        //find a single user
        return "success";
    }
}