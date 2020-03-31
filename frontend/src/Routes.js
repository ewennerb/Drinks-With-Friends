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


import {
    Menu,
    Icon,
    Sidebar,
    Segment,
    Form,
    Button,
    Header, Checkbox
} from "semantic-ui-react"
import Drink from "./pages/Drink";


export default class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.handlePageJump = this.handlePageJump.bind(this);
        this.handleIs21 = this.handleIs21.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.state = {
            menuVisible: false,
            loggedIn: true,
            user: undefined,
            darkMode: false,
            is21: false,
            checked: false,
            profile: undefined,
        };
    }

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
        await fetch('http://localhost:8080/user/' + localStorage.getItem('username'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then((data) => {
            console.log('LOGGED ON')
            this.setState({response: data})
        }).catch(console.log);

        
        this.setState({loggedIn: true, user: localStorage.getItem('username')});
        
    }
    /*Rod added this trying to figure out other user's profiles */
    // async componentDidMount() {
    //     //capital U is the object :^)
    //     if (this.state.loggedIn && this.state.user !== undefined){
    //         await this.getUser(this.state.user);
    //         let User = this.state.User;
    //     }
    // }
    render(){
        let logOrProfile;
        let logOrRegister;
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
        }

        return (
            
            <div className="Routes">
                {/* This is the navigation bar */}
                <BrowserRouter>
                    <div hidden={this.state.is21}>
                        <Segment style={{width: "100%", height: "100vh"}} placeholder inverted>
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
                            <Menu.Item onClick={() => this.setState({ menuVisible: !this.state.menuVisible })} >
                                <Icon name="sidebar"/>Menu
                            </Menu.Item>
                        </Menu>
                        <Sidebar.Pushable as={Segment} attached="bottom">
                            <Sidebar as={Menu} direction="right" animation="uncover" visible={this.state.menuVisible} icon="labeled" vertical width="thin">
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
                                        <Menu.Item content="Dark Mode"/>
                                    </Menu.Menu>
                                </Menu.Item>


                            </Sidebar>
                            <Sidebar.Pusher>
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
                                        <Route path="/:profile" render={({match}) => <Profile user={this.state.user}  match={match}/>}/>
                                        <Route exact path="/profile" render={() => <Profile user={this.state.user}/>}/>
                                        

                                    </Switch>
                                </Segment>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </div>
                </BrowserRouter>
            </div>

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
