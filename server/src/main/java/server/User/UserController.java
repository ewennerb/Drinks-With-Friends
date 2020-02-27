package server.User;

import org.springframework.web.bind.annotation.*;
import server.SQL.UserSQL;
import java.util.ArrayList;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="/user")
public class UserController {

    @GetMapping("/user")
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

    @GetMapping("/user/{name}")
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

    @PostMapping("/")

    public String saveUser(@RequestBody String username) {
        //save a single user
		System.out.println("Inserting user: "+ username);
		
		UserSQL users = new UserSQL();
		//users.insertUser(name, "testInsP1", "testInsNme1", "testInsEmail1", "testInsPhone1");	

        return true;
    }

    @DeleteMapping("/{name}")
    public String deleteUser() {
        //find a single user
        return "success";
    }
}