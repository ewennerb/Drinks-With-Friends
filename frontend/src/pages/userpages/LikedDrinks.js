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
import DrinkCard from "../DrinkCard.js";
import 'semantic-ui-css/semantic.min.css';
import {config} from '../../config/config'
class LikedDrinks extends Component{
  constructor(props){
  super(props)
 
    let User = props.User;

    this.state = {
    // userName: User.userName,
    // posts: User.posts,
    browser: props.user,
    profile: props.match.params.profile,
    userLocation: props.userLocation,
    User: User,
    likedDrinks: {},
    // Drinks: props.Drinks,
    };
  }

  async componentDidMount(){
    // if (this.state.User != undefined){
    //   if (this.state.likedDrinks == undefined){
    //   this.getLikedDrinks(this.state.profile);
    //   console.log(this.state.likedDrinks)
    //   }
    this.getLikedDrinks(this.state.profile);
    // }
    // let userPage = this.state.profile;
    
    // if (userPage != undefined && this.state.Drinks != undefined){
    // let Drinks = this.state.Drinks;
    // //let likedDrinks = [];

    // await this.getLikedDrinks(userPage);
    // //console.log(this.state.likedDrinks);
    // let likedDrinks = this.state.likedDrinks;
    // for(let id in likedDrinks) {
    //     console.log(id)
    //     console.log(likedDrinks[id])
    // }
    
    //go through the drinks with id and find ones this profile liked
    
    
    // }) // end of map
     //end of map
    //putting that profiles drinks in state
    // if (likedDrinks != undefined) {
    //   this.setState({likedDrinks: likedDrinks});
    // }
   //}//end if userpage !+ undef
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
            {(this.state.likedDrinks === undefined || this.state.likedDrinks.length < 1)
              ? <Header>No Liked Drinks Found</Header>
              : this.state.likedDrinks.map((drink, index) => {
                  return(
                    <DrinkCard
                    user={this.state.profile}
                    index={index}
                    drink={drink}
                    key={index}
                    userLocation={this.state.userLocation}
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

    )
  };



  async getLikedDrinks(user) {
    await fetch(config.url.API_URL + '/user/getLikedDrinks/'+user, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      }).then(res => res.json()).then((data) => { 
          console.log((data));
          //JSON.parse
          // let likedDrinks = [];
          this.setState({likedDrinks: data});
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
    