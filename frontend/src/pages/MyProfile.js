import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
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
    this.state = {
      modalOpen: false, 
      activeItem: "posts",
      user: this.props.user
    };
}

  componentDidMount(){
    this.setState({
      modalOpen: false,
      activeItem: "posts",
      user: this.props.user
    })
  }

handleClose() {
    this.setState(
        {
            modalOpen: false
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



    return(
      <Container>
        <BrowserRouter>
          {notUser}
          <Grid className="grid" columns={3} padded relaxed textAlign="center">
          <Grid.Row container>
          <Grid.Column  
            as={Link}
            to={{pathname: `/${this.state.user}/posts`}}
          >
          <Icon name="user circle outline" size="massive"/>
          </Grid.Column>
          
          <Grid.Column container textAlign="left">
            <h2>Bio:</h2>
            
          </Grid.Column> 
          
          <Grid.Column textAlign="center" verticalAlign="middle" floated="left">
            <Button animated="fade" onClick={this.handleOpen}  >
            <Button.Content visible>Edit Profile</Button.Content>
            <Button.Content hidden>
            <Icon name="edit"/>
            </Button.Content>
            </Button>
          </Grid.Column>
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
          <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size="large">
          <Modal.Content image scrolling>
          {/*display current profile info with the option to change it */}
          <Container>
          <Header as='h2' color='grey' textAlign='center'>Edit Profile</Header>
          </Container>
          <Container>
          <Modal.Description>
          <Form size='large'>
          <Segment stacked>
          <Form.Input
          fluid icon='user'
          iconPosition='left'
          placeholder='Username'
          required='true'
          value={this.state.username}
          onChange={this.handleUserChange}
          />
          
          </Segment>
          </Form>
          {/* need to add profile picture and how to store kind of confused */}
          </Modal.Description>
          </Container>

          </Modal.Content>
          </Modal>
          
        </BrowserRouter>
      </Container>  
    )
  }//end render
  
   

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
}

export default Profile