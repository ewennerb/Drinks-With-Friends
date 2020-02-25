package server.Drink;

public class Drink{

    protected int likes;
    protected int id;
    protected int dislikes;
    protected String name;
    protected String description;
    protected String[] ingredients;
    protected String photo;
    protected String publisher;
    
    public Drink(int id, String name, String description, String[] ingredients, String photo, int likes, int dislikes, String publisher){
        this.id = id;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.photo = photo;
        this.dislikes = dislikes;
        this.likes = likes;
        this.publisher = publisher;

    }


}