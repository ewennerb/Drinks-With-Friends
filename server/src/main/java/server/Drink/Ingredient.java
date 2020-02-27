package server.Drink;


public class Ingredient{

    protected String measurement;
    protected String ingredient;
    protected String quantity;
    
    public Ingredient(){
        this.measurement = null;
        this.ingredient = null;
        this.quantity = null;
    }

    public Ingredient(String quantity, String measurement, String ingredient){
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.measurement = measurement;
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