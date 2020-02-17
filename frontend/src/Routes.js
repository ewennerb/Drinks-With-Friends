import React from "react";

import { Route, Switch } from "react-router-dom";

import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Profile from "./pages/Profile"

export default class Routes extends React.Component {

    render(){
        return (
            <Switch>
                <Route exact path="/search" component={Search} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register}/>
                <Route exact path="/profile" component={Profile}/>
            </Switch>
        );
    }
}
