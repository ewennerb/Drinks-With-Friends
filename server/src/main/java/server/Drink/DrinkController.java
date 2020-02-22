package server.Drink;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import server.SQL.DrinkSQL;

@RestController
public class DrinkController {

    private ArrayList<String> DOTD;
	


    DrinkController(ArrayList<String> dotd) {
        this.DOTD = dotd;
    }

    

    @GetMapping("/drinks")
    public String findAll() {
        //find a single drink
		DrinkSQL test = new DrinkSQL();
		return test.getAllDrinks();
    }

    @GetMapping("/drinks/{name}")
    public String findDrink(@PathVariable String name) {
        //find a single drink
		System.out.println("Drink: "+ name);
		DrinkSQL drink = new DrinkSQL();
        return drink.getDrink(name);
    }

    @PostMapping("/drinks")
    public String saveDrink(@RequestBody String savedDrink) {
        //save a single drink
        return "success";
    }

    @DeleteMapping("/drinks/{name}")
    public String deleteDrink() {
        //find a single drink
        return "drink";
    }

    @GetMapping("/drinks/dotd")
    public String drinkOfTheDay() {
        //pull the drink of the day
        return "drink";
    }
}