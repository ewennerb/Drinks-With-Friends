import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker, P } from "react-google-maps";
import {Search, Segment, Header, List, Icon, Button, Container, Grid, Message} from "semantic-ui-react";
import Geocode from "react-geocode";
import _ from 'lodash';
import {config} from '../../config/config'

import { compose } from "recompose"
Geocode.setApiKey( "AIzaSyA0jKEk1Wwq_0Ny1z7y70JyE_4XJhho15k" );
Geocode.enableDebug();




class Map extends Component{
  constructor( props ){
      super( props );
      this.state = {
          //rod
          browser: props.browser,
          profile: props.profile,
          userLocation: props.userLocation,
          userlat: props.userLocation.lat,
          userlng: props.userLocation.lng,
          User: props.User,
          profileOwner: props.profileOwner,
          posts: [],
          tags: [],
          places: [],
          markerPosition: props.userLocation,
      };
      this.createMarkers = this.createMarkers.bind(this); 
     
      this.createList = this.createList.bind(this);
  }
  async componentDidMount(){
    //console.log(match.params)
  //   let userPage = this.state.profile;
    
  //   if (userPage != undefined){
    let posts = await this.getPosts(this.state.profile);
    this.setState({
        posts: posts,
    })
    this.createMarkers();

  }

  createMarkers() {
    let geotags = [];
    let places = [];
    this.state.posts.map(async (post,index) => {
      await Geocode.fromAddress(post.geolocation).then(
        response => {
           const { lat, lng } = response.results[0].geometry.location;
           //console.log("geo locations ;): " + lat + " " + lng);
           geotags.push({lat,lng});

           //this.state.tags.push({lat,lng});
           let place = {name: response.results[0].formatted_address,pos:{lat,lng}}
           places.push(place);
        }, error => {
          //console.error(error);
        });
    })
    this.setState({places: places})
 
    // this.state.tags.map(tag =>{
    //   console.log("Fuck")
    //   console.log(tag)
    // })
   
  }
  createList () { 
    return this.state.places.map((place, index) => { 
      console.log(place)
      return (<Segment key={index} id={index}
      pos={place.pos}
     onClick={this.setState({markerPosition: place.pos })} 
     content={place.name}
     /> )
    }) 
  } 

  

 
    render(){
      let lat, lng;
      
        const AsyncMap = compose(withScriptjs, withGoogleMap)(props => {
                  return (
                  <GoogleMap id="map" google={this.props.google}
                    defaultZoom={5}
                    

                    defaultCenter={{ lat: this.state.userlat, lng: this.state.userlng }}
                  >
                   {/* {this.displayMarkers()} */}
                  <Marker
                     google={this.props.google}
                    position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                    />
                  </GoogleMap>
                  )
              });
            return(
              <Grid>
              <Segment>
              <Segment>
                  <Header>{this.state.profile}'s Geotags</Header>
              </Segment>
              <Segment style={{height: '100vh', overflowY: 'scroll'}}>
              { console.log(this.state.places.length) }
              {(this.state.places == undefined || this.state.places.length <1)
                ? <Header>No Places Found</Header>
                : this.state.places.map(place => {
                    console.log(place);
                    return(
                        <Header>fuck</Header>
                    )
                })
               }
                     {console.log("FUCK")}
              </Segment>

              <AsyncMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0jKEk1Wwq_0Ny1z7y70JyE_4XJhho15k&libraries=geometry,drawing,places"
              loadingElement={
              <div style={{ height: '75vh', width: '75vh' }} />
              }
              containerElement={
              <div style={{ height: '75vh', width:'75vh' }} />
              }
              mapElement={
              <div id="map" style={{ height: `100%`, width: `100%`}} />
              }
              />
              </Segment>
              </Grid>

            );
    }
    //killnme
    isValidInput(input) {
      return !(input == undefined || input === '' || input == null);
    }
    
    ifNullthenEmpty(str) {
      if(str === null || str === undefined || str === ''){
        return '';
      } else {
        return str;
      }
    } 


    async getPosts(userName) {
      //get posts
      let posts = [];
      if (this.isValidInput(userName)){
      
        await fetch(config.url.API_URL + '/post/'+userName, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        }).then(res => res.json()).then(async (data) => { //dk tbh
            //console.log(data);
            // I took out a bunch of setStates so that it renders better now - EJ
            for (let i = 0; i < data.length; i++) {
                data[i].userName = this.state.profile;
                //console.log(data[i].userName);
                let names = {};
                await fetch(config.url.API_URL + "/user/"+this.state.profile, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(res => res.json()).then(async (data2) => {
                    names = data2;
                    //console.log(data2)
                }).catch(err => {
                    console.log(err)
                });
                data[i].profileImage = names.photo
  
            }
            posts = data;
  
        }).catch(console.log);
        return posts;
      }
      
    }// end of getposts
}

export default Map;

const Location = () => (
  <Message>
    <Message.Header>Changes in Service</Message.Header>
    <p>
      We updated our privacy policy here to better service our customers. We
      recommend reviewing the changes.
    </p>
  </Message>
)
