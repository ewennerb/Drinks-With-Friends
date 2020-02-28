import React, { Component } from 'react';

import {
  Feed,
  Grid,
  Container,
  Icon,

} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';

class LikedDrinks extends Component{
  super(props){
    this.state = {
      user: this.props.user,
    }
  }

  render(){
    return (
        
      <Container>
      <Feed>
    <Feed.Event
    icon="pencil"
    date="1 hour ago"
    summary="You liked Steve's drink."
    
      />
    <Feed.Event
    icon="pencil"
    date="3 hours ago"
    summary="You liked Harry's drink."
    
      />
      <Feed.Event
    icon="pencil"
    date="Today"
    summary="You liked Kyle's drink."
    
      />
   
    
    </Feed>
    </Container>
    
    );
  }
}

export default LikedDrinks;
