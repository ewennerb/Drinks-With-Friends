package server.User;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class UserSerializer extends StdSerializer<User> {


	private static final long serialVersionUID = 1L;

	public UserSerializer() {
		this(null);
	}

	public UserSerializer(Class<User> t) {
		super(t);
	}

	@Override
	public void serialize(User value, JsonGenerator gen, SerializerProvider provider) throws IOException {
		gen.writeStartObject();
		gen.writeStringField("userName", value.userName);
		gen.writeStringField("password", value.password);
		gen.writeStringField("name", value.name);
		gen.writeStringField("email", value.password);
		gen.writeStringField("phoneNumber", value.phoneNumber);
		gen.writeStringField("photo", value.photo);
		gen.writeStringField("bio", value.bio);
		gen.writeStringField("likedDrinks", value.likedDrinks);
		gen.writeStringField("dislikedDrinks", value.dislikedDrinks);
		gen.writeStringField("favoriteDrink", value.favoriteDrink);
		gen.writeStringField("publishedDrinks", value.publishedDrinks);
		gen.writeStringField("postHistory", value.postHistory);
		gen.writeStringField("friendsList", value.friendsList);
		gen.writeStringField("dateCreated", value.dateCreated);
		gen.writeStringField("lastLogin", value.lastLogin);
		gen.writeNumberField("darkMode", value.darkMode);
		gen.writeEndObject();
	}

}