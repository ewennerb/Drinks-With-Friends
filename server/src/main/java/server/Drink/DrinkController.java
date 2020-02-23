package server.Drink;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import server.SQL.DrinkSQL;

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
		DrinkSQL test = new DrinkSQL();
		return test.getAllDrinks();
    }

    @GetMapping("/{name}")
    public String findDrink(@PathVariable String name) {
        //find a single drink
		System.out.println("Drink: "+ name);
		DrinkSQL drink = new DrinkSQL();
        return drink.getDrink(name);
    }

    @PostMapping("/")
    public String saveDrink(@RequestBody String savedDrink) {
        //save a single drink
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