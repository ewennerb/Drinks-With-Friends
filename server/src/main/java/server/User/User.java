package server.User;

import java.util.Date;

public class User{

	protected int userId;
	protected int darkMode;
	protected String userName;
	protected String password;
	protected String name;
	protected String email;
	protected String phoneNumber;
	protected String photo;
	protected String bio;
	protected String likedDrinks;
	protected String dislikedDrinks;
	protected String favoriteDrink;
	protected String publishedDrinks;
	protected String postHistory;
	protected String friendsList;
	protected Date dateCreated;
	protected Date lastLogin;

	public User(){
		this.userId = 0;
		this.darkMode = 0;
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
	}


	public User(int userId, int darkMode, String userName, String password, String name, String email, String phoneNumber, String photo, String bio, String likedDrinks, String dislikedDrinks, String favoriteDrink, String publishedDrinks, String postHistory, String friendsList, Date dateCreated, Date lastLogin)
	{
		this.userId = userId;
		this.darkMode = darkMode;
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
	}


}