import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import {
    Segment,
    Loader,
} from "semantic-ui-react";
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import "../css/Drink.css"
import {config} from '../config/config'
import DrinkCard from "./DrinkCard.js"




class Drink extends Component{
  constructor(props){
    super(props)
    this.getDrink = this.getDrink.bind(this)
    //console.log(this.props.match.params)
    this.state = {
        user: this.props.user || localStorage.getItem('username'),
        drink: undefined,
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
        
        return(
            <div>
                <DrinkCard
                    user={this.state.user}
                    index={0}
                    drink={this.state.drink}
                />
            </div>  
        )
    }
  }

}

export default Drink