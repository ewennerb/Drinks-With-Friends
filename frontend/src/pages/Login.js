import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import Redirect from "react-router-dom/es/Redirect";

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
        console.log(this.props.history);
        this.state = {

            modalOpen: false,
            username: '',
            password: '',
            logged_in: true,
            email_reset: '',
            fUser: false, //if forgot username is clicked
            fPass: false, //if forgot password is clicked
            response: '',
            msg: ''
        };
    }

    sendEmail = async e => { //WORK IN PROGRESS
        e.preventDefault();
        if (this.state.email_reset == '') { //if nothing is enetered in the email box
            this.setState({
                showEmailError: false,
                messageFromServer: '',
            });
        } else { //If there is something in the email box
            await fetch('http://localhost:8080/user/find/' + this.state.email_reset, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json()).then((data) => { //If there is a user with the given email
                console.log(data);
                this.setState({response: data})
            }).catch(console.log)

            // .catch(error => { //If there is no user with the given email
            //     console.log;
            // });
        }
    };

    render() {

        let hidden = true;
        if (this.state.msg !== ''){
            hidden = false;
        }

        if (this.state.logged_in && this.state.user !== undefined){

            //Todo: pass back logged_in back to the Routes
            this.props.passState(this.state.user, this.state.logged_in);
            return (
                <Redirect to={{
                    pathname: '/',
                    state: { logged_in: this.state.logged_in, user: this.state.user}
                }} />
            )
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
                                required='true'
                                value={this.state.username}
                                onChange={this.handleUserChange}
                            />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                required='true'
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
    sendEmail() {
        console.log("email_reset: " + this.state.email_reset)
    }

    //when the "login" button is clicked
    async handleSubmit() {
        await fetch('http://localhost:8080/user/' + this.state.username, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then((data) => {
            this.setState({response: data})
        }).catch(console.log);

        if (this.state.response.password !== this.state.password) {
            this.setState({msg: "Username or Password is Incorrect" });
            console.log("You're a shitty hacker")
        } else {
            this.setState({logged_in: true, user: this.state.response.userName});
            console.log("Password is correct");
        }
    };

}

export default Login