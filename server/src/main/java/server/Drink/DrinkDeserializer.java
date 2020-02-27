package server.Drink;

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
        ArrayList<String> ingreds = new ArrayList<>();
        ingreds.add("TEST");
        String[] tt = new String[10];
        //JsonNode i = node.get("ingredients");
        //System.out.println(i);
        Drink d = new Drink(-1,
            node.get("name").asText(),
            node.get("description").asText(),
            tt,
            node.get("photo").asText(),
            0, 0,
            node.get("publisher").asText());
        return d;
    }

    




}