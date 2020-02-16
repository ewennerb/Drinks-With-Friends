package server.Drink;

import org.springframework.web.bind.annotation.*;

@RestController
public class DrinkController {

    @GetMapping("/drinks")
    public String findAll() {
        //find a single drink
        return "ALL";
    }

    @GetMapping("/drinks/{name}")
    public String findDrink() {
        //find a single drink
        return "drink";
    }

    @PostMapping("/drinks")
    public String saveDrink(@RequestBody String savedDrink) {
        //savea single drink
        return "success";
    }

    @DeleteMapping("/drinks/{name}")
    public String deleteDrink() {
        //find a single drink
        return "drink";
    }
}