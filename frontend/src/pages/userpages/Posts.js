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

import {ingredientCard, postCard} from "../utils";
import DrinkCard from "../DrinkCard.js";
import {config} from '../../config/config'
import 'semantic-ui-css/semantic.min.css';

class Posts extends Component{
  constructor(props) {
    super(props);
    let User = props.User;

    this.state = {
      // userName: User.userName,
      // posts: User.posts,
      browser: props.user,
      profile: props.match.params.profile,
      User: User,
      // allDrinks: props.allDrinks,
      // Drinks: props.Drinks,
    };

  }
  async componentDidMount(){
    //console.log(match.params)
  //   let userPage = this.state.profile;
    
  //   if (userPage != undefined){
  //   await this.getPosts();
  //   //should have posts and drinks
  //   console.log(this.state.posts);
  //   let userDrinks =[];
  //   if (this.state.Drinks != undefined) {
  //   this.state.Drinks.map((drink) => {
  //     // console.log(index)
  //     if (drink.publisher === userPage){
  //           console.log(drink);
  //           userDrinks.push(drink);
  //     }
  //   })
  //   //putting that profiles drinks in state
  //   this.setState({userDrinks: userDrinks});
  //   }
  //  }
  }

  render(){

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
                    return(postCard(post))
                })
              }
                <br/>
              <Segment>
                 <Header>{this.state.profile}'s Published Drinks</Header>
              </Segment>

              <br/>
              
              {(this.state.userDrinks == undefined || this.state.userDrinks.length < 1)
                ? <Header>No Drinks Found</Header>
                : this.state.userDrinks.map((drink, index) => {
                    // console.log(drink);
                    return(
                      <DrinkCard
                        user={this.state.userName}
                        index={index}
                        drink={drink}
                        passState={this.state.passState}
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
  }// end of render


  async getPosts() {
    //get posts
    let User = this.state.User;
    let userName = this.state.userName;
    if (this.isValidInput(userName)){
    
      await fetch(config.url.API_URL + '/post/'+userName, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      }).then(res => res.json()).then((data) => { //dk tbh
          console.log(data);
          
          this.setState({posts: data});
      }).catch(console.log);
    }
    

    
  }// end of getposts

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