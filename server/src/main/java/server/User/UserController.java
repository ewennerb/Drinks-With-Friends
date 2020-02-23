package server.User;

import org.springframework.web.bind.annotation.*;
import server.SQL.UserSQL;

@RestController
public class UserController {

    @GetMapping("/user")
    public String findAll() {
        //find a single user
		UserSQL users = new UserSQL();
		return users.getAllUsers();

    }

    @GetMapping("/user/{name}")
    public String findDrink(@PathVariable String name) {
        //find a single user
		System.out.println("User: "+ name);
		UserSQL users = new UserSQL();
        return users.getUser(name);
    }

    @PostMapping("/user")
    public String saveDrink(@RequestBody String username) {
        //save a single user
        return "success";
    }

    @DeleteMapping("/user/{name}")
    public String deleteDrink() {
        //find a single user
        return "success";
    }
}