package server.Drink;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class DrinkSerializer extends StdSerializer<Drink> {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public DrinkSerializer() {
        this(null);
    }

    public DrinkSerializer(Class<Drink> t) {
        super(t);
    }

    @Override
    public void serialize(Drink value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        // TODO Auto-generated method stub
        gen.writeStartObject();
        gen.writeStringField("name", value.name);
        gen.writeStringField("description", value.description);
        gen.writeStringField("photo", value.photo);
        gen.writeStringField("publisher", value.publisher);
        gen.writeNumberField("likes", value.likes);
        gen.writeNumberField("dislikes", value.dislikes);
        gen.writeObjectField("ingredient", value.ingredients);
        gen.writeEndObject();
    }

    





}