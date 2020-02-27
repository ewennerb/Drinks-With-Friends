package server.Drink;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class IngredientSerializer extends StdSerializer<Ingredient> {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public IngredientSerializer() {
        this(null);
    }

    public IngredientSerializer(Class<Ingredient> t) {
        super(t);
    }

    @Override
    public void serialize(Ingredient value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        
        gen.writeStartObject();
        gen.writeStringField("measurement", value.measurement);
        gen.writeStringField("quantity", value.quantity);
        gen.writeStringField("ingredient", value.ingredient);
        gen.writeEndObject();
    }

    





}