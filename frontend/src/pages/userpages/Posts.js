import React, { Component } from 'react';

import {
  Feed,
  Grid,
  Container,
  Icon,
  Header,
  Segment,
  Card,
  Image,
} from 'semantic-ui-react';
import {PostCard} from "../PostCard.js"
import {ingredientCard} from "../utils";
import DrinkCard from "../rDrinkCard.js";
import {config} from '../../config/config'
import 'semantic-ui-css/semantic.min.css';

class Posts extends Component{
  constructor(props) {
    super(props);
    let User = props.User;

    this.state = {
      // userName: User.userName,
      // posts: User.posts,
      browser: props.browser,
      profile: props.profile,
      userLocation: props.userLocation,
      User: User,
      profileOwner: props.profileOwner,
      loaded: false
    };

  }
  async componentDidMount(){
    //console.log(match.params)
  //   let userPage = this.state.profile;
    
  //   if (userPage != undefined){
    let posts = await this.getPosts(this.state.profile);
    let drinks = await this.getPublishedDrinks(this.state.profile);
    this.setState({
        posts: posts,
        publishedDrinks: drinks,
        loaded: true
    })
  //   //should have posts and drinks
  //   console.log(this.state.posts);
  //  }
  }

  render(){

      if(this.state.loaded === true){
          return (
              <Container  >

                  <Grid style={{height: '100vh', overflowY: 'scroll'}} columns={16} centered>
                      <Grid.Column width={4}/>
                      <Grid.Column width={8} textAlign="center">
                          <Grid.Row centered>
                              <br/>
                              <Segment>
                                  <Header>{this.state.profile}'s Posts</Header>
                              </Segment>
                              {/* so what the fuck are posts? im more confused */}
                              {(this.state.posts == undefined || this.state.posts.length < 1)
                                  ? <Header>No Posts Found</Header>
                                  : this.state.posts.map((post, index) => {
                                      //console.log(post);
                                      return(<PostCard post={post} user={this.state.browser}/>)
                                  })
                              }
                              <br/>
                              <Segment>
                                  <Header>{this.state.profile}'s Published Drinks</Header>
                              </Segment>

                              <br/>

                              {(this.state.publishedDrinks == undefined || this.state.publishedDrinks.length < 1)
                                  ? <Header>No Drinks Found</Header>
                                  : this.state.publishedDrinks.map((drink, index) => {
                                      // console.log(drink);
                                      return(
                                          <DrinkCard
                                              user={this.state.userName}
                                              index={index}
                                              drink={drink}
                                              userLocation={this.state.userLocation}
                                              profileOwner={this.state.profileOwner}
                                          />
                                          // rodsDrinkCard ({
                                          //   user: this.state.userName,
                                          //   index: {index},
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
          ); //end of return
      }else{
          return(
              <Segment basic loading placeholder/>
          )
      }

  }// end of render




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

  async getPosts(userName) {
    //get posts
    let posts = [];
    if (this.isValidInput(userName)){
    
      await fetch(config.url.API_URL + '/post/'+userName, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      }).then(res => res.json()).then(async (data) => { //dk tbh
          console.log(data);
          // I took out a bunch of setStates so that it renders better now - EJ
          for (let i = 0; i < data.length; i++) {
              data[i].userName = this.state.profile;
              console.log(data[i].userName);
              let names = {};
              await fetch(config.url.API_URL + "/user/"+this.state.profile, {
                  method: 'GET',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                  },
              }).then(res => res.json()).then(async (data2) => {
                  names = data2;
                  console.log(data2)
              }).catch(err => {
                  console.log(err)
              });
              data[i].profileImage = names.photo

          }
          posts = data;

      }).catch(console.log);
      return posts;
    }
    

    
  }// end of getposts
  async getPublishedDrinks(user) {
      let drinks = [];
      await fetch(config.url.API_URL + '/user/getPublishedDrinks/'+user, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        }).then(res => res.json()).then((data) => {
            console.log((data));
            //JSON.parse
            // let likedDrinks = [];
            drinks = data;
            // this.setState({publishedDrinks: data});
      }).catch(console.log);
      return drinks;
  }
  

}



export default Posts;
//ejs drinkcard
export const rodsDrinkCard = (props) => {
  //console.log(props)
  let drink = props.drink;
  let index = props.index;
  let drinkPic;
  if(drink.photo !== ""){
      drinkPic = <Image floated="right" size="small" src={`data:image/jpeg;base64,${drink.photo}`} data-testid={"drink-b64-img-" + index.toString()}/>
  }else{
      drinkPic = <Image floated="right" size="small" src={process.env.PUBLIC_URL + "/placeholder-drink.png"} data-testid={"drink-placeholder-img-" + index.toString()}/>
  }
  
  return (
   <Card centered style={{width: "450px"}} data-testid={"drink-card-" + index.toString()}>
    {/*<Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>*/}
    <Card.Content>
        <Card.Header textAlign="left" data-testid={"drink-name-" + index.toString()}>{drink.name}</Card.Header>
        <Card.Meta textAlign="left" data-testid={"drink-publisher-" + index.toString()}>{drink.publisher}</Card.Meta>
    </Card.Content>
    <Card.Content textAlign="left">
        {drinkPic}
        <div>
            <p><strong>Description: </strong></p>
            <Card.Description data-testid={"drink-description-" + index.toString()}>{drink.description}</Card.Description>

        </div>

    </Card.Content>
      {/* 
      <Card.Content>
          {likes}
      </Card.Content> */}
    </Card>
  )
  
}


//feed example post #1 surprise
          //   <Container>
          //   <Feed>
          // <Feed.Event
          // icon="pencil"
          // date="Today"
          // summary="You liked Steve's drink."
          // />
          // <Feed.Event>
          //   <Feed.Content>
          //     <Feed.Summary>
          //       <Feed.User>Steve</Feed.User> added you as a friend
          //       <Feed.Date>1 Hour Ago</Feed.Date>
          //     </Feed.Summary>
          //     <Feed.Meta>
          //       <Feed.Like>
          //         <Icon name='like' />4 Likes
          //       </Feed.Like>
          //     </Feed.Meta>
          //   </Feed.Content>
          // </Feed.Event>
          // <Feed.Event>
          //   <Feed.Content>
          //     <Feed.Summary>
          //       You created an account.
          //       <Feed.Date>4 days ago</Feed.Date>
          //     </Feed.Summary>
          //     <Feed.Meta>
          //       <Feed.Like>
          //         <Icon name='like' />1 Like
          //       </Feed.Like>
          //     </Feed.Meta>
          //   </Feed.Content>
          // </Feed.Event>
          // </Feed>
          // </Container>