import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {Link} from 'react-router-dom'
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Profile from "./pages/MyProfile"
import ActivityFeed from "./pages/ActivityFeed"

import {
    Menu,
    Icon,
    Sidebar,
    Segment

} from "semantic-ui-react"


export default class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.handlePageJump = this.handlePageJump.bind(this);
        this.state = {
            menuVisible: false,
            loggedIn: true,
            user: undefined,
            darkMode: false,
        };
    }

    logOut(){
        this.setState({
            user: undefined,
            loggedIn: false,
        })
    }

    handlePageJump(e, { name }){
        this.setState({
            menuVisible: false,
            activeItem: name
        });
    }


    render(){
        let menuItem;
        const { activeItem } = this.state;
        if (this.state.user !== undefined){
            menuItem = <Menu.Item
                as={Link}
                to={{pathname: '/profile', state: {user: this.state.user}}}
                icon="user circle outline"
                position="right"
                size="large"
                content={this.state.user}
            />;
        }else{
            menuItem = <Menu.Item
                as={Link}
                to={{pathname: '/login', }}
                icon="log out"
                position="right"
                size="large"
                content="Log In"
            />;
        }

        return (
            <div className="Routes">
                {/* This is the navigation bar */}
                <BrowserRouter>
                    <Menu attached="top" size="huge">
                        <Menu.Item
                            as={Link}
                            to={{pathname: '/search', state: {user: ""}}}
                            icon="beer"
                            content="Drinks with Friends"
                        />
                        {menuItem}
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
                                        to={{pathname: '/search', state: {user: ""}}}
                                        onClick={this.handlePageJump}
                                        name={"Search For Drinks"}
                                        active={activeItem === 'Search For Drinks'}
                                        borderless
                                    >
                                        {/*<Icon name="search"/>*/}
                                        {/*Search*/}
                                    </Menu.Item>
                                    <Menu.Item
                                        as={Link}
                                        to={{pathname: '/feed', state: {user: ""}}}
                                        name={"Activity ActivityFeed"}
                                        active={activeItem === 'Activity ActivityFeed'}
                                        onClick={this.handlePageJump}
                                        borderless
                                    >
                                        {/*<Icon name="beer"/>*/}
                                        {/*My ActivityFeed*/}
                                    </Menu.Item>
                                    <Menu.Item
                                        as={Link}
                                        replace={false}
                                        to={{pathname: '/profile', state: {user: ""}}}
                                        name={"My Profile"}
                                        active={activeItem === 'My Profile'}
                                        onClick={this.handlePageJump}
                                        borderless
                                        position="right"
                                    >
                                        {/*<Icon name="user"/>*/}
                                        {/*My Profile*/}
                                    </Menu.Item>
                                    <Menu.Item as={Link} to={{pathname: '/', state: {user: ""}}} onClick={this.handlePageJump} name={"Log Out"} >
                                        {/*<Icon name="log out" />Log Out*/}
                                    </Menu.Item>
                                    <Menu.Item content={<br/>}/>
                                    <Menu.Item content="About Us"/>
                                    <Menu.Item content="Dark Mode"/>
                                </Menu.Menu>
                            </Menu.Item>


                        </Sidebar>
                        <Sidebar.Pusher>
                            <Segment basic placeholder>
                                <Switch>
                                    <Route exact path="/" component={Search}/>
                                    <Route exact path="/login" component={Login} />
                                    <Route exact path="/feed" component={ActivityFeed}/>
                                    <Route exact path="/register" component={Register}/>
                                    <Route exact path="/profile" component={Profile}/>
                                </Switch>
                            </Segment>
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </BrowserRouter>
            </div>

        );
    }
}
