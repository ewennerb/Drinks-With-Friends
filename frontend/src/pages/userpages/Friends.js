import React, { Component } from 'react';
import {userCardFollowed} from "../utils";
import {Link} from 'react-router-dom';
import {Input, Segment, Grid, Loader, Button, Form, FormCheckbox, Header, Accordion, GridColumn, GridRow} from 'semantic-ui-react'
import {config} from '../../config/config'

// import {
//   Feed,
//   Grid,
//   Container,
//   Icon,

// } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';



class Friends extends Component{
  constructor(props){
    super(props);
    this.handleGetFollowing = this.handleGetFollowing.bind(this);

    console.log(this.props.location.state);
    this.state = {
        user: this.props.location.state,
        results: [],
        recevied: false
    }
  }

  async handleGetFollowing() {
    await fetch(config.url.API_URL + '/user/getFollowing/' + this.state.user, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
  }).then(res => res.json()).then(async (data) => {
      console.log(data);
      await this.setState({results: data})
  }).catch(console.log);

  }

  async componentDidMount() {
    console.log(this.state.user);
    await this.handleGetFollowing();
    if (this.state.results != undefined) {
      this.setState({recevied: true});
    }
  }

  render(){

    console.log(this.props.userName);
    let search;

    if (this.state.received) {
      search = 
      <div>
      {this.state.results === undefined
        ? <Header textAlign="center">No Results Found</Header>
        : this.state.results.map((result, index) => {
            console.log(result.followedFlag)

            if (result.userName == this.state.user) { //If when searching and yourself comes up, do not display
                console.log("yourself!");
            }
            else { //if user IS already followed by user, display unfollow card
                return (userCardFollowed(index, result.userName, result.photo, this.state.user))
            }
            

        })
    }
    </div>
    }

  else {
    search = <Header textAlign="center">No Results Found</Header>
  }


    return (
    <div>
      {search}
    </div>
    );
  } 

}

export default Friends;
