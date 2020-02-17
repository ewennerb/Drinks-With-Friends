package server.User;

import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @GetMapping("/user")
    public String findAll() {
        //find a single user
        return "ALL";
    }

    @GetMapping("/user/{name}")
    public String findDrink() {
        //find a single user
        return "user";
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