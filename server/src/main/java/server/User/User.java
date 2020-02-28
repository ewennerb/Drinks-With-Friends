package server.User;

public class User{

	public int userId;
	public String userName;
	public String password;
	public String name;
	public String email;
	public String phoneNumber;
	public String photo;
	public String bio;
	public String likedDrinks;
	public String dislikedDrinks;
	public String favoriteDrink;
	public String publishedDrinks;
	public String postHistory;
	public String friendsList;
	public String dateCreated;
	public String lastLogin;
	public int darkMode;

	public User(){
		this.userId = 0;
		this.userName = null;
		this.password = null;
		this.name = null;
		this.email = null;
		this.phoneNumber = null;
		this.photo = null;
		this.bio = null;
		this.likedDrinks = null;
		this.dislikedDrinks = null;
		this.favoriteDrink = null;
		this.publishedDrinks = null;
		this.postHistory = null;
		this.friendsList = null;
		this.dateCreated = null;
		this.lastLogin = null;
		this.darkMode = 0;
	}


	public User(int userId, String userName, String password, String name, String email, String phoneNumber, String photo, String bio, String likedDrinks, String dislikedDrinks, String favoriteDrink, String publishedDrinks, String postHistory, String friendsList, String dateCreated, String lastLogin, int darkMode)
	{
		this.userId = userId;
		this.userName = userName;
		this.password = password;
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.photo = photo;
		this.bio = bio;
		this.likedDrinks = likedDrinks;
		this.dislikedDrinks = dislikedDrinks;
		this.favoriteDrink = favoriteDrink;
		this.publishedDrinks = publishedDrinks;
		this.postHistory = postHistory;
		this.friendsList = friendsList;
		this.dateCreated = dateCreated;
		this.lastLogin = lastLogin;
		this.darkMode = darkMode;
	}


}