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
    Loader
} from "semantic-ui-react";
import {Link, Router} from 'react-router-dom';
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import "../css/Drink.css"





class Drink extends Component{
  constructor(props){
    super(props)
    this.getDrink = this.getDrink.bind(this)
    console.log(this.props.match.params)
    this.state = {
        user: this.props.user,
        searchText: "",
        drink: undefined,
        response: undefined,
        loaded: false,
        loggedIn: false,
        done: false,
        
    }

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
async getDrink(){
    await fetch('http://localhost:8080/drink/'+this.props.match.params.username+'?d='+this.props.match.params.name, {
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
        await this.setState({drink: data})
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
                    </Segment>
                </Card>
            </div>  
        )
    }
  }

}

export default Drink