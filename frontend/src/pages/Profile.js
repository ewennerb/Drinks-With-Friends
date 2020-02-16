import React, { Component } from "react";
import {
  Menu,
  Segment,

} from "semantic-ui-react";


class Profile extends Component{
  constructor(props){
    super(props)
    
  }

  handleItemClick = (e, {name}) => this.setState({ activeItem: name })

  state = { activeItem: "posts" }


  render(){
    const { activeItem } = this.state.activeItem

    return(
      <div>
        <h1>littlbitch</h1>

        <Menu attached="top" pointing secondary>
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


        </Menu> 

      </div>  
    )
  }

}

export default Profile