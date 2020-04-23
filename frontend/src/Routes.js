import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {Link} from 'react-router-dom'
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Profile from "./pages/MyProfile"
import ActivityFeed from "./pages/ActivityFeed"
import All from "./pages/All"
import ResetPassword from "./pages/ResetPassword";
import {config} from './config/config'
import {ThemeProvider} from 'styled-components';
import {GlobalStyles} from './config/global';
import {lightTheme, darkTheme} from './config/theme';
import './css/toggle.css'

import {
    Menu,
    Icon,
    Sidebar,
    Segment,
    Form,
    Button,
    Header, Checkbox,
    Popup
} from "semantic-ui-react"
import Drink from "./pages/Drink";
import PopupContent from "semantic-ui-react/dist/commonjs/modules/Popup/PopupContent";
import List from "semantic-ui-react/dist/commonjs/elements/List";
import Sticky from "semantic-ui-react/dist/commonjs/modules/Sticky";


export default class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.handlePageJump = this.handlePageJump.bind(this);
        this.handleIs21 = this.handleIs21.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.changeTheme = this.changeTheme.bind(this);
        this.state = {
            menuVisible: false,
            loggedIn: true,
            user: undefined,
            darkMode: false,
            is21: false,
            checked: false,
            profile: undefined,
            notifications: [],
        };

    }

    async changeTheme(){
        let mode = !this.state.darkMode;
        await this.setState({darkMode: mode});
        if (this.state.user === undefined) {
            return;
        }
        await fetch(config.url.API_URL + '/user/darkMode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userName': this.state.user,
                'darkMode': this.state.darkMode
            })
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    };

    logOut(){
        this.setState({
            user: undefined,
            loggedIn: false,
        })
        window.location.reload(false);
        localStorage.setItem('authorized', false);
        localStorage.setItem('username', undefined);
        localStorage.setItem('password', '');
        localStorage.setItem('is21', false);
    }

    handlePageJump(e, { name }){
        this.setState({
            menuVisible: false,
            activeItem: name
        });
    }

    handleIs21(){
        this.setState({is21: true})
    }

    handleCheck(){
        this.setState({checked: !this.state.checked})
    }


    passState(user, loggedIn){
        console.log("Doing Generate");
        this.setState({
            user: user,
            loggedIn: loggedIn
        });
    }


    async componentWillMount(){
        this.state.is21 = localStorage.getItem('is21') === 'true';
        if (localStorage.getItem('username') === '' || localStorage.getItem('authorized') === 'false'){
            return;
        }
        await fetch(config.url.API_URL + '/user/' + localStorage.getItem('username'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then((data) => {
            console.log('LOGGED ON');
            console.log(data);
            this.setState({response: data, darkMode: data.darkMode === 1});
            // this.setState({darkMode: data.darkMode === 1})
        }).catch(console.log);
        this.setState({loggedIn: true, user: localStorage.getItem('username')});
    }



    //rod changed it to component did mount bc it kept sayingwill mount is whats the word defected
    async componentDidMount(){
        //console.log("componentdid mount")
        this.state.is21 = localStorage.getItem('is21') === 'true';
        if (localStorage.getItem('username') === '' || localStorage.getItem('authorized') === 'false'){
            console.log("return ")
            return;
        }
        await fetch(config.url.API_URL + '/user/' + localStorage.getItem('username'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(async (data) => {
            console.log('LOGGED ON');


            //Gets notifications if there are any that need to be received
            if(data.userName !== undefined) {
                let notifications = await this.getNotifications(data.userName);
                console.log(notifications);
                this.setState({response: data,
                    userObject: data,
                    loggedIn: true,
                    user: localStorage.getItem("username"),
                    notifications: notifications.results
                });
            }
            //Todo: Get notifications here

        }).catch(console.log);

    }
    /*Rod added this trying to figure out other user's profiles */
    // async componentDidMount() {
    //     //capital U is the object :^)
    //     if (this.state.loggedIn && this.state.user !== undefined){
    //         await this.getUser(this.state.user);
    //         let User = this.state.User;
    //     }
    // }



    async getNotifications(user){
        let n = [];
        await fetch(config.url.API_URL + '/user/getNotifications/' + this.state.user, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(async (data) => {
            console.log("====== Notifications ========");
            console.log(data);
            console.log("=============================");
            n = data;
        });
        return n;
    }


    async clearNotification(notification, link, index){
        //Todo: Figure out how to actually do this right
        await fetch(config.url.API_URL + "/post/notificationClicked/" + notification.postId + "/" + this.state.user, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(async (data) => {
            let arr = this.state.notifications;
            arr.splice(index, 1);
            this.setState({notifications: arr})
        }).catch(() => console.log("Failed to delete notification"));
    }



    render(){
        let logOrProfile;
        let logOrRegister;
        let notifBell;
        const { activeItem } = this.state;
        if (this.state.user !== undefined){
             logOrProfile = <Menu.Item
                as={Link}
                to={{pathname: `/${this.state.user}`, state: {user: this.state.user, profile: this.state.user}}}
                icon="user circle outline"
                position="right"
                size="large"
                content={this.state.user}
            />;

             //Todo: Need to figure out how to get notifications and display them here

            console.log(this.state.notifications);
            if(this.state.notifications === undefined || this.state.notifications.length === 0){
                notifBell = <Menu.Item>
                    <Popup
                        trigger={
                            <Icon.Group>
                                <Icon name='bell outline'/>
                                {/*<Icon name="circle" color="yellow" corner/>*/}
                            </Icon.Group>}
                        // content="You have no notifications. Go fuck urself"
                        position="bottom center"
                    >
                        <PopupContent>
                            <Segment basic style={{height: "20%", overflow: "scrollY"}} >
                                You have no new notifications
                            </Segment>
                        </PopupContent>
                    </Popup>
                </Menu.Item>;
            }else{
                notifBell = <Menu.Item>
                <Popup
                    trigger={
                        <Icon.Group>
                            <Icon name='bell outline'/>
                            <Icon name="circle" color="yellow" corner/>
                        </Icon.Group>
                    }
                    hoverable={true}
                    position="bottom center"
                >
                    <PopupContent>
                        {/*<Segment basic style={{overflow: "scrollY"}}>*/}
                            <List celled>
                                {this.state.notifications.map((notif, index) => {
                                    let link, message, icon;
                                    if(notif.drinkFlag === 1){
                                        link = "/" + notif.publisher + "/drink/" + notif.postId;
                                        message = " published a new drink recipe";
                                        icon = "beer"
                                    }else{
                                        link = "/" + notif.publisher + "/post/" + notif.postId;
                                        icon = "envelope outline";
                                        message = " published a new post";
                                    }
                                    return(
                                        <div>
                                            <List.Item>
                                                <Header as="h4" color="grey" floated="left">
                                                    <Icon name={icon} color="grey"/>
                                                    <Header.Content>
                                                        <Link to={"/" + notif.publisher}>{notif.publisher}</Link>
                                                        <Header.Subheader>
                                                            {message}
                                                        </Header.Subheader>
                                                    </Header.Content>
                                                </Header>
                                                <div style={{textAlign: "center"}}>
                                                    <div style={{display: "inline-block"}}>
                                                        <p>
                                                            <Link to={link} onClick={() => this.clearNotification(notif, link, index)}>view</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onClick={() => this.clearNotification(notif, link, index)}>dismiss</a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </List.Item>
                                        </div>
                                    )
                                })}
                            </List>
                    </PopupContent>
                </Popup>
                </Menu.Item>;
            }



             logOrRegister = <Menu.Item
                 as={Link}
                 to={{pathname: '/'}}
                 onClick={this.logOut}
                 name={"Log Out"}
                 active={activeItem === 'Log Out'}

             />
        }else{
            logOrProfile = <Menu.Item
                as={Link}
                to={{pathname: '/login', }}
                icon="log out"
                position="right"
                size="large"
                content="Log In"
            />;
            logOrRegister = <Menu.Item
                as={Link}
                to={{pathname: '/register'}}
                onClick={this.handlePageJump}
                name={"Register"}
                active={activeItem === 'Register'}
                
            />
            notifBell = <div/>
        }
        let toggleSwitch =
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    className="toggle-switch-checkbox"
                    name="toggleSwitch"
                    id="toggleSwitch"
                    onClick={this.changeTheme}
                    checked={this.state.darkMode}
                    />
                    <label className="toggle-switch-label" htmlFor="toggleSwitch">
                    <span className="toggle-switch-inner" />
                    <span className="toggle-switch-switch" />
                </label>
            </div>

        return (
            
            <ThemeProvider theme={this.state.darkMode ? darkTheme : lightTheme}>
            <GlobalStyles/>
            <div className="Routes">
                {/* This is the navigation bar */}
                <BrowserRouter>
                    <div hidden={this.state.is21} className="confirmation">
                        <Segment style={{width: "100%", height: "100vh"}} placeholder inverted id="confirmPage">
                            <Header size="huge">Confirm Your Age</Header>
                            <Header size="large">We require our users to be 21 years old or over</Header>
                            <br/>
                            <Form inverted>
                                <Checkbox
                                    fitted
                                    label={"I confirm that I am 21 years old or over"}
                                    // value={this.state.checked}
                                    onClick={this.handleCheck}
                                />
                                <br/>
                                <br/>
                                <Button size="medium" inverted style={{width: "300px"}} disabled={!this.state.checked} onClick={this.handleIs21} content={"Submit"}/>
                            </Form>
                            <br/>
                            <a href={"http://www.google.com"} onClick={window.close()}>I am baby get me out of here</a>
                        </Segment>
                    </div>
                    <div hidden={!this.state.is21}>
                        <Menu attached="top" size="huge">
                            <Menu.Item
                                as={Link}
                                to={{pathname: '/', state: {user: this.state.user}}}
                                icon="beer"
                                content="Drinks with Friends"
                            />
                            {logOrProfile}
                            {notifBell}
                            <Menu.Item onClick={() => this.setState({ menuVisible: !this.state.menuVisible })} >
                                <Icon name="sidebar"/>Menu
                            </Menu.Item>
                        </Menu>
                        <Sidebar.Pushable as={Segment} attached="bottom">
                            <Sidebar as={Menu} direction="right" animation="overlay" visible={this.state.menuVisible} icon="labeled" vertical width="thin">
                                {/*Todo - make these redirect to different links*/}
                                {/*TODO - PASS USER TO ALL CLASSES' PROPS*/}

                                <Menu.Item>
                                    <Menu.Header>
                                        <br/>
                                        Navigation
                                    </Menu.Header>
                                    <Menu.Menu>
                                        <Menu.Item
                                            as={Link}
                                            to={{pathname: '/', state: {user: this.state.user, is21: this.state.is21}}}
                                            onClick={this.handlePageJump}
                                            name={"Search For Drinks"}
                                            active={activeItem === 'Search For Drinks'}

                                        />

                                        <Menu.Item
                                            as={Link}
                                            to={{pathname: '/feed', state: {user: this.state.user, is21: this.state.is21}}}
                                            name={"Activity Feed"}
                                            active={activeItem === 'Activity Feed'}
                                            onClick={this.handlePageJump}

                                        />

                                        <Menu.Item
                                            as={Link}
                                            replace={false}
                                            to={{pathname: `/${this.state.user}`, state: {user: this.state.user, is21: this.state.is21}}}
                                            name={"My Profile"}
                                            active={activeItem === 'My Profile'}
                                            onClick={this.handlePageJump}
                                            position="right"
                                        />
                                        <Menu.Item
                                            as={Link}
                                            to={{pathname: '/all', state: {user: this.state.user, is21: this.state.is21}}}
                                            name={"All"}
                                            active={activeItem === 'My Profile'}
                                            onClick={this.handlePageJump}
                                            // compiler didnt like borderless
                                            position="right"
                                        />
                                        {logOrRegister}

                                        <Menu.Item content={<br/>}/>
                                        <Menu.Item content="About Us"/>
                                        <Menu.Item content="Dark Mode">
                                            Dark mode
                                            {toggleSwitch}
                                        </Menu.Item>
                                    </Menu.Menu>
                                </Menu.Item>


                            </Sidebar>
                            <Sidebar.Pusher dimmed={this.state.menuVisible} onClick={() => this.setState({ menuVisible: false })}>
                                <Segment basic placeholder>
                                    <Switch>
                                        <Route exact path="/" render={() => <Search user={this.state.user}/>}/>
                                        <Route exact path="/login" render={() => <Login passState={this.passState.bind(this)}/>}/>
                                        {/* it doenst like this^ stackoverflow says componentdidmount for "sideeffects" */}
                                        <Route exact path="/feed" render={() => <ActivityFeed user={this.state.user}/>}/>
                                        <Route exact path="/register" component={Register}/>
                                        <Route exact path="/all" render={() => <All user={this.state.user}/>}/>
                                        {/* im so sorry for fucking up the username and user i shouldve fixed it way earlier */}
                                        <Route path="/:username/drink/:name" component={Drink}/>
                                        <Route exact path="/resetPassword" component={ResetPassword}/>
                                        <Route path="/:profile" render={({match}) => <Profile user={this.state.user}  match={match}
                                                                                    UserObject={this.state.UserObject}/>}/>
                                        <Route exact path="/profile" render={() => <Profile user={this.state.user}/>}/>


                                    </Switch>
                                </Segment>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </div>
                </BrowserRouter>
            </div>
            </ThemeProvider>

        );
    } //end render


    // rod added this to get user from username if logged in to have userobject available in routesstate
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
}
