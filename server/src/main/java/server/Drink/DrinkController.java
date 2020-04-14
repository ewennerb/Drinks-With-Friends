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
    public String findAll() 
			throws JsonParseException, JsonMappingException, IOException {
        // find a single drink
        DrinkSQL drinks = new DrinkSQL();
        /*ArrayList<Drink> list = test.getAllDrinks();
        String out = "";
        for (Drink drink : list) {
            out += drink.id + "\t";
            out += drink.name + "\t";
            out += drink.photo + "\t";
            out += drink.description + "\t";
            out += drink.likes + "\t";
            out += drink.dislikes + "\t";
            out += drink.publisher + "<br>";
        }*/


		ObjectMapper om2 = new ObjectMapper();
		SimpleModule sm2 = new SimpleModule("DrinkSerializer", new Version(1, 0, 0, null, null, null));
		sm2.addSerializer(Drink.class, new DrinkSerializer());
		om2.registerModule(sm2);

        return om2.writeValueAsString(drinks.getAllDrinks());
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
        Drink[] drinkss = ds.searchDrink(request, 0);
        
		int topId = ds.topResultDrinkId;
        ds = new DrinkSQL();
		ds.topResultDrinkId = topId;
		Drink[] drinks = ds.getSimilarDrinks();
        if (drinkss == null) {
            return "{\"results\": \"DNE\"";
        }

		ArrayList<Drink> similarNoReplicate = new ArrayList<Drink>();
		
		for (int x = 0; x < drinks.length; x++){
			int flag = 0;
			for (int y = 0; y<drinkss.length; y++){
				if ( drinks[x].id == drinkss[y].id) {
					flag=1;
					break;
				}
			}
			if (flag!=1){
				similarNoReplicate.add(drinks[x]);
			}
		}
	
		Drink[] outDrink = new Drink[similarNoReplicate.size()];
		outDrink = similarNoReplicate.toArray(outDrink);

        String out = "{ \"results\": [";
        for (Drink drink : drinkss) {
            out += new ObjectMapper().writeValueAsString(drink) + ",";
        }
        out = out.substring(0, out.length()-1);  //], similar: [sdfsad ] }
        
		//need conditional flag for similar
		if ( drinks.length != 0 ) {
			out +=" ], \"similarDrinks\": [ ";
			for (Drink drink : outDrink) {
            out += new ObjectMapper().writeValueAsString(drink) + ",";
			}
			out = out.substring(0, out.length()-1) + "] }";
			return out;
		} 
        
		out = out.substring(0, out.length()-1) + "} ], \"similarDrinks\": [] }";
        
        return out;
    }

	@GetMapping("/searchOfficialDrink")
    public String searchOfficialDrink(@RequestParam(name = "s") String request) throws JsonProcessingException {
        DrinkSQL ds = new DrinkSQL();
        Drink[] drinkss = ds.searchDrink(request, 1);

		Drink[] drinks = ds.getSimilarDrinks();
        if (drinkss == null) {
            return "{\"results\": \"DNE\"";
        }

		ArrayList<Drink> similarNoReplicate = new ArrayList<Drink>();
		
		for (int x = 0; x < drinks.length; x++){
			int flag = 0;
			for (int y = 0; y<drinkss.length; y++){
				if ( drinks[x].id == drinkss[y].id) {
					flag=1;
					break;
				}
			}
			if (flag!=1){
				similarNoReplicate.add(drinks[x]);
			}
		}
	
		Drink[] outDrink = new Drink[similarNoReplicate.size()];
		outDrink = similarNoReplicate.toArray(outDrink);

        String out = "{ \"results\": [ ";
        for (Drink drink : drinkss) {
            out += new ObjectMapper().writeValueAsString(drink) + ",";
        }
        out = out.substring(0, out.length()-1);

		if ( drinks.length != 0 ) {
			out +=" ], \"similarDrinks\": [ ";
			for (Drink drink : outDrink) {
            out += new ObjectMapper().writeValueAsString(drink) + ",";
			}
			out = out.substring(0, out.length()-1) + "] }";
			return out;
		}
		out = out.substring(0, out.length()-1) + "} ], \"similarDrinks\": [] }";
        
        return out;
    }

	@GetMapping("/searchIngredients")
	public String searchIngredients(@RequestParam(name = "s") String request) throws JsonProcessingException {
		DrinkSQL ds = new DrinkSQL();
		Drink[] ingreds = ds.searchIngredients(request);
		if(ingreds == null)
			return "{\"results\": \"DNE\"";

		String out =  "{ \"results\": [ ";
		for (Drink ingredient : ingreds) {
			out += new ObjectMapper().writeValueAsString(ingredient) + ",";
		}
		out = out.substring(0, out.length()-1) + "] }";

		return out;
	}

	@GetMapping("/mostLiked")
	public String getMostLikesDrinks() throws JsonProcessingException {
		DrinkSQL ds = new DrinkSQL();
		Drink[] mostLikedDrinks = ds.getTopLikedDrinks();
		
		if (mostLikedDrinks == null) {
			return "{\"results\": \"DNE\"";
		}

		String out = "{ \"results\": [ ";
		for (Drink d : mostLikedDrinks) {
			out += new ObjectMapper().writeValueAsString(d) + ",";
		}
		out = out.substring(0, out.length()-1) + "] }";

		return out;
	}

    @GetMapping("/all/{letter}") 
    public String requestAll(@PathVariable String letter) {
        DrinkSQL ds = new DrinkSQL();
        String[] names = ds.getDrinkNamesStartingWith(letter.charAt(0));

        String out = "{ \"results\": [ ";
        if (names.length == 0) {
            return out + "]}";
        }

        for (int i = 0; i < names.length; i+=2) {
            out += "{ \"name\": \"" + names[i] + "\", \"publisher\": \"" + names[i+1]+ "\"},"; 
        }
        
        out = out.substring(0, out.length()-1) + "] }";
        return out;
    }

    @GetMapping("/getUserRecommended/{username}")
    public String getUserRecommended(@PathVariable String username)  throws JsonProcessingException {
        DrinkSQL ds = new DrinkSQL();
        Drink[] drinks = ds.getRecommended(username);
        String out = "{ \"results\": [ ";
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
            DOTD = new Drink(-1, "Add Your Drink!", "Describe Your Drink!", new Ingredient[]{new Ingredient("Whats in it?","","")}, "", 0,0,"Could be you!");
            //public Drink(int id, String name, String description, Ingredient[] ingredients, String photo, int likes, int dislikes, String publisher){
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

    @Scheduled(cron = "0 30 7 * * *")
    public void runTaggingRecommend(){
        //1 * * * * *
        
        try {
            Process p = Runtime.getRuntime().exec("py ../ml/main.py 1"); //production
            //Process p = Runtime.getRuntime().exec("py ../ml/main.py 0"); //development
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            System.out.println("Tags updated/ drink recommendation updated");
        }
    }
	//TODO merge like drink with user liking drink
/*	@PostMapping("/like")
	public String likeDrink(@RequestBody String drinkName)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("DrinkDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Drink.class, new DrinkDeserializer());
		om.registerModule(sm);
		Drink d = om.readValue(drinkName, Drink.class);

		DrinkSQL ds = new DrinkSQL();
		System.out.println("DrinkName: "+d.name+", Owner: "+d.publisher);

		return ds.likeDrink(d.name, d.publisher);


	}

	@PostMapping("/dislike")
	public String dislikeDrink(@RequestBody String drinkName)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("DrinkDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Drink.class, new DrinkDeserializer());
		om.registerModule(sm);
		Drink d = om.readValue(drinkName, Drink.class);

		DrinkSQL ds = new DrinkSQL();
		System.out.println("DrinkName: "+d.name+", Owner: "+d.publisher);

		return ds.dislikeDrink(d.name, d.publisher);


	}

	@PostMapping("/removeLike")
	public String removeLikeDrink(@RequestBody String drinkName)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("DrinkDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Drink.class, new DrinkDeserializer());
		om.registerModule(sm);
		Drink d = om.readValue(drinkName, Drink.class);

		DrinkSQL ds = new DrinkSQL();
		System.out.println("DrinkName: "+d.name+", Owner: "+d.publisher);

		return ds.removeLikeDrink(d.name, d.publisher, 1);


	}

	@PostMapping("/removeDislike")
	public String removeDislikeDrink(@RequestBody String drinkName)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("DrinkDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Drink.class, new DrinkDeserializer());
		om.registerModule(sm);
		Drink d = om.readValue(drinkName, Drink.class);

		DrinkSQL ds = new DrinkSQL();
		System.out.println("DrinkName: "+d.name+", Owner: "+d.publisher);

		return ds.removeLikeDrink(d.name, d.publisher, -1);


	}*/
}