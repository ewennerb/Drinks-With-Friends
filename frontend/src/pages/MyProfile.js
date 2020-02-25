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
import LikedDrinks from "./LikedDrinks.js"


//import "../css/Profile.css"

class Profile extends Component{
  constructor(props) {
    super(props);
    
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      modalOpen: false, 
      activeItem: "posts"
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
          <Grid.Column color="blue">
          <Icon name="user circle outline" size="massive"/>
          </Grid.Column>
          
          <Grid.Column >
          
          </Grid.Column>
          
          <Grid.Column color="red">
          <Button animated="fade" onClick={this.handleOpen}>
          <Button.Content visible>Edit Profile</Button.Content>
          <Button.Content hidden>
          <Icon name="edit"/>
          </Button.Content>
          </Button>
          
          </Grid.Column>/>
          </Grid.Row>
          
          <Grid.Row >
          
          <Grid.Column width={10} color="green" >
          <Menu  pointing secondary stackable >
          <Menu.Item
          //  this one will be hard to decide how to do 
           name="posts"
           
            active={activeItem === "posts"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="likedDrinks"
            as={Link}
            to={{pathname: './likedDrinks'}}
            active={activeItem === "likedDrinks"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="dislikedDrinks"
            as={Link}
            to={{pathname: './dislikedDrings'}}
            active={activeItem === "dislikedDrinks"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="map"
            active={activeItem === "map"}
            onClick={this.handleItemClick}
          
          />
          <Menu.Item
            name="friends"
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
              <Route exact path="./likedDrinks" component={LikedDrinks}/>

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