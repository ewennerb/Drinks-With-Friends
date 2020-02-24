import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import {
  Menu,
  Grid,
  Icon,
  Button,
  Container,
  Modal,
  Header,
  Feed,

} from "semantic-ui-react";


//import "../css/Profile.css"

class Profile extends Component{
  constructor(props) {
    super(props);
    
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {modalOpen: false, activeItem: "posts"};
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
                name="posts"
                active={activeItem === "posts"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="likedDrinks"
                active={activeItem === "likedDrinks"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="dislikedDrinks"
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
          <Feed>


          </Feed>

          </Grid.Row>
        </Grid>

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

      </Container>  
    )
  }

}

export default Profile