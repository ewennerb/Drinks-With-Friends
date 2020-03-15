import React, { Component } from 'react';

import {
  Feed,
  //Grid,
  Container,
  Icon,

} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';

class Posts extends Component{
  render(){
    return (
        <Container  >
            post #1 surprise

            <Container>
              <Feed>
            <Feed.Event
            icon="pencil"
            date="Today"
            summary="You liked Steve's drink."
            
            />
            <Feed.Event>
          
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>Steve</Feed.User> added you as a friend
                  <Feed.Date>1 Hour Ago</Feed.Date>
                </Feed.Summary>
                <Feed.Meta>
                  <Feed.Like>
                    <Icon name='like' />4 Likes
                  </Feed.Like>
                </Feed.Meta>
              </Feed.Content>
            </Feed.Event>

            <Feed.Event>
            
              <Feed.Content>
                <Feed.Summary>
                  You created an account.
                  <Feed.Date>4 days ago</Feed.Date>
                </Feed.Summary>
            
                <Feed.Meta>
                  <Feed.Like>
                    <Icon name='like' />1 Like
                  </Feed.Like>
                </Feed.Meta>
              </Feed.Content>
            </Feed.Event>

            
            </Feed>
            </Container>
            
        </Container>
    );
  }
}

export default Posts;
