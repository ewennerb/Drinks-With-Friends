package server.Post;

public class Post{

	public int postId;
	public String text;
	public String image;
	public String userName;
	public String geolocation;
	public String date;

	public Post(){
		this.postId = 0;
		this.text = "No text";
		this.image = null;
		this.userName = null;
		this.geolocation = null;
		this.date = null;
	}

	public Post(int postId, String text, String image, String userName, String geolocation, String date)
	{
		this.postId = postId;
		this.text = text;
		this.image = image;
		this.userName = userName;
		this.geolocation = geolocation;
		this.date = date;
	}


}