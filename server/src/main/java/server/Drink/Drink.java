package server.Drink;

public class Drink{

    public int likes;
    public int id;
    public int dislikes;
    public String name;
    public String description;
    public Ingredient[] ingredients;
    public String photo;
    public String publisher;
    
	public Drink(){
		this.id = 0;
		this.name = null;
		this.description = null;
		this.ingredients = null;
		this.photo = null;
		this.publisher = null;
	}


    public Drink(int id, String name, String description, Ingredient[] ingredients, String photo, int likes, int dislikes, String publisher){
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
        out += "description: " + this.description + "\ningredients: \n";
        for (Ingredient s : ingredients) {
            out += " "+ s.toString();
        }
        out+= "\n";
        out += "publisher: " + this.publisher + "\n";
        if (this.photo.length() > 30){
            out += "photo: " + this.photo.substring(0, 30) + "\n";
        } else {
            out += "photo: " + this.photo + "\n";
        }
        
        out += "likes: " + (likes) + " dislikes: " + (dislikes) + "\n";
        return out;
    }


}