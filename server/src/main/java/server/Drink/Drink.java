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
    
	public Drink(){
		this.id = 0;
		this.name = null;
		this.description = null;
		this.ingredients = null;
		this.photo = null;
		this.publisher = null;
	}


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

    @Override
    public String toString() {
        String out = "";
        out += "name: " + this.name + "\n";
        out += "description: " + this.description + "\ningredients: ";
        for (String s : ingredients) {
            out += s + " ";
        }
        out+= "\n";
        out += "publisher: " + this.publisher + "\n";
        out += "photo: " + this.photo + "\n";
        out += "likes: " + (likes) + " dislikes: " + (dislikes) + "\n";
        return out;
    }


}