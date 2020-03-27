package server.Drink;


public class Ingredient{

    public String measurement;
    public String ingredient;
    public String quantity;
	public String username;
	public int drinkId;
    
    public Ingredient(){
        this.measurement = null;
        this.ingredient = null;
        this.quantity = null;
		this.username = null;
		this.drinkId = -1;
    }

    public Ingredient(String quantity, String measurement, String ingredient){
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.measurement = measurement;
		this.username = null;
		this.drinkId = -1;
    } 

	public Ingredient(String username, int drinkId, String ingredient, String measurement, String quantity){
		this.ingredient = ingredient;
        this.quantity = quantity;
        this.measurement = measurement;
		this.username = username;
		this.drinkId = drinkId;
	}

    @Override
    public String toString(){
        String out = "";
        out += quantity + " ";
        out += measurement + " ";
        out += ingredient + "\n";
        return out;
    }

}