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
            variablePhoto(node),//node.get("photo").asText(),
			variableBio(node),//node.get("bio").asText(),
			variableLiked(node),//node.get("likedDrinks").asText(),
			variableDisliked(node),//node.get("dislikedDrinks").asText(),
			variableFav(node),//node.get("favoritedDrink").asText(),
			variablePublish(node),//node.get("publishedDrinks").asText(),
			variablePosts(node),//node.get("postHistory").asText(),
			variableFriends(node),//node.get("friendsList").asText(),
			variableDateCRT(node),//node.get("dateCreated").asText(),
			variableLastLogin(node),//node.get("lastLogin").asText(),
			0);

        return u;
    }

	public String variablePhoto(JsonNode n) {
		if (n.get("photo") == null)
			return "";
		else
			return n.get("photo").asText();
	}

	public String variableBio(JsonNode n) {
		if (n.get("bio") == null)
			return "";
		else
			return n.get("bio").asText();
	}
	public String variableLiked(JsonNode n) {
		if (n.get("likedDrinks") == null)
			return "";
		else
			return n.get("likedDrinks").asText();
	}
	public String variableDisliked(JsonNode n) {
		if (n.get("dislikedDrinks") == null)
			return "";
		else
			return n.get("dislikedDrinks").asText();
	}
	public String variableFav(JsonNode n) {
		if (n.get("favoriteDrink") == null)
			return "";
		else
			return n.get("favoriteDrink").asText();
	}
	public String variablePublish(JsonNode n) {
		if (n.get("publishedDrinks") == null)
			return "";
		else
			return n.get("publishedDrinks").asText();
	}
	public String variablePosts(JsonNode n) {
		if (n.get("postHistory") == null)
			return "";
		else
			return n.get("postHistory").asText();
	}
	public String variableFriends(JsonNode n) {
		if (n.get("friendsList") == null)
			return "";
		else
			return n.get("friendsList").asText();
	}
	public String variableDateCRT(JsonNode n) {
		if (n.get("dateCreated") == null)
			return "";
		else
			return n.get("dateCreated").asText();
	}
	public String variableLastLogin(JsonNode n) {
		if (n.get("lastLogin") == null)
			return "";
		else
			return n.get("lastLogin").asText();
	}
    




}