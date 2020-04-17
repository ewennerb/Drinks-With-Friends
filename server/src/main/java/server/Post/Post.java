package server.Post;

public class Post{

	public int postId;
	public String text;
	public String image;
	public int userId;
	public String geolocation;
	public String date;
	public String profileImage;
	public String name;
	public String userName;

	public Post(){
		this.postId = 0;
		this.text = "No text";
		this.image = null;
		this.userId = 0;
		this.geolocation = null;
		this.date = null;
	}

	public Post(int postId, String text, String image, int userId, String geolocation, String date, String username)
	{
		this.postId = postId;
		this.text = text;
		this.image = image;
		this.userId = userId;
		this.userName = username;
		this.geolocation = geolocation;
		this.date = date;
	}


}