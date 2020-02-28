package server.User;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import server.SQL.UserSQL;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

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
		//System.out.print(u.toString());

		UserSQL users = new UserSQL();
		String updatePassword = users.updatePassword(u.userName, u.password);

		return updatePassword;
	}

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
		System.out.print("email: "+u.email);

		Email resetPass = new Email(u.email, u.userName);
		return resetPass.sendEmail(1); // 1 = password, 0 = userName
	}

	@PostMapping("/forgotUsername")
	public String sendResetEmail(@RequestBody String userEmail)
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


    @DeleteMapping("/delete")
    public String deleteUser() {
        //find a single user
        return "success";
    }
}