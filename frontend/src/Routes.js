import React from "react";

//import './css/Routes.css'
import { BrowserRouter,Route, Switch } from "react-router-dom";


import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Profile from "./pages/Profile"

import {
    Container,
    Grid,
    Menu,
    Header,
    Icon,
    GridColumn,

} from "semantic-ui-react"

export default class Routes extends React.Component {
    
    render(){
        return (
            <div className="Routes">
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
                <Menu.Item
                icon="minus"
                />
            </Menu>


            <BrowserRouter>


            <Switch>
                <Route exact path="/search" component={Search} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register}/>
                <Route exact path="/profile" component={Profile}/>
            </Switch>

            </BrowserRouter>
            </div>

        );
    }
}
