package server.Drink;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import server.SQL.DrinkSQL;
import java.util.Random;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

@RestController
@RequestMapping(path="/drink")
@CrossOrigin(origins = "http://localhost:3000")
@EnableScheduling
public class DrinkController {

    private ArrayList<String> oldDOTD;
    private Drink DOTD;

    DrinkController() {
        this.oldDOTD = new ArrayList<>();
    }

    @GetMapping("")
    public String findAll() {
        // find a single drink
        DrinkSQL test = new DrinkSQL();
        ArrayList<Drink> list = test.getAllDrinks();
        String out = "";
        for (Drink drink : list) {
            out += drink.id + "\t";
            out += drink.name + "\t";
            out += drink.photo + "\t";
            out += drink.description + "\t";
            out += drink.likes + "\t";
            out += drink.dislikes + "\t";
            out += drink.publisher + "<br>";
        }
        return out;
    }

    @GetMapping("/{name}")
    public Drink findDrink(@PathVariable String name) {
        // find a single drink
        System.out.println("Drink: " + name);
        DrinkSQL drink = new DrinkSQL();
        return drink.getDrink(name);
    }

    @PostMapping("/")
    public boolean insertDrink(@RequestBody String savedDrink)
            throws JsonParseException, JsonMappingException, IOException {
        // save a single drink
        ObjectMapper om = new ObjectMapper();
        SimpleModule sm = new SimpleModule("DrinkDeserializer", new Version(1,0,0, null,null,null));
        sm.addDeserializer(Drink.class, new DrinkDeserializer());
        om.registerModule(sm);
        Drink d = om.readValue(savedDrink, Drink.class);
        DrinkSQL ds = new DrinkSQL();
        ds.insertDrink(d);
        return true;
    }

    @DeleteMapping("/{name}")
    public String deleteDrink() {
        // find a single drink
        return "drink";
    }

    @GetMapping("/dotd")
    public String drinkOfTheDay() throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(DOTD);
    }
    @Scheduled(cron = "*/60 * * * * *")
    public void randomDOTD(){
        System.out.println("New Drink of the Day");
        DrinkSQL ds = new DrinkSQL();
        
        ArrayList<Drink> drinks = ds.getAllDrinks();

        if (drinks.size() <= 0) {
            oldDOTD = new ArrayList<>();
            return;
        }
        if (oldDOTD.size() > 35 || oldDOTD.size() == drinks.size()){   //35 drinks per month that can't be repeated or its the max amount in the database
            oldDOTD = new ArrayList<>();
        }
        Random r = new Random(1);
        int pos = r.nextInt(drinks.size());
        while (oldDOTD.contains(drinks.get(pos).name)){
            drinks.remove(pos);
            pos = r.nextInt(drinks.size());
        }
        DOTD = drinks.get(pos);
        System.out.println(DOTD.name + " by "+ DOTD.publisher);
        
    }
}