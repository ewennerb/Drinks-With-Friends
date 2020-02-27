package server.User;

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

public class UserDeserializer extends StdDeserializer<User> {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public UserDeserializer() {
        this(null);
    }

    public UserDeserializer(Class<User> t) {
        super(t);
    }

    @Override
    public User deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        ObjectCodec c = new ObjectMapper();
        JsonNode node = c.readTree(p);
        //ArrayList<String> ingreds = new ArrayList<>();
        //ingreds.add("TEST");
        //String[] tt = new String[10];
        //JsonNode i = node.get("ingredients");
        //System.out.println(i);
        User u = new User(-1,
            node.get("userName").asText(),
            node.get("password").asText(),
            node.get("name").asText(),
            node.get("email").asText(),
            node.get("phoneNumber").asText(),
            node.get("photo").asText(),
			node.get("bio").asText(),
			node.get("likedDrinks").asText(),
			node.get("dislikedDrinks").asText(),
			node.get("favoritedDrink").asText(),
			node.get("publishedDrinks").asText(),
			node.get("postHistory").asText(),
			node.get("friendsList").asText(),
			node.get("dateCreated").asText(),
			node.get("lastLogin").asText(),
			0);

        return u;
    }

    




}