package server.User;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="user")
public class UserController {

    @GetMapping("/")
    public String findAll() {
        //find a single user
        return "ALL";
    }

    @GetMapping("/{name}")
    public String findDrink() {
        //find a single user
        return "user";
    }

    @PostMapping("/")
    public String saveDrink(@RequestBody String username) {
        //save a single user
        return "success";
    }

    @DeleteMapping("/{name}")
    public String deleteDrink() {
        //find a single user
        return "success";
    }
}