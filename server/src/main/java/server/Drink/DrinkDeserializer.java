package server.Drink;

import java.io.IOException;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class DrinkDeserializer extends StdDeserializer<Drink> {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public DrinkDeserializer() {
        this(null);
    }

    public DrinkDeserializer(Class<Drink> t) {
        super(t);
    }

    @Override
    public Drink deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        ObjectCodec c = new ObjectMapper();
        JsonNode node = c.readTree(p);
        ArrayList<Ingredient> ingreds = new ArrayList<>();
        
        JsonNode i = node.get("ingredients");
        if (i.isArray()){
            for (JsonNode jsonNode : i) {
                String objectI = jsonNode.get("ingredient").asText();
                String objectM = jsonNode.get("measurement").asText();
                String objectQ = jsonNode.get("quantity").asText();
                ingreds.add(new Ingredient(objectQ, objectM, objectI));
            }
        }
        Ingredient[] tt = new Ingredient[ingreds.size()];
        int k = 0;
        for (Ingredient in : ingreds) {
            System.out.print(in.toString());
            tt[k++] = in;
        }
        Drink d = new Drink(
            variableId(node),
            node.get("name").asText(),
            node.get("description").asText(),
            tt,
            variablePhoto(node),
            0, 0,
            node.get("publisher").asText());
        return d;
    }


    public String variablePhoto(JsonNode n) {
		if (n.get("photo") == null)
			return "";
		else
			return n.get("photo").asText();
    }
    public int variableId(JsonNode n) {
		if (n.get("id") == null)
			return -1;
		else
			return n.get("id").asInt();
	}
    




}