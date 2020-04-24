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

    this.state = {
        user: this.props.location.state.user,
        results: [],
        received: false
    }
    console.log(this.state.user);
  }

  async handleGetFollowing() {
    let results = [];

    await fetch(config.url.API_URL + '/user/getFollowing/' + this.state.user, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
  }).then(res => res.json()).then(async (data) => {
      console.log(data);

      results = data;
  }).catch(console.log);

  return results;

  }

  async componentDidMount() {
    let x;
    console.log(this.state.user);
    x = await this.handleGetFollowing();
    if (x != undefined && x != []) {
      this.setState({received: true, results: x});

    }
  }

  render(){

    let search;

    if (this.state.received) {
      console.log(this.state.results);

      search = 
      <div>
      {this.state.results === undefined
        ? <Header textAlign="center">No Results Found</Header>

        : this.state.results.results.map((result, index) => {

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
