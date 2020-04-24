import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import {
    Image,
    Rating,
    Input,
    Button,
    Card,
    Segment,
    Header,
    Grid,
    List,
    GridColumn, 
    GridRow,
    Form,
    Loader,
    Modal,
    FormGroup,
    Message
} from "semantic-ui-react";
import {Link, Router} from 'react-router-dom';
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import "../css/Drink.css"
import {config} from '../config/config'
var base64 = require('base-64');




class Drink extends Component{
  constructor(props){
    super(props)
    this.getDrink = this.getDrink.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.changeIngredient = this.changeIngredient.bind(this);
    this.createIngredient = this.createIngredient.bind(this);
    this.changeIngredientQuantity = this.changeIngredientQuantity.bind(this);
    this.changeIngredientMeasurement = this.changeIngredientMeasurement.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this);
    this.canPost = this.canPost.bind(this);
    this.editDrink = this.editDrink.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.fileReader = new FileReader();
    //console.log(this.props.match.params)
    this.state = {
        user: this.props.user,
        drink: undefined,
        response: undefined,
        loaded: false,
        loggedIn: false,
        done: false,
        editing: false,
        drinkName: "HELP",
        description: "",
        selected: false,
        ingredients: [
            {
                ingredient: "",
                quantity: "",
                measurement: ""
            }
        ],
        postDisabled: false,
        fileString: ""
        
    }
    this.fileInputRef = React.createRef();

  }
  async componentDidMount() {
    await this.getDrink();
    this.setState({
        loaded: false,
        user: this.props.user,
        done: true,
        results: [],
        searchable: false
    })
}
async handleNameChange(e){
        console.log(e)
        await this.setState({
            drinkName: e.target.value
        });
        this.canPost();
    }

async handleDescriptionChange(event){
    this.setState({description: event.target.value})
}


async createIngredient(){
    await this.state.ingredients.push({quantity: "", measurement: "", ingredient: ""});
    this.forceUpdate();
    this.canPost();
}


async changeIngredientQuantity(event, index){
    let fakeIngredients = this.state.ingredients;
    fakeIngredients[index].quantity = event.target.value;
    await this.setState({ingredients: fakeIngredients});
}

async changeIngredientMeasurement(event, index){
    let fakeIngredients = this.state.ingredients;
    fakeIngredients[index].measurement = event.target.value;
    await this.setState({ingredients: fakeIngredients});
}

async changeIngredient(event, index){
    let fakeIngredients = this.state.ingredients;
    fakeIngredients[index].ingredient = event.target.value;
    await this.setState({ingredients: fakeIngredients});
    this.canPost();
}

async removeIngredient(event){
    console.log(parseInt(event.target.className));
    console.log(event.target.className);
    this.state.ingredients.splice(parseInt(event.target.className), 1);
    this.canPost();
    this.forceUpdate();
}
canPost(){
    let blankIngr = {ingredient: "", quantity: "", measurement: ""};
    let disabled;
    disabled = !(this.state.ingredients.every(val => val.ingredient !== "") &&
        this.state.ingredients.length >= 1 &&
        this.state.drinkName !== "" &&
        this.state.drinkName !== " ");
    
    this.setState({
        postDisabled: disabled
    })
}
async editDrink(){
    let photoString = "";
    if(this.state.selected){
        photoString = await base64.encode(this.state.fileString);
    }
    let tester = {
        id: this.state.drink.id,
        publisher: this.state.drink.publisher,
        name: this.state.drinkName,
        description: this.state.description,
        ingredients: this.state.ingredients,
        photo: photoString
    }
    console.log(tester)
    await fetch(config.url.API_URL + '/drink/editDrink', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tester)
    }).then(res => res.json()).then((data) => {
        console.log(data);
        this.setState({editing: false})
        if (data.status === "ok"){
            window.location.replace('/'+this.state.drink.publisher + '/drink/' + this.state.drinkName) 
        }
    }).catch(console.log);
}

async handleEdit(){
    this.setState({editing: true})


}
handleFileRead = (e) => {
    this.setState({fileString: this.fileReader.result});
};
async fileChange(event) {
    if(event.target.files === undefined){
        this.setState({
            file: undefined,
            selected: false,
            fileName: ""
        })
    }else{
        const file = event.target.files[0];
        const fileName = event.target.files[0].name;
        this.fileReader = new FileReader();

        this.fileReader.onload = this.handleFileRead;

        await this.fileReader.readAsBinaryString(file);
    

        await this.setState({
            file: file,
            selected: true,
            fileName: fileName,
        });
    }
};


async getDrink(){
    await fetch(config.url.API_URL + '/drink/'+this.props.match.params.username+'?d='+this.props.match.params.name, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //     username: this.state.username,
        //     password: this.state.password,
        //     confirm_password: this.state.conf_pass,
        // })
    }).then(res => res.json()).then(async (data) => {
        console.log(data)
        
        await this.setState({drink: data, drinkName: data.name, description: data.description, ingredients: data.ingredients})
        
        
    }).catch(console.log);
    await this.setState({done: true})
}

  render(){
    if (!this.state.done){
        return(
            <div>
                <Segment style={{ height: '40vh', overflow:"auto"  }} textAlign={"center"}>
                    <Dimmer active>
                        <Loader content='Loading' />
                    </Dimmer>
                </Segment>
            </div>
        )
    }else{
        let pfp;
        if (this.state.drink.photo === null || this.state.drink.photo === ""){
            pfp = <Image floated="left" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"} />
        }else{
            pfp = <Image floated="left" size="tiny" src={`data:image/jpeg;base64,${this.state.drink.photo}`}/>
        }
        return(
            <div>
                <Modal open={this.state.editing} closeOnDimmerClick={true} size="large">
                <Form size='large'>
                        <Segment stacked>
                            <Form>
                                <Button
                                    content="Choose File"
                                    labelPosition="left"
                                    icon="file"
                                    onClick={() => this.fileInputRef.current.click()}
                                />
                                <input
                                    ref={this.fileInputRef}
                                    accept="image/gif, image/jpeg, image/png"
                                    type="file"
                                    hidden
                                    onChange={this.fileChange}
                                />
                                <Message hidden={!this.state.selected} >{this.state.fileName}</Message>
                                <Form.Input
                                    content={this.state.drinkName}
                                    onChange={this.handleNameChange}
                                    required={true}
                                    value={this.state.drinkName}
                                    id="drinkName"
                                />
                                <Form.Input
                                    placeholder='Description'
                                    content={this.state.description}
                                    value={this.state.description}
                                    onChange={this.handleDescriptionChange}
                                />
                                <Button icon="plus" content={"Add Ingredients"} onClick={this.createIngredient}/>
                                <br/>
                                <br/>
                                {this.state.ingredients.map((ing, index) => {
                                    return (
                                        <FormGroup inline>
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Amount"}
                                                labelPosition="top"
                                                width={3}
                                                placeholder="1"
                                                content={this.state.ingredients[index].quantity}
                                                onChange={(e) => this.changeIngredientQuantity(e, index)}
                                                value={this.state.ingredients[index].quantity}
                                            />
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Amount"}
                                                labelPosition="top"
                                                width={3}
                                                placeholder="ex. oz"
                                                content={this.state.ingredients[index].measurement}
                                                onChange={(e) => this.changeIngredientMeasurement(e, index)}
                                                value={this.state.ingredients[index].measurement}
                                            />
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Ingredient"}
                                                labelPosition="top"
                                                width={6}
                                                placeholder="Ex. Smirnoff Vodka"
                                                content={this.state.ingredients[index].ingredient}
                                                onChange={(e) => this.changeIngredient(e, index)}
                                                value={this.state.ingredients[index].ingredient}
                                            />
                                            <Button className={index.toString()} icon="minus" onClick={(e) => this.removeIngredient(e, index)}/>
                                        </FormGroup>
                                    )
                                })}
                                <br/>
                                <div className='ui two buttons'>
                                    <Button color='grey' onClick={this.handleClose}>
                                        Cancel
                                    </Button>
                                    <Button color='yellow' disabled={this.state.postDisabled} onClick={() => this.editDrink()}>
                                        Post!
                                    </Button>
                                </div>
                            </Form>

                        </Segment>
                    </Form>
                </Modal>
                <Card style={{width: "500px"}} centered>
                    <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                        {/*<Image*/}
                        {/*    floated='left'*/}
                        {/*    size='small'*/}
                        {/*    src='https://react.semantic-ui.com/images/avatar/large/molly.png'*/}
                        {/*/>*/}
                        <Header textAlign="center" style={{marginTop: "0px"}}>
                            <h2>{this.state.drink.name}</h2>
                        </Header>
                        <Grid columns="2">
                            <GridColumn>                                                                    
                                    {pfp}                                
                            </GridColumn>
                            <GridColumn>
                                <h3 style={{textAlign: 'center'}}>Recipe</h3>
                                <Card.Content>
                                    <List className="ingreds">
                                        {this.state.drink.ingredients.map(ingr => {
                                            return(
                                                <List.Item>
                                                    {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                                </List.Item>
                                            )
                                        })}
                                    </List>
                                </Card.Content>
                            </GridColumn>
                        </Grid>
                        {/*<Card.Content header={this.state.drink.description}/>*/}
                        <h3>Preparation</h3>
                        <Card.Description content={this.state.drink.description}/>
                        {/*<Card.Meta>{this.state.drink.publisher}</Card.Meta>*/}
                        <Card.Meta>{this.state.drink.publisher}</Card.Meta>

                        <Card.Content extra>
                            <Rating icon='star' defaultRating={5} maxRating={5}/>
                        </Card.Content>
                        <Button onClick={this.handleEdit}>

                        </Button>
                    </Segment>
                </Card>
            </div>  
        )
    }
  }

}

export default Drink