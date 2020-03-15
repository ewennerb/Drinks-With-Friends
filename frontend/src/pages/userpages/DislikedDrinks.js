import React, { Component } from 'react';

import {
  Feed,
  Container,
  // Grid,

  // Icon,

} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';

class DislikedDrinks extends Component{
  render(){
    return (
               
      <Container>
      <Feed>
    <Feed.Event
    icon="pencil"
    date="2 hour ago"
    summary="You diliked Stella's drink."
    
      />
    <Feed.Event
    icon="pencil"
    date="3 hours ago"
    summary="You disliked Harold's drink."
    
      />

    <Feed.Event
    icon="pencil"
    date="Today"
    summary="You disliked Karen's drink."
    
      />
   
    
    </Feed>
    </Container>
    
    );
  }
}

export default DislikedDrinks;
