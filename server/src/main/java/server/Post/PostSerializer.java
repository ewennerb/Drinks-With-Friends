package server.Post;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class PostSerializer extends StdSerializer<Post> {

	private static final long serialVersionUID = 1L;

	public PostSerializer() {
		this(null);
	}

	public PostSerializer(Class<Post> t) {
		super(t);
	}

	@Override
	public void serialize(Post value, JsonGenerator gen, SerializerProvider provider) throws IOException {
		gen.writeStartObject();
		gen.writeNumberField("postId", value.postId);
		gen.writeStringField("text", value.text);
		gen.writeStringField("image", value.image);
		gen.writeStringField("userName", value.userName);
		gen.writeStringField("geolocation", value.geolocation);
		gen.writeStringField("date", value.date);
		gen.writeEndObject();
	
	}
}