import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import {
  Menu,
  Grid,
  Icon,
  Button,
  Container,
  Modal,
  Header,
  Segment,
  
} from "semantic-ui-react";
import LikedDrinks from "./userpages/LikedDrinks.js"
import DislikedDrinks from "./userpages/DislikedDrinks.js"
import Map from "./userpages/Map.js"
import Friends from "./userpages/Friends.js"
import Posts from "./userpages/Posts.js"
//import "../css/Profile.css"

class Profile extends Component{
  constructor(props) {
    super(props);
    
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      modalOpen: false, 
      activeItem: "posts",
      user: this.props.user
    };
}

handleClose() {
    this.setState(
        {
            modalOpen: false
        }
    )
}

handleOpen() {
    this.setState(
        {
            modalOpen: true
        }
    )
}
  

  handleItemClick = (e, {name}) => {
    this.setState({ activeItem: name })
    console.log(name)
  }

  render(){
    const { activeItem } = this.state.activeItem

    return(
      <Container>
        <BrowserRouter>
          <Grid className="grid" columns={3} container padded relaxed textAlign="center">
          <Grid.Row container>
          <Grid.Column  
            as={Link}
            to={{pathname: `/${this.state.user}/posts`}}
          >
          <Icon name="user circle outline" size="massive"/>
          </Grid.Column>
          
          <Grid.Column container textAlign="left">
            <h2>Bio:</h2>
            
          </Grid.Column> 
          
          <Grid.Column textAlign="center" verticalAlign="middle" floated="left">
            <Button animated="fade" onClick={this.handleOpen}  >
            <Button.Content visible>Edit Profile</Button.Content>
            <Button.Content hidden>
            <Icon name="edit"/>
            </Button.Content>
            </Button>
          </Grid.Column>
          </Grid.Row>
          
          <Grid.Row centered columns={1} textAlign="right">          
            {/* <Grid.Column stretched width={4}/> */}
            <Grid.Column stretched verticalAlign="middle" >
            <Menu  pointing secondary floated="right" widths={6}>
            <Menu.Item
            //  this one will be hard to decide how to do 
              name="posts"
              as={Link}
              to={{pathname: `/${this.state.user}/posts`}}
              active={activeItem === "posts"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="likedDrinks"
              as={Link}
              to={{pathname: `/${this.state.user}/likedDrinks`}}
              active={activeItem === "likedDrinks"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="dislikedDrinks"
              as={Link}
              to={{pathname: `/${this.state.user}/dislikedDrinks`}}
              active={activeItem === "dislikedDrinks"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="map"
              as={Link}
              to={{pathname: `/${this.state.user}/map`}}
              active={activeItem === "map"}
              onClick={this.handleItemClick}
          
            />
            <Menu.Item
              name="friends"
              as={Link}
              to={{pathname: `/${this.state.user}/friends`}}
              active={activeItem === "friends"}
              onClick={this.handleItemClick}
            />
            </Menu>

            </Grid.Column>
          </Grid.Row>
          
          <Grid.Column>
          lists of shit
          
          </Grid.Column>
          <Grid.Row>
          <Segment basic placeholder>
            <Switch>
              <Route exact path="/:user/posts" component={Posts} />
              <Route exact path="/:user/likedDrinks" component={LikedDrinks}/>
              <Route exact path="/:user/dislikedDrinks" component={DislikedDrinks}/>
              <Route exact path="/:user/map" component={Map}/>
              <Route exact path="/:user/friends" component={Friends}/>
            </Switch>
          </Segment>
          </Grid.Row>
          </Grid>
          

          {/* profile edit modal */}
          <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size="large">
          <Modal.Content image >
          {/*display current profile info with the option to change it */}
          
          <Header as='h2' color='grey' textAlign='center'>Edit Profile</Header>
          {/* need to add profile picture and how to store kind of confused */}
          
          </Modal.Content>
          </Modal>
          
        </BrowserRouter>
      </Container>  
    )
  }
}

export default Profile