import React from "react";

//import './css/Routes.css'
import { BrowserRouter, Route, Switch } from "react-router-dom";


import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Profile from "./pages/MyProfile"

import {
    Menu,
    Icon,
    Sidebar,
    Segment

} from "semantic-ui-react"

export default class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {menuVisible: false};
    }
    
    render(){
        return (
            <div className="Routes">
                {/* This is the navigation bar */}
                <Menu borderless attached="top" size="huge">
                    <Menu.Item
                        icon="beer"
                        content="Drinks with Friends"
                    />
                    <Menu.Item
                        icon="user circle outline"
                        position="right"
                        size="large"
                    />
                    <Menu.Item
                        content="Username"
                    />
                    <Menu.Item onClick={() => this.setState({ menuVisible: !this.state.menuVisible })} >
                        <Icon name="sidebar" />Menu
                    </Menu.Item>
                </Menu>
                <Sidebar.Pushable as={Segment} attached="bottom" >
                    <Sidebar as={Menu} direction="right" animation="uncover" visible={this.state.menuVisible} icon="labeled" vertical inline inverted>
                        {/*Todo - make these redirect to different links*/}
                        <Menu.Item><Icon name="home" />Search</Menu.Item>
                        <Menu.Item><Icon name="block layout" />My Profile</Menu.Item>
                        <Menu.Item><Icon name="smile" />My Feed</Menu.Item>
                        <Menu.Item><Icon name="calendar" />Bruh</Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Segment basic placeholder>
                            <BrowserRouter>
                                <Switch>
                                    <Route exact path="/search" component={Search} />
                                    <Route exact path="/login" component={Login} />
                                    <Route exact path="/register" component={Register}/>
                                    <Route exact path="/profile" component={Profile}/>
                                </Switch>
                            </BrowserRouter>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>

        );
    }
}
