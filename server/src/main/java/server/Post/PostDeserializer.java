package server.Post;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class PostDeserializer extends StdDeserializer<Post> {


	private static final long serialVersionUID = 1L;

	public PostDeserializer(){
		this(null);
	}

	public PostDeserializer(Class<Post> t) {
		super(t);
	}


	@Override
    public Post deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		ObjectCodec c = new ObjectMapper();
		JsonNode node = c.readTree(p);

		Post post = new Post(-1, 
			node.get("text").asText(),
			node.get("image").asText(),
			node.get("userName").asText(),
			node.get("geolocation").asText(),
			node.get("date").asText()
		);

		return post;
	}
}