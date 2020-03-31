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

		Post post = new Post(
			variablePostId(node), 
			node.get("text").asText(),
			node.get("image").asText(),
			node.get("userId").asInt(),
			node.get("geolocation").asText(),
			node.get("date").asText()
		);

		return post;
	}

	public int variablePostId(JsonNode n) {
		if (n.get("postId") == null)
			return -1;
		else
			return n.get("postId").asInt();
	}
}