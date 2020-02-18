package server.Drink;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

@RestController
@RequestMapping(path="/drink")
public class DrinkController {

    private ArrayList<String> DOTD;

    DrinkController(ArrayList<String> dotd) {
        this.DOTD = dotd;
    }

    

    @GetMapping("/")
    public String findAll() {
        //find a single drink
        return "TESt ALL";
    }

    @GetMapping("/{name}")
    public String findDrink() {
        //find a single drink
        return "drink";
    }

    @PostMapping("/")
    public String saveDrink(@RequestBody String savedDrink) {
        //savea single drink
        return "success";
    }

    @DeleteMapping("/{name}")
    public String deleteDrink() {
        //find a single drink
        return "drink";
    }

    @GetMapping("/dotd")
    public String drinkOfTheDay() {
        //pull the drink of the day
        return "drink";
    }
}