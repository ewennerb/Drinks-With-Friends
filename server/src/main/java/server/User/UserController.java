package server.User;

import org.springframework.web.bind.annotation.*;
import server.SQL.UserSQL;

@RestController
@RequestMapping(path="/user")
public class UserController {

    @GetMapping("/user")
    public String findAll() {
        //find a single user
		UserSQL users = new UserSQL();
		return users.getAllUsers();

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
        return "success";
    }

    @DeleteMapping("/{name}")
    public String deleteUser() {
        //find a single user
        return "success";
    }
}