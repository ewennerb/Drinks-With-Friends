import React, { Component } from 'react';

import {
  Feed,
  Container,
  Grid,
  //Icon,
  Header,
  Segment,

} from 'semantic-ui-react'
import {ingredientCard, postCard} from "../utils";
import DrinkCard from "../rDrinkCard.js";
import 'semantic-ui-css/semantic.min.css';

class LikedDrinks extends Component{
  constructor(props){
  super(props)
    this.state = {
      user: this.props.user,
    }
    let User = props.User;

    this.state = {
    userName: User.userName,
    posts: User.posts,
    browser: props.user,
    profile: props.match.params.profile,
    User: User,
    Drinks: props.Drinks,
    };
  }

  async componentDidMount(){
    
    let userPage = this.state.profile;
    
    if (userPage != undefined && this.state.Drinks != undefined){
    let Drinks = this.state.Drinks;
    let likedDrinks = [];
    //go through the drinks with id and find ones this profile liked
    // Drinks.map(async (drink) => {
    //   await this.getLikeStatus(this.state.profile, drink.id);
    //   //like status should be in state
    //   console.log(this.state.likeStatus);
    //   if (this.state.likeStatus == true) {
    //       //console.log(drink);
    //       likedDrinks.push(drink);
    //   }
    
    // }) // end of map
    //  //end of map
    // //putting that profiles drinks in state
    // if (likedDrinks != undefined) {
    //   this.setState({likedDrinks: likedDrinks});
    // }
   }//end if userpage !+ undef
  }
  

  render(){

    return (
      <Container>
      <Grid style={{height: '100vh', overflowY: 'scroll'}} columns={16} centered>
        <Grid.Column width={4}/>
        <Grid.Column width={8} textAlign="center">
          <Grid.Row centered>
            <Segment>
               <Header>{this.state.profile}'s Liked Drinks</Header>
            </Segment>
            <br/>
            {(this.state.drinks === undefined || this.state.drinks.length < 1)
              ? <Header>No Liked Drinks Found</Header>
              : this.state.drinks.map((drink, index) => {
                  return(
                    <DrinkCard
                    user={this.state.userName}
                    index={index}
                    drink={drink}
                    />
                    // rodsDrinkCard ({
                    //   user: this.state.userName,
                    //   index: index,
                    //   drink: drink,
                    // })
                  )
              })
            }
            <br/>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={4}/>
        </Grid>      
      </Container>

    );
  }



  async getLikeStatus(user, drinkId) {
    await fetch('http://localhost:8080/user/getLikeStatus/'+user+"/"+drinkId, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      }).then(res => res.json()).then((data) => { 
          //console.log(data);
          this.setState({likeStatus: data});
      }).catch(console.log);
  }

  isValidInput(input) {
    return !(input == undefined || input === '' || input == null);
  }
  
  ifNullthenEmpty(str) {
    if(str === null || str === undefined || str === ''){
      return '';
    } else {
      return str;
    }
  }
}

export default LikedDrinks;

    // <Container>
    // <Feed>
    // <Feed.Event
    // icon="pencil"
    // date="1 hour ago"
    // summary="You liked Steve's drink."
    
    //   />
    // <Feed.Event
    // icon="pencil"
    // date="3 hours ago"
    // summary="You liked Harry's drink."
    
    //   />
    //   <Feed.Event
    // icon="pencil"
    // date="Today"
    // summary="You liked Kyle's drink."
    
    //   />
   
    
    // </Feed>
    // </Container>
    