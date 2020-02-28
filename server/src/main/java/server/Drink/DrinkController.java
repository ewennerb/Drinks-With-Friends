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
        randomDOTD();
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

    @GetMapping("/{username}")
    @ResponseBody
    public String findDrink(@PathVariable String username, @RequestParam(name = "d") String dname) throws JsonProcessingException {
        // find a single drink
        DrinkSQL ds = new DrinkSQL();
        Drink d = ds.getDrink(dname, username);
        if (d == null) {
            return "{ \"status\": \"DNE\"}";
        }
        return new ObjectMapper().writeValueAsString(d);
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
        if (ds.insertDrink(d)){
            return true;
        }
        return false;
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

    @GetMapping("/search")
    public String searchDrink(@RequestParam(name = "s") String request) throws JsonProcessingException {
        DrinkSQL ds = new DrinkSQL();
        Drink[] drinks = ds.searchDrink(request);
        if (drinks == null) {
            return "{\"results\": \"DNE\"";
        }
        String out = "{ \"results\": [";
        for (Drink drink : drinks) {
            out += new ObjectMapper().writeValueAsString(drink) + ",";
        }
        out = out.substring(0, out.length()-1) + "] }";
        
        return out;
    }

    @Scheduled(cron = "0 0 7 * * *")
    public void randomDOTD(){
        System.out.println("New Drink of the Day");
        DrinkSQL ds = new DrinkSQL();
        
        ArrayList<Drink> drinks = ds.getAllDrinks();
        if (drinks.size() <= 0) {
            oldDOTD = new ArrayList<>();
            System.out.println("No drinks in db");
            return;
        }
        if (oldDOTD.size() > 31 || oldDOTD.size() == drinks.size()){   //31 drinks per month that can't be repeated or its the max amount in the database            
            if (oldDOTD.size() == drinks.size()){
                System.out.println("Maxed out drinks in db");
            } else {
                System.out.println("a month of drinks has passed drinks in db");
            }
            oldDOTD = new ArrayList<>();
        }
        Random r = new Random(1);
        int pos = r.nextInt(drinks.size());
        while (oldDOTD.contains(drinks.get(pos).name)){
            drinks.remove(pos);
            pos = r.nextInt(drinks.size());

        }
        DOTD = drinks.get(pos);
        if (DOTD != null){
            oldDOTD.add(DOTD.name);
        }
        System.out.println(DOTD.name + " by "+ DOTD.publisher);
        
        
    }
}