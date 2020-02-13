import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Profile from "./pages/Profile"

export default class Routes extends React.Component {

    render(){
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => Search} />
                    <Route exact path="/login" render={() => Login} />
                    <Route exact path="/register" render={() => Register}/>
                    <Route exact path="/profile" render={() => Profile}/>
                </Switch>
            </BrowserRouter>

        );
    }
}
