package server.User;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import server.SQL.UserSQL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import server.SQL.DrinkSQL;
import server.Drink.Drink;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

// import com.fasterxml.jackson.databind.util.JSONPObject;
// //rod added
// import com.fasterxml.jackson.databind.JsonNode;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="/user")
public class UserController {

    @GetMapping("")
    public String findAll() {
        //find a single user
		UserSQL users = new UserSQL();
		ArrayList<User> list = users.getAllUsers();
		String out = "";
		for (User user : list) {
			out += user.userId + "\t";
			out += user.darkMode + "\t";
			out += user.userName + "\t";
			out += user.password + "\t";
			out += user.name + "\t";
			out += user.email + "\t";
			out += user.phoneNumber + "\t";
			out += user.photo + "\t";
			out += user.bio + "\t";
			out += user.likedDrinks + "\t";
			out += user.dislikedDrinks + "\t";
			out += user.favoriteDrink + "\t";
			out += user.publishedDrinks + "\t";
			out += user.postHistory + "\t";
			out += user.friendsList + "\t";
			out += user.dateCreated + "\t";
			out += user.lastLogin + "\t";
		}
		return out;
    }

    @GetMapping("/{name}")
    public String findUser(@PathVariable String name) 
			throws JsonParseException, JsonMappingException, IOException {
        //find a single user
		System.out.println("User: "+ name);
		UserSQL users = new UserSQL();
		//testing updatePassword - change vals to retest
		//users.updatePassword(name, "newPass", "newtestpass");
		//testing insertUser
		//users.insertUser(name, "testInsP1", "testInsNme1", "testInsEmail1", "testInsPhone1");
		//testing uniqueUserName
		//users.checkUniqueUserName(name);
		ObjectMapper om2 = new ObjectMapper();
		SimpleModule sm2 = new SimpleModule("UserSerializer", new Version(1, 0, 0, null, null, null));
		sm2.addSerializer(User.class, new UserSerializer());
		om2.registerModule(sm2);

        return om2.writeValueAsString(users.getUser(name));
    }

	@GetMapping("/searchUsers")
	public String searchUsers(@RequestParam(name = "s") String request) throws JsonProcessingException {
		System.out.println("SEARCHING USERS");

		UserSQL us = new UserSQL();
		User[] users = us.searchUsers(request);
		
		if(users == null) {
			return "{\"results\": \"DNE\"";
		}

		String out =  "{ \"results\": [ ";
		for (User user : users ) {
			out += new ObjectMapper().writeValueAsString(user) + ",";
		}
		out = out.substring(0, out.length()-1) + "] }";

		return out;
	}

	@GetMapping("/find/{email}")
	public String findUserNameByEmail(@PathVariable String email) 
			throws JsonParseException, JsonMappingException, IOException {
		System.out.print("testing" + email);

		ObjectMapper om2 = new ObjectMapper();
		SimpleModule sm2 = new SimpleModule("UserSerializer", new Version(1, 0, 0, null, null, null));
		sm2.addSerializer(User.class, new UserSerializer());
		om2.registerModule(sm2);

		UserSQL users = new UserSQL();
		return "{ \"username\": " + om2.writeValueAsString( users.doesUserEmailExist(email) ) + "}";
	}

    @PostMapping("/")
    public String insertUser(@RequestBody String username) 
			throws JsonParseException, JsonMappingException, IOException {
        //save a single user
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(username, User.class);
		//System.out.print(u.toString());

		UserSQL users = new UserSQL();
		String insert  = users.insertUser(u.userName, u.password, u.name, u.email, u.phoneNumber);	

	    return insert;
    }
	
	@PostMapping("/updatePassword")
	public String updatePassword(@RequestBody String userPass)
			throws JsonParseException, JsonMappingException, IOException {
		
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userPass, User.class);
		System.out.print(u.toString());
		System.out.println(u.name.toString());

		UserSQL users = new UserSQL();
		String updatePassword = users.updatePassword(u.userName, u.password);

		return updatePassword;
	}

	//this was rod i can make it cleaner if needed i was just playing around
	@PostMapping("/updateUsername/{oldusername}")
	public String updateUsername(@PathVariable String oldusername ,@RequestBody String userName)
			throws JsonParseException, JsonMappingException, IOException {
		
		System.out.println(userName);
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userName, User.class);
		//System.out.println(email);
		//System.out.print(u.toString());
		System.out.println(u.email.toString());
		System.out.println(u.userName.toString());

		UserSQL users = new UserSQL();
		String updateUsername = users.updateUsername(oldusername, u.userName);
		System.out.println("Update username results: "+updateUsername);

		return updateUsername;
	}

	// @PostMapping("/updateUsername")
	// public String updateUsername(@RequestBody String userName)
	// 		throws JsonParseException, JsonMappingException, IOException {
		
	// 	ObjectMapper om = new ObjectMapper();
	// 	SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
	// 	sm.addDeserializer(User.class, new UserDeserializer());
	// 	om.registerModule(sm);
	// 	User u = om.readValue(, User.class);
	// 	System.out.print(u.toString());
	// 	System.out.println(u.email.toString());
	// 	System.out.println(u.userName.toString());


	// 	UserSQL users = new UserSQL();
	// 	String updateUsername = users.updateUsername(u.userName, u.bio);

	// 	return updateUsername;
	// }


	@PostMapping("/saveProfilePic")
	public String saveProfilePic(@RequestBody String userPic)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userPic, User.class);
		//System.out.print(u.toString());

		UserSQL users = new UserSQL();
		System.out.print("photo: "+u.photo);

		String savePhoto = users.insertProfilePhoto(u.userName, u.photo);

		return savePhoto;

	}

	@PostMapping("/resetPasswordEmail")
	public String sendResetEmail(@RequestBody String userEmail)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userEmail, User.class);
		//System.out.print(u.toString());

		UserSQL users = new UserSQL();
		System.out.print("email: "+u.email+" username "+u.userName);

		Email resetPass = new Email(u.email, u.userName);
		System.out.print("************here: HERE: "+resetPass.userName);
		return resetPass.sendEmail(1); // 1 = password, 0 = userName
	}

	@PostMapping("/forgotUsername")
	public String forgotUsername(@RequestBody String userEmail)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userEmail, User.class);
		//System.out.print(u.toString());

		UserSQL users = new UserSQL();
		System.out.print("email: "+u.email);

		Email resetPass = new Email(u.email, u.userName);
		
		return resetPass.sendEmail(0); // 1 = password, 0 = userName
	}


	@PostMapping("/saveBio")
	public String saveBio(@RequestBody String userBio)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userBio, User.class);
		//System.out.print(u.toString());

		UserSQL users = new UserSQL();
		System.out.print("bio: "+u.bio);

		return users.updateBio(u.userName, u.bio);
	}

	@PostMapping("/saveFavoriteDrink")
	public String saveFavoriteDrink(@RequestBody String userFavDrink)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userFavDrink, User.class);
		//System.out.print(u.toString());

		UserSQL users = new UserSQL();
		System.out.print("favoriteDrink: "+u.favoriteDrink);

		return users.updateFavoriteDrink(u.userName, u.favoriteDrink);
	}
	//TODO need to add check for when user didnt like/dislike the drink db shouldnt be updated
	@PostMapping("/likeDrink/{drinkId}/{toggle}")
	public String likeDrink(@PathVariable int drinkId, @PathVariable String toggle, @RequestBody String userName)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userName, User.class);

		UserSQL users = new UserSQL();
		System.out.print(u.userName +  " Liked --- DrinkId: "+ drinkId +"\n");
		
		DrinkSQL ds = new DrinkSQL();


		users.likeDrink(u.userName, drinkId, toggle);
		return ds.likeDrink(drinkId, toggle);
	}

	@PostMapping("/dislikeDrink/{drinkId}/{toggle}")
	public String dislikeDrink(@PathVariable int drinkId, @PathVariable String toggle, @RequestBody String userName)
			throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(User.class, new UserDeserializer());
		om.registerModule(sm);
		User u = om.readValue(userName, User.class);

		UserSQL users = new UserSQL();
		System.out.print("favoriteDrink: "+u.userName+" --- DrinkId: "+drinkId);
		DrinkSQL ds = new DrinkSQL();

		users.dislikeDrink(u.userName, drinkId, toggle);
		return ds.dislikeDrink(drinkId, toggle);
	}

	@GetMapping("/getLikeStatus/{username}/{drinkId}")
	public String getLikeStatus(@PathVariable String username, @PathVariable int drinkId)
			throws JsonParseException, JsonMappingException, IOException {
//		ObjectMapper om2 = new ObjectMapper();
//		SimpleModule sm2 = new SimpleModule("UserSerializer", new Version(1, 0, 0, null, null, null));
//		sm2.addSerializer(User.class, new UserSerializer());
//		om2.registerModule(sm2);
//		ObjectMapper om2 = new ObjectMapper();
//		SimpleModule sm2 = new SimpleModule("UserSerializer", new Version(1, 0, 0, null, null, null));
//		sm2.addSerializer(User.class, new UserSerializer());
//		om2.registerModule(sm);
//		User u = om2.readValue(userName, User.class);

		UserSQL users = new UserSQL();
		return users.getLikeStatus(username, drinkId);
	}
	
	@GetMapping("/getLikedDrinks/{username}")
	public ArrayList<Drink> getLikeDrinks(@PathVariable String username)
			throws JsonParseException, JsonMappingException, IOException {

		//ObjectMapper om = new ObjectMapper();
		// DrinkSQL drinks = new DrinkSQL();
		UserSQL users = new UserSQL();
		return users.getLikedDrinks(username);
		// users.getLikedDrinks(username);
		//ArrayList<Drink> list = drinks.getAllDrinks(); 
		// ArrayList<String> out = new ArrayList<>();
		// Map<String, String> mp = new HashMap<String, String>();

		// for(int i = 0; i < list.size(); i++) {
		// 	Drink drink = list.get(i);
		// 	String str = users.getLikeStatus(username, drink.id);
		// 	JsonNode jsonnode = om.readTree(str);
		// 	String status = jsonnode.get("isLiked").asText();
		// 	if (status.equals("true")){
				
		// 		mp.put(Integer.toString(drink.id), om.writeValueAsString(drink) );
		// 	}
		// 	//mp.put(Integer.toString(drink.id), jsonnode.get("isLiked").asText() );
		// 	//out.add(drink.id, users.getLikeStatus(username, drink.id));
		// }
		//return users.getLikeStatus(username,);
		//System.out.println(mp.toString());
		// return mp;
	}
	@GetMapping("/getDislikedDrinks/{username}")
	public ArrayList<Drink> getDislikeDrinks(@PathVariable String username)
			throws JsonParseException, JsonMappingException, IOException {

		// ObjectMapper om = new ObjectMapper();
		// DrinkSQL drinks = new DrinkSQL();
		UserSQL users = new UserSQL();
		return users.getDislikedDrinks(username);
		// ArrayList<Drink> list = drinks.getAllDrinks(); 
		
		// ArrayList<String> out = new ArrayList<>();
		// Map<String, String> mp = new HashMap<String, String>();
		// for(int i = 0; i < list.size(); i++) {
		// 	Drink drink = list.get(i);
		// 	String str = users.getLikeStatus(username, drink.id);
		// 	JsonNode jsonnode = om.readTree(str);
		// 	String status = jsonnode.get("isDisliked").asText();
		// 	if (status.equals("true")){
		// 		mp.put(Integer.toString(drink.id), om.writeValueAsString(drink) );
		// 	}
			//mp.put(Integer.toString(drink.id), jsonnode.get("isLiked").asText() );
			//out.add(drink.id, users.getLikeStatus(username, drink.id));
		//return users.getLikeStatus(username,);
		//System.out.println(mp.toString());
		
	}
	
	
	


//	@PostMapping("/removeLikeDrink/{drinkId}")
//	public String removeLikeDrink(@PathVariable int drinkId, @RequestBody String userName)
//			throws JsonParseException, JsonMappingException, IOException {
//
//		ObjectMapper om = new ObjectMapper();
//		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
//		sm.addDeserializer(User.class, new UserDeserializer());
//		om.registerModule(sm);
//		User u = om.readValue(userName, User.class);
//
//		UserSQL users = new UserSQL();
//		System.out.print("favoriteDrink: "+u.userName+" --- DrinkId: "+drinkId);
//		DrinkSQL ds = new DrinkSQL();
//		ds.removeLikeDrink(drinkId, 1);
//
//		return users.removeLikeDrink(u.userName, drinkId, 1);
//	}
//
//	@PostMapping("/removeDislikeDrink/{drinkId}")
//	public String removeDislikeDrink(@PathVariable int drinkId, @RequestBody String userName)
//			throws JsonParseException, JsonMappingException, IOException {
//
//		ObjectMapper om = new ObjectMapper();
//		SimpleModule sm = new SimpleModule("UserDeserializer", new Version(1, 0, 0, null, null, null));
//		sm.addDeserializer(User.class, new UserDeserializer());
//		om.registerModule(sm);
//		User u = om.readValue(userName, User.class);
//
//		UserSQL users = new UserSQL();
//		System.out.print("favoriteDrink: "+u.userName+" --- DrinkId: "+drinkId);
//
//		DrinkSQL ds = new DrinkSQL();
//		ds.removeLikeDrink(drinkId, -1);
//
//		return users.removeLikeDrink(u.userName, drinkId, -1);
//	}
//



    @DeleteMapping("/delete")
    public String deleteUser() {
        //find a single user
        return "success";
    }
}