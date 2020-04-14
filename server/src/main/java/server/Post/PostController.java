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
		return posts.insertPost(p.text, p.image, "", p.geolocation, p.date);
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

}