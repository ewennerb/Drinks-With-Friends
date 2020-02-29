import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Redirect from "react-router-dom/es/Redirect";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleConfChange = this.handleConfChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        console.log(this.props.history);
        this.state = {
            modalOpen: false,
            username: '',
            password: '',
            confPass: '',
            logged_in: true,
            email_reset: '',
            fUser: false, //if forgot username is clicked
            fPass: false, //if forgot password is clicked
            response: '',
            msg: ''
        };
    }


    //Handles changes that happen to the 'username' field
    async handleUsernameChange(event) {
        const value = event.target.value;
        await this.setState({username: value});
    };


    //Handles changes that happen to the 'password' field
    async handlePassChange(event) {
        const value = event.target.value;
        await this.setState({password: value});
    };

    async handleConfChange(event) {
        const value = event.target.value;
        if (this.state.password !== value) {
            await this.setState({
                confPass: value,
                msg: "Passwords do not match",
                enabled: false
            })
        } else {
            await this.setState({
                confPass: value,
                msg: "",
                enabled: true
            })
        }
    };


    render() {
        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>

                    <Header as='h2' color='grey' textAlign='center'>
                        Log-in to your account
                    </Header>

                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                required='true'
                                value={this.state.username}
                                onChange={this.handleUsernameChange}
                            />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                required='true'
                                value={this.state.password}
                                onChange={this.handlePassChange}
                            />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                type='password'
                                required='true'
                                value={this.state.confPass}
                                onChange={this.handleConfChange}
                            />

                            <Button onClick={this.handleSubmit} color='yellow' fluid size='large'>
                                Login
                            </Button>

                            <Message hidden={true} color='red'>
                                {this.state.msg}
                            </Message>
                            <br/>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        ) //End Return
    } //End Render


    //When the user types in stuff in the username box, the username variable is updated
    async handleUserChange(event) {
        const value = event.target.value;
        await this.setState({username: value});
    };

    //When the user types in stuff in the username box, the username variable is updated
    async handleEmailChange(event) {
        const value = event.target.value;
        await this.setState({email_reset: value});
    };

    //When the user types in stuff in the password box, the password variable is updated
    async handlePasswordChange(event) {
        const value = event.target.value;
        await this.setState({password: value});
    };


    //when the "login" button is clicked
    async handleSubmit() {
        await fetch('http://localhost:8080/user/updatePassword', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: this.state.username,
                password: this.state.password,
                email: " ",
                phoneNumber: " ",
                name: " "
            })
        }).then(res => res.json()).then((data) => {
            this.setState({response: data})
        }).catch(console.log);

        if (this.state.response.password !== this.state.password) {
            this.setState({msg: "Username or Password is Incorrect"});
            console.log("You're a shitty hacker")
        } else {
            this.setState({logged_in: true, user: this.state.response.userName});
            console.log("Password is correct");
        }
    };

}

export default ResetPassword