import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Route, Switch, Link, Redirect, } from "react-router-dom";
import {
  Menu,
  Grid,
  Icon,
  Button,
  Container,
  Modal,
  Header,
  Segment,
  Form, 
  //Message,
  Image,
} from "semantic-ui-react";
import LikedDrinks from "./userpages/LikedDrinks.js"
import DislikedDrinks from "./userpages/DislikedDrinks.js"
import Map from "./userpages/Map.js"
import Friends from "./userpages/Friends.js"
import Posts from "./userpages/Posts.js"
import {config} from '../config/config'
var base64 = require('base-64');
//import "../css/Profile.css"

class Profile extends Component{
  constructor(props) {
    super(props);
    
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleOpen2 = this.handleOpen2.bind(this); //Paul added
    // this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);    
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleFavoriteDrinkChange = this.handleFavoriteDrinkChange.bind(this);

    this.fileReader = new FileReader();
    this.handleFileRead = this.handleFileRead.bind(this)
    //im so sorry its too late to change user to username so ill do capital u fro teh object ;)
    this.fileInputRef = React.createRef();
    
    //let User = props.UserObject;
    this.state = {
      modalOpen: false, 
      activeItem: "posts",
      browser: localStorage.getItem("username"),
      profile: props.match.params.profile,
      User: {},
      
    }
  }

  async componentDidMount(){
    // getting user
    // let userPage = this.state.profile;
    //todo always request user profile
    //let User = this.state.User;
    await navigator.geolocation.getCurrentPosition(
      async(position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude);
          console.log(longitude);
          await this.setState({
              userLocation: { lat: latitude, lng: longitude },
          });
      },
     
    );
    this.getUser(this.state.profile);
    
    // if (User != undefined){
    //   if (User.likedDrinks == undefined){
    //     await this.getLikedDrinks(this.state.profile);
    //   }
    //   if (User.dislikedDrinks == undefined){
    //     await this.getDislikedDrinks(this.state.profile);
    //   }
    // }
 
  
    
  }// end of component did mount


  handleClose() {
    this.setState({
      modalOpen: false,   
    })
  }

  handleOpen() {
      this.setState({
      modalOpen: true
    }) 
  }

  handleItemClick = (e, {name}) => {
    this.setState({ activeItem: name })
    console.log(name)
  }

  render(){

    const { activeItem } = this.state.activeItem
    let notUser = <p/>;
    // if (this.props.user === "" || this.props.user === undefined){
    //   notUser =
    //       <Modal open={true}>
    //         <Segment stacked>
    //           <h1>Create an Free Account!</h1>
    //           <p>
    //             <Link to='/register'>Sign up </Link> for Drinks With Friends to create your own drinks and save your favorites from others!
    //             <Message>
    //               <Icon name='help'/>
    //               Already signed up?&nbsp;<Link to='/login'>Login here</Link>&nbsp;instead.
    //             </Message>
    //           </p>

    //         </Segment>
    //       </Modal>
    // }

    let currentUser = localStorage.getItem("username");

    //vars
    let editProfile = <p/>;
    let favoriteDrink = <p/>;
    let pfp;
    //methods
    console.log(this.state)
    console.log(this.state.profile === this.state.browser)
    if (this.state.profile === this.state.browser) {
        //allow the option to edit profile
        editProfile = 
        <Grid.Column textAlign="center" verticalAlign="middle" floated="left">
          <Button animated="fade" onClick={this.handleOpen}  >
          <Button.Content visible>Edit Profile</Button.Content>
          <Button.Content hidden>
          <Icon name="edit"/>
          </Button.Content>
          </Button>
        </Grid.Column>

    } else {
      //follow button
      console.log("that not u");
    }
    //check if fav drink is undefined or empty
    if (this.isValidInput(this.state.favoriteDrink)){
      favoriteDrink = 
      <p>My favorite drink is {this.state.favoriteDrink}</p>
    }
    if (this.state.photo === null || this.state.photo === "" ){
      pfp = <Image size="small" src={process.env.PUBLIC_URL + "/nopfp.png"} />
      //what this data-testid={"user-placeholder-img-"}
    } else {
      pfp = <Image size="small" src={`data:image/jpeg;base64,${this.state.photo}`}/>
    }

    return(
      <Container>
        <BrowserRouter>
          {notUser}
          <Grid className="grid" columns={3} padded relaxed textAlign="center">
          <Grid.Row>
          <Grid.Column  
            as={Link}
            to={{pathname: `/${this.state.profile}/posts`}}
          >
          {pfp}

          </Grid.Column>
          
          <Grid.Column textAlign="left">
            <h2>{this.ifNullthenEmpty(this.state.User.name)}</h2>
            <h3>&nbsp;{this.ifNullthenEmpty(this.state.profile)}</h3>
            {/* bio */}
            <p>{this.state.bio}</p>
            {/* favorite drink */}
            {favoriteDrink}

          </Grid.Column> 
          
          {editProfile}
          {/* {editUsername} */}

          </Grid.Row>
          
          <Grid.Row centered columns={1} textAlign="right">          
            {/* <Grid.Column stretched width={4}/> */}
            <Grid.Column stretched verticalAlign="middle" >
            <Menu  pointing secondary floated="right" widths={6}>
            <Menu.Item
            //  this one will be hard to decide how to do 
              name="posts"
              as={Link}
              to={{pathname: `/${this.state.profile}/posts` }}
              active={activeItem === "posts"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="likedDrinks"
              as={Link}
              to={{pathname: `/${this.state.profile}/likedDrinks`}}
              active={activeItem === "likedDrinks"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="dislikedDrinks"
              as={Link}
              to={{pathname: `/${this.state.profile}/dislikedDrinks`}}
              active={activeItem === "dislikedDrinks"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="map"
              as={Link}
              to={{pathname: `/${this.state.profile}/map`}}
              active={activeItem === "map"}
              onClick={this.handleItemClick}
          
            />
            <Menu.Item
              name="friends"
              as={Link}
              to={{pathname: `/${this.state.profile}/friends`}}
              active={activeItem === "friends"}
              onClick={this.handleItemClick}
            />
            </Menu>

            </Grid.Column>
          </Grid.Row>
          
          <Grid.Column>
        
          
          </Grid.Column>
          <Grid.Row>
          <Segment basic placeholder>
            <Switch>
              {/* <Route exact path="/:profile" component={({match}) => <Posts User={this.state.User} profile={this.state.profile}
                 Drinks={this.state.Drinks} match={match}  />} /> */}
              <Route exact path="/:profile/posts" component={({match}) => <Posts User={this.state.User} profile={this.state.profile}
                 userLocation={this.state.userLocation} browser={this.state.browser} match={match}  />} />
              <Route exact path="/:profile/likedDrinks" component={({match}) => <LikedDrinks User={this.state.User} profile={this.state.profile} 
                  userLocation={this.state.userLocation} browser={this.state.browser} match={match}  />}/>
              <Route exact path="/:profile/dislikedDrinks" component={({match}) => <DislikedDrinks User={this.state.User} profile={this.state.profile} 
                  userLocation={this.state.userLocation} browser={this.state.browser} match={match}  />}/>
              
              <Route exact path="/:profile/map" component={({match}) => <Map User={this.state.User} profile={this.state.profile} 
                  userLocation={this.state.userLocation} match={match}/>}/>
               <Route exact path="/:profile/friends" component={Friends}/>
            </Switch>
          </Segment>
          </Grid.Row>
          </Grid>
          

          {/* profile edit modal */}

          <Grid>
          <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size="large">
          <Modal.Content image scrolling>
          {/*display current profile info with the option to change it */}
          <Container>
          <Header as='h2' color='grey' textAlign='center'>Edit Profile</Header>
          <br/>
          
          <Form size='large'>
          <Segment stacked>
          {/* file input */}
          <Button
            content="Choose File"
            labelPosition="left"
            icon="file"
            onClick={() => this.fileInputRef.current.click()}
          />
          <input
              ref={this.fileInputRef}
              type="file"
              hidden
              onChange={this.handleFileSelect}
          />
          {/* <Form.Input
            type="file"
            accept="image/gif, image/jpeg, image/png"
            id="imageselector"
            onChange={this.handleFileSelect}
          /> */}
         {/* username change input */}
          <Form.Input
            fluid icon='user'
            iconPosition='left'
            placeholder={this.state.profile}
            onChange={this.handleUsernameChange}
          />
          {/* password chang einput */}
          <Form.Input
          fluid icon='lock'
          iconPosition='left'
          placeholder='Password'
          value={this.state.password}
          onChange={this.handlePasswordChange}
          />
          {/* bio change input */}
          <Header as='h2' color='grey' textAlign='center'>Bio</Header>
          <Form.Input
          fluid
          value={this.ifNullthenEmpty(this.state.bio)}
          onChange={this.handleBioChange}
          />
          {/* favorite drink change input */}
          <Form.Input
          fluid icon='beer'
          placeholder='My Favorite Drink Is:'
          iconPosition='left'
          value={this.ifNullthenEmpty(this.state.favoriteDrink)}
          onChange={this.handleFavoriteDrinkChange}
          />
          
          <Button onClick={this.handleSubmit} color='yellow' fluid size='large'>
          Update
          </Button>
          </Segment>
          </Form>
          {/* need to add profile picture and how to store kind of confused */}
          
          </Container>
          
          </Modal.Content>
          </Modal>
          </Grid>
      
        </BrowserRouter> 
      </Container> //end container
    )
  }//end render

  handleFileRead = (e) => {
    let res = base64.encode(this.fileReader.result);
    this.setState({fileString: res, photo: res, profilePhoto: res})
  }
  //form input on change functions
  async handleFileSelect(event) {
    let file = event.target.files[0];
    let filename = event.target.files[0].name;
    this.fileReader = new FileReader();
    this.fileReader.onload = this.handleFileRead;
    await this.fileReader.readAsBinaryString(file);
    this.setState({photo: file, filename: filename});
    // event.preventDefault();
    // //const value = event;
    // //how to convert to 64base or get image data
    // let input = document.getElementById(id);
    // //console.log(input);
    // let image = input.files[0];
    // //console.log(image)
    // let imgstring = await base64.encode(image.name);
    // console.log(imgstring);
    // this.setState({photo: imgstring , profilePhoto: imgstring})
  }
  async handleUsernameChange(event) {
    const value = event.target.value;
    await this.setState({profile: value});
  }

  async handlePasswordChange(event) {
    const value = event.target.value;
    await this.setState({password: value});
  };
  async handleBioChange(event) {
    const value = event.target.value;
    await this.setState({bio: value});
  };

  async handleFavoriteDrinkChange(event) {
    let value = event.target.value;
    await this.setState({favoriteDrink: value});
  }
  //end of forminput on change functions


  async handleSubmit() {
    //submitting everything from the modal
    let User = this.state.User;
    //profile pic
    if (this.isValidInput(this.state.fileString) && this.state.photo != User.photo ){
      //let photo = base65.encode(this.state.fileString);
      await fetch(config.url.API_URL+'/user/saveProfilePic/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: this.state.profile,
            password: '',
            phoneNumber: '',
            name: '',
            email: '',
            photo: this.state.fileString,
            profilePhoto: this.state.fileString,
        }) //istill dont know whether the arg takes photo or profilephoto
        }).then(res => res.json()).then((data) => {
        console.log("UPDATE PHOTO");
        console.log(data);
        this.setState({response: data});
        }).catch(console.log);
    }

    //username //profile is current profile user.username 
    if (this.state.profile !== User.userName){
      //url is /oldusername
    await fetch(config.url.API_URL+'/user/updateUsername/'+User.userName, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: this.state.profile,
            password: this.state.password,
            phoneNumber: '',
            name: '',
            email: this.state.email,
            
        })
        }).then(res => res.json()).then((data) => {
          console.log("UPDATE USERNAME");
          console.log(data);
          this.setState({response: data,  });
          console.log(this.state);
          localStorage.setItem('username', this.state.profile)
          localStorage.setItem('is21', true)
          localStorage.setItem('authorized', true);
          //window.location.replace('/'+this.state.userName);
        }).catch(console.log);
    
    }

    //password
    if (this.state.password !== User.password  && this.isValidInput(this.state.password)){
    await fetch(config.url.API_URL+'/user/updatePassword', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userName: this.state.userName,
          password: this.state.password,
          phoneNumber: '',
          name: '',
          email: '',
  
      })
    }).then(res => res.json()).then((data) => {
      console.log("UPDATE PASSWORD");
      console.log(data);
      this.setState({response: data});
    }).catch(console.log);
    //updating password for the remaining fields

    }// end of if password != User.pass and i svalid

    //bio
    if (this.state.bio !== User.bio && this.isValidInput(this.state.bio)) {
      await fetch(config.url.API_URL+'/user/saveBio', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userName: this.state.profile,
          password: '',
          phoneNumber: '',
          name: '',
          email: '',
          bio: this.state.bio,
  
      })
    }).then(res => res.json()).then((data) => {
      console.log("UPDATE BIO");
      console.log(data);
      this.setState({response: data});
    }).catch(console.log);

    this.setState({modalOpen: false});
    }

    //favoritedrink update
    if (this.state.favoriteDrink != User.favoriteDrink && this.isValidInput(this.state.favoriteDrink)) {
      //first search for actual drink with the output
      // await fetch("http://localhost:8080/drink/search?s=" + this.state.favoriteDrink, {
      //   method: 'GET',
      //   headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //   },
      // }).then(res => res.json()).then( async (data) => {
      //   console.log("look for existing drink");
      //   console.log(data);
      //   this.setState({results: [data]})
  
      // }).catch(console.log());

      //search isnt return anything rn so well just upload the state
      //then upload 
      
      await fetch(config.url.API_URL+'/user/saveFavoriteDrink', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userName: this.state.profile,
          password: '',
          phoneNumber: '',
          name: '',
          email: '',
          favoriteDrink: this.state.favoriteDrink,
      })
      }).then(res => res.json()).then((data) => {
        console.log("UPDATE Favorite drink");
        console.log(data);
        this.setState({response: data});
      }).catch(console.log);
     
    } //end of if state favdrink != userfav drink


    this.forceUpdate();
  } //end of handle submit

  async getUser(name) {
    await fetch(config.url.API_URL+'/user/'+name, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      }).then(res => res.json()).then((data) => { //dk tbh
          //console.log(data);
          let user = data;
          this.setState({User: data,
              photo: user.photo,
              email: user.email,
              password: user.password,
              phoneNumber: user.phoneNumber,
              bio: user.bio,
              favoriteDrink: user.favoriteDrink
          });
      }).catch(console.log);
      
  }
  //get all drinks do i need htis
  async getAllDrinks(){
    await fetch(config.url.API_URL+'/drink/', {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      }).then(res => res.json()).then((data) => { //dk tbh
          console.log(data);
          this.setState({allDrinks: data});
      }).catch(console.log);
  }

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

}

export default Profile

//pauls code for the modal :^) not using it but i felt bad deleting it

    // editUsername = 
    // <Grid.Column textAlign="center" verticalAlign="middle" floated="left">
    // <Button animated="fade" onClick={this.handleOpen2}  >
    // <Button.Content visible>Change Username</Button.Content>
    // <Button.Content hidden>
    // <Icon name="edit"/>
    // </Button.Content>
    // </Button>
    // </Grid.Column>


        // {/* PAUL ADDED */}
        //   <Grid>
        //   <Modal
        //   open={this.state.modalOpen2}
        //   onClose={this.handleClose}
        //   size="large">
        //   <Modal.Content image scrolling>
        //   {/*display current profile info with the option to change it */}
        //   <Container>
        //   <Header as='h2' color='grey' textAlign='center'>Change Username</Header>
        //   <br/>
          
        //   <Form size='large'>
        //   <Segment stacked>
          
        //   {/* old username is autofilled */}
        //   <Form.Input 
        //     fluid icon='lock'
        //     iconPosition='left'
        //     placeholder='Old Username'
        //     value={this.state.user}
        //   />

        //   {/* new username needs to be inputted */}
        //   <Form.Input
        //     fluid icon='lock'
        //     iconPosition='left'
        //     placeholder='New Username'
        //     onChange={this.handleUsernameChange}
        //   />

          
        //   <Button onClick={this.handleSubmit2} color='yellow' fluid size='large'>
        //   Update
        //   </Button>
          
          
        //   </Segment>
        //   </Form>
          
        //   </Container>
          
        //   </Modal.Content>
        //   </Modal>
        //   </Grid>
        // //pauls code for the submit
        // async handleSubmit2() { //Paul Added for submitting new username
        //   await fetch('http://localhost:8080/user/updateUsername', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         userName: this.state.username,
        //         password: this.state.password,
        //         phoneNumber: '',
        //         name: this.newUsername,
        //         email: '',
                
        //     })
        //   }).then(res => res.json()).then((data) => {
        //     console.log("UPDATE USERNAME");
        //     console.log(data);
        //     this.setState({response: data});
        //   }).catch(console.log);
      
        // };