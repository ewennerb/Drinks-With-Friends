import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Redirect } from "react-router-dom";
import {config} from '../config/config'
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpenUser = this.handleOpenUser.bind(this);
        this.handleOpenPass = this.handleOpenPass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {

            modalOpen: false,
            username: '',
            password: '',
            loggedIn: true,
            email_reset: '',
            fUser: false, //if forgot username is clicked
            fPass: false, //if forgot password is clicked
            response: '',
            msg: '',
            logBool: ""
        };
    }

    render() {

        let hidden = true;
        if (this.state.msg !== ''){
            hidden = false;
        }

        if (this.state.loggedIn && this.state.user !== undefined){
            //Todo: pass back loggedIn back to the Routes
            //this.props.passState(this.state.user, this.state.loggedIn);
            localStorage.setItem("username", this.state.user)
            localStorage.setItem("authorized", "true")
            
            window.location.href = "/"
        }

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
                                required={true}
                                value={this.state.username}
                                onChange={this.handleUserChange}
                            />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                required={true}
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                            />

                            <Button onClick={this.handleSubmit} color='yellow' fluid size='large'>
                                Login
                            </Button>

                            <Message hidden={hidden} color='red'>
                                {this.state.msg}
                            </Message>
                            <br/>
                            <Message>
                                {/* Link to open Modal */}
                                <Icon name='help'/>
                                Forgot <a onClick={this.handleOpenUser}> Username </a> or <a
                                onClick={this.handleOpenPass}> Password</a>?
                            </Message>

                            <Modal //Begin Modal
                                open={this.state.modalOpen}
                                onClose={this.handleClose}
                                size='small'
                            >
                                <Modal.Content>
                                    {/* This is where the logic for username/password shoulr go -- Paul */}
                                    <Header as='h2' color='grey' textAlign='center'>
                                        Account Reset
                                    </Header>

                                    <Form size='large'>
                                        <Segment stacked>
                                            <Form.Input fluid icon='user' iconPosition='left' placeholder='Email'
                                                        onChange={this.handleEmailChange}/>
                                            {/* Send Email button*/}
                                            <Button onClick={() => this.sendEmail()} color='yellow' fluid size='large'>
                                                Send Email
                                            </Button>
                                        </Segment>
                                    </Form>
                                </Modal.Content>

                                <Modal.Actions>
                                    <Button icon='check' content='Close Window' onClick={this.handleClose.bind(this)}/>
                                </Modal.Actions>
                            </Modal>
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

    //If "Username" is clicked
    handleOpenUser() {
        this.setState({
            modalOpen: true,
            fUser: true
        });
    }

    //If "Password" is clicked
    handleOpenPass() {
        this.setState({
            modalOpen: true,
            fPass: true
        });
    }

    //Close window button / modal
    handleClose() {
        this.setState({
            modalOpen: false,
            fUser: false,
            fPass: false,
            username: '',
            password: '',
            email_reset: ''
        });
    }

    //when the "send email button is clicked"
    async sendEmail() {
        console.log("email_reset: " + this.state.email_reset);

        //GET INFO
        await fetch(config.url.API_URL + '/user/find/' + this.state.email_reset, {
                 method: 'GET',
                 headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                 },
             }).then(res => res.json()).then(async (data) => { //If there is a user with the given email
                 await this.setState({response: data});
                 console.log(data);
             });

        if (this.state.fPass) { //Forgot Password
            await fetch(config.url.API_URL + '/user/resetPasswordEmail', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: this.state.response.username,
                        phoneNumber: '',
                        password: '',
                        name: '',
                        email: this.state.email_reset,
                    })
                }).then(res => res.json()).then((data) => { //If there is a user with the given email
                    console.log(data);
                    this.setState({response: data});
                }).catch(console.log);
        }


        else { //forgot username
            await fetch(config.url.API_URL + '/user/forgotUsername', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: this.state.response.username,
                    phoneNumber: '',
                    password: '',
                    name: '',
                    email: this.state.email_reset,
                })
            }).then(res => res.json()).then((data) => { //If there is a user with the given email
                console.log(data);
                this.setState({response: data});
            }).catch(console.log);
        }
    }

    //when the "login" button is clicked
    async handleSubmit() {
        await fetch(config.url.API_URL + '/user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: this.state.username,
                phoneNumber: '',
                password: this.state.password,
                name: '',
                email: '',
            })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({logBool: data})
            
        }).catch(console.log)

        if (this.state.logBool.status == "ok.") {
            console.log("Password is correct");
            this.setState({loggedIn: true, user: this.state.username});
            localStorage.setItem('username', this.state.username)
            localStorage.setItem('is21', true)
            localStorage.setItem('authorized', true);
        }
        else{
            this.setState({msg: "Username or Password is Incorrect"});
            localStorage.setItem('username', '');
            console.log("WRONG PASS");

        }
    };
    
}

export default Login