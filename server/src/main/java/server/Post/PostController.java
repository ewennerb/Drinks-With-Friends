package server.Post;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import server.SQL.PostSQL;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin //(origins = "*", maxAge =  3600, allowedHeaders = "*")     //production
@RequestMapping(path="/post")
public class PostController {

	//getAll PostS
	//getPost
	int g_postId = 0;

	//create Post
	@PostMapping("/")
	public String insertPost(@RequestBody String username)
			throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Post.class, new PostDeserializer());
		om.registerModule(sm);

		Post p = om.readValue(username, Post.class);

		PostSQL posts = new PostSQL();
		String postReturn = posts.insertPost(p.text, p.image, p.userName, p.geolocation, p.date);
		g_postId = posts.recentPostId;
		p.postId = g_postId;
		
		posts = new PostSQL();
		String notifReturn = posts.notifyUser(g_postId, p.userName);

		if ( postReturn.equals("{ \"status\" : \"ok\" }") && notifReturn.equals("{ \"status\" : \"ok\" }")) {
			return postReturn;
		} else {
			return "{ \"status\" : \"Error: SQL update failed.\"}";
		}

	}
	/*
	@PostMapping("/{address}/{locationName}")
	public String insertGeotag(@RequestBody String username, @PathVariable String address, @PathVariable String locationName)
			throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Post.class, new PostDeserializer());
		om.registerModule(sm);

		Post p = om.readValue(username, Post.class);
		p.postId = g_postId;

		PostSQL posts = new PostSQL();
		String insertGeotagString = posts.insertGeotag(p, address, locationName);
		return insertGeotagString;
	}*/

	//Need to include postId and username of logged in user in request body
	@PostMapping("/notificationClicked/{postId}/{username}")
	public String notificationClicked(@PathVariable int postId, @PathVariable String username) //(@RequestParam(name = "s") String username, 
			throws JsonProcessingException, JsonMappingException, IOException {
		System.out.println("TEST");
		/*
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Post.class, new PostDeserializer());
		om.registerModule(sm);

		Post p = om.readValue(username, Post.class);*/
		System.out.print("HERE");

		PostSQL posts = new PostSQL();
		return posts.removeNotification(postId, username);

	}

	@GetMapping("")
	public String findAll()
			throws JsonParseException, JsonMappingException, IOException {
			
		PostSQL posts = new PostSQL();

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostSerializer", new Version(1, 0, 0, null, null, null));
		sm.addSerializer(Post.class, new PostSerializer());
		om.registerModule(sm);

		return om.writeValueAsString(posts.getAllPosts());
	}

	@GetMapping("/{username}")
	public String findUserPosts(@PathVariable String username)
			throws JsonParseException, JsonMappingException, IOException {
			
		PostSQL posts = new PostSQL();

		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostSerializer", new Version(1, 0, 0, null, null, null));
		sm.addSerializer(Post.class, new PostSerializer());
		om.registerModule(sm);

		//Post p = posts.getUserPosts(username);
		//if (p == null )
		//	return "{ \"status\": \"DNE\"}";

		return om.writeValueAsString(posts.getUserPosts(username));
	}
	@GetMapping("/getPost/{postId}")
	public String getPost(@PathVariable int postId)
		throws JsonParseException, JsonMappingException, IOException {
		
		PostSQL ps = new PostSQL();
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostSerializer", new Version(1, 0, 0, null, null, null));
		sm.addSerializer(Post.class, new PostSerializer());
		om.registerModule(sm);

		return om.writeValueAsString(ps.getPost(postId));
	}
	

	@PostMapping("/delete")
	public String deletePost(@RequestBody String username)
			throws JsonParseException, JsonMappingException, IOException {
		
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Post.class, new PostDeserializer());
		om.registerModule(sm);

		Post p = om.readValue(username, Post.class);

		PostSQL posts = new PostSQL();
		return posts.deletePost(p.postId);
	}

	@GetMapping("/search")
    public String searchPost(@RequestParam(name = "s") String request) throws JsonProcessingException {
        PostSQL us = new PostSQL();
		Post[] posts = us.searchPost(request);
		if(posts == null) {
			return "{\"results\": \"DNE\"";
		}
		

		String out =  "{ \"results\": [ ";
		for (Post post : posts ) {
			out += new ObjectMapper().writeValueAsString(post) + ",";
		}
		out = out.substring(0, out.length()-1) + "] }";
		
        return out;
	}
	
	@PostMapping("/update/{postId}")
	public String updatePost(@PathVariable int postId, @RequestBody String username)
		throws JsonParseException, JsonMappingException, IOException {
		
		ObjectMapper om = new ObjectMapper();
		SimpleModule sm = new SimpleModule("PostDeserializer", new Version(1, 0, 0, null, null, null));
		sm.addDeserializer(Post.class, new PostDeserializer());
		om.registerModule(sm);
			//deserilaize it
		Post p = om.readValue(username, Post.class);
		p.postId = postId;
		System.out.println(p);

		PostSQL posts = new PostSQL();
		posts.updatePost(p);
		
		return "";
	}

}