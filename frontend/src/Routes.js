import React from "react";

//import './css/Routes.css'
import { BrowserRouter,Route, Switch } from "react-router-dom";


import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Profile from "./pages/Profile"

import {
    Container,
    Menu,
    Header,
    Icon,

} from "semantic-ui-react"

export default class Routes extends React.Component {

    render(){
        return (

            <div className="Routes">

            <Menu attached="top">
                 <Icon name="home" position="left" />
                
                <Menu.Menu>

                </Menu.Menu>
            </Menu>   

            <Header as='h2' icon='plug' content='Uptime Guarantee' />
            <Container>
                <h1>peepee</h1>
            </Container>

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
