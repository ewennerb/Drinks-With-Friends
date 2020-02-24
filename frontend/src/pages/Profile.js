import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import {
  Menu,
  Grid,
  Icon,
  

} from "semantic-ui-react";


import "../css/Profile.css"

class Profile extends Component{
  constructor(props){
    super(props)
    this.state = { activeItem: "posts"}
  }

  handleItemClick = (e, {name}) => {
    this.setState({ activeItem: name })
    console.log(name)
  }

  render(){
    const { activeItem } = this.state.activeItem

    return(
      <div>
        
        <Grid className="grid" columns={3} container centered padded relaxed>
          <Grid.Row >
            <Grid.Column color="blue">
              <Icon name="user circle outline" size="massive"/>
            </Grid.Column>
          
            <Grid.Column >
           
            </Grid.Column>

            <Grid.Column color="red"/>
          </Grid.Row>

          <Grid.Row>
          
            <Grid.Column width={10} color="green">
            <Menu  pointing secondary stackable>
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



          </Grid.Row>
        </Grid>

      </div>  
    )
  }

}

export default Profile