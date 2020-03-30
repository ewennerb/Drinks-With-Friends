import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Route, Switch, Link, useParams} from "react-router-dom";
import {
  Menu,
  Grid,
  Icon,
  Button,
  Container,
  Modal,
  Header,
  Segment,
  Form, Message,

} from "semantic-ui-react";
import LikedDrinks from "./userpages/LikedDrinks.js"
import DislikedDrinks from "./userpages/DislikedDrinks.js"
import Map from "./userpages/Map.js"
import Friends from "./userpages/Friends.js"
import Posts from "./userpages/Posts.js"
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
    this.handleNewUsernameChange = this.handleNewUsernameChange.bind(this);

    //im so sorry its too late to change user to username so ill do capital u fro teh object ;)
    this.state = {
      modalOpen: false, 
      modalOpen2: false,
      activeItem: "posts",
    
      newUsername: '',
      User: {},
    };
}

  async componentDidMount(){
    // getting user
    //console.log(this.props)

    let currentUser = this.props.user;
    
    if (currentUser !== undefined){
    await this.getUser(currentUser);
    
    console.log(this.state.User);
    let User = this.state.User;

    this.setState({
      modalOpen: false,
      modalOpen2: false,
      activeItem: "posts",
      userName: User.userName,
      password: User.password,
      bio: User.bio,
      email: User.email,
      name: User.name,
      photo: User.photo,
      favoriteDrink: User.favoriteDrink,
      publishedDrinks: User.publishedDrinks,
      postHistory: User.postHistory,
      friendsList: User.friendsList,
      darkMode: User.darkMode,
    })
    }
  }

handleClose() {
    this.setState(
        {
            modalOpen: false,
            modalOpen2: false
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
handleOpen2() { //Paul Add
  this.setState({modalOpen2: true})
}
  

  handleItemClick = (e, {name}) => {
    this.setState({ activeItem: name })
    console.log(name)
  }

  render(){
    const { activeItem } = this.state.activeItem


    let notUser = <p/>;
    if (this.props.user === "" || this.props.user === undefined){
      notUser =
          <Modal open={true}>
            <Segment stacked>
              <h1>Create an Free Account!</h1>
              <p>
                <Link to='/register'>Sign up </Link> for Drinks With Friends to create your own drinks and save your favorites from others!
                <Message>
                  <Icon name='help'/>
                  Already signed up?&nbsp;<Link to='/login'>Login here</Link>&nbsp;instead.
                </Message>
              </p>

            </Segment>
          </Modal>
    }

    let currentUser = this.state.userName;


    let editProfile = <p/>;
    let favoriteDrink = <p/>;

    if (this.props.user === currentUser) {
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

    }
    //check if fav drink is undefined or empty
    if (this.isValidInput(this.state.favoriteDrink)){
      favoriteDrink = 
      <p>My favorite drink is {this.state.favoriteDrink}</p>
    }



    return(
      <Container>
        <BrowserRouter>
          {notUser}
          <Grid className="grid" columns={3} padded relaxed textAlign="center">
          <Grid.Row>
          <Grid.Column  
            as={Link}
            to={{pathname: `/${this.state.user}/posts`}}
          >
          <Icon name="user circle outline" size="massive"/>
          </Grid.Column>
          
          <Grid.Column textAlign="left">
            <h2>Bio:</h2>
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
              to={{pathname: `/${this.state.user}/posts`}}
              active={activeItem === "posts"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="likedDrinks"
              as={Link}
              to={{pathname: `/${this.state.user}/likedDrinks`}}
              active={activeItem === "likedDrinks"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="dislikedDrinks"
              as={Link}
              to={{pathname: `/${this.state.user}/dislikedDrinks`}}
              active={activeItem === "dislikedDrinks"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="map"
              as={Link}
              to={{pathname: `/${this.state.user}/map`}}
              active={activeItem === "map"}
              onClick={this.handleItemClick}
          
            />
            <Menu.Item
              name="friends"
              as={Link}
              to={{pathname: `/${this.state.user}/friends`}}
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
              <Route exact path="/:user/posts" component={Posts} />
              <Route exact path="/:user/likedDrinks" component={LikedDrinks}/>
              <Route exact path="/:user/dislikedDrinks" component={DislikedDrinks}/>
              <Route exact path="/:user/map" component={Map}/>
              <Route exact path="/:user/friends" component={Friends}/>
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
          

         
          <Header as='h2' color='grey' textAlign='center'>Change Username</Header>
          <Form.Input
            fluid icon='user'
            iconPosition='left'
            value={this.state.userName}
            onChange={this.handleUsernameChange}
          />

          <Form.Input
          fluid icon='lock'
          iconPosition='left'
          placeholder='New Username'
          onChange={this.handleNewUsernameChange}
          />

          <Header as='h2' color='grey' textAlign='center'>Bio</Header>
          <Form.Input
          fluid
          placeholder={this.state.bio}
          value={this.state.bio}
          onChange={this.handleBioChange}
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

  //form input on change functions
  async handleUsernameChange(event) {
    const value = event.target.value;
    await this.setState({userName: value});
  }

  async handlePasswordChange(event) {
    const value = event.target.value;
    await this.setState({password: value});
  };

  async handleNewUsernameChange(event) {
    const value = event.target.value;
    await this.setState({newUsername: value});
    console.log(this.newUsername)
  }

  
  async handleBioChange(event) {
    const value = event.target.value;
    await this.setState({bio: value});
  };
  //end of forminput on change functions

  async handleItemClick (e, {name}) {
      this.setState({ activeItem: name })
      console.log(name)
      
      await fetch('http://localhost:8080/user/'+name+'', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // help
            //userName: this.state.response.username,
            // phoneNumber: '',
            // password: '',
            // name: '',
            // email: this.state.email_reset,
        })
    }).then(res => res.json()).then((data) => { //dk tbh
        console.log(data);
        this.setState({response: data});
    }).catch(console.log);
  }


  async handleSubmit() {

    //submitting everything from the modal
    let User = this.state.User;


    //username
    if (this.state.newUserame !== '')
    await fetch('http://localhost:8080/user/updateUsername', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: this.state.username,
            password: this.state.password,
            phoneNumber: '',
            name: this.newUsername,
            email: User.email,
            
        })
        }).then(res => res.json()).then((data) => {
        console.log("UPDATE USERNAME");
        console.log(data);
        this.setState({response: data});
        }).catch(console.log);


    //password
    if (this.state.password !== User.password  && this.isValidInput(this.state.password)){
    await fetch('http://localhost:8080/user/updatePassword', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userName: this.state.user,
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

    }

    //bio
    if (this.state.bio !== User.bio && this.isValidInput(this.state.bio)) {
      await fetch('http://localhost:8080/user/saveBio', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userName: this.state.user,
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

    }


  }; //end of handle submit








  async getUser(name) {
    
    await fetch('http://localhost:8080/user/'+name, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      }).then(res => res.json()).then((data) => { //dk tbh
          console.log(data);
          
          this.setState({User: data});
      }).catch(console.log);
      
  }

  isValidInput(input) {
    return !(input == undefined || input === '' || input == null);
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