import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"

export default class Routes extends React.Component {

    render(){
        return (
            <Switch>
                <Route exact path="/" component={Search} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" compnent={Register}/>
            </Switch>
        );
    }
}
