import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Redirect } from "react-router-dom";

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
            loggedIn: true,
            email_reset: '',
            fUser: false, //if forgot username is clicked
            fPass: false, //if forgot password is clicked
            response: '',
            msg: ''
        };
    }

    /*sendEmail = async e => { //WORK IN PROGRESS
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
    };*/

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
            //window.location.reload(false)
            // return (
            //     <Redirect to={{
            //         pathname: '/',
            //         state: { loggedIn: this.state.loggedIn, user: this.state.user}
            //     }} />
            // )
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
        await fetch('http://localhost:8080/user/find/' + this.state.email_reset, {
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
            await fetch('http://localhost:8080/user/resetPasswordEmail', {
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
            await fetch('http://localhost:8080/user/forgotUsername', {
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







             
        //         var nodemailer = require('nodemailer');

        //         // create reusable transporter object using the default SMTP transport
        //         var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

        //         // setup e-mail data with unicode symbols
        //         var mailOptions = {
        //             from: '"Paul Miller" <foreverything78096@gmail.com>', // sender address
        //             to: this.state.email_reset, // list of receivers
        //             subject: 'Hello ✔', // Subject line
        //             text: 'Hello world ?', // plaintext body
        //             html: '<b>Hello world ?</b>' // html body
        //         };

        //         // send mail with defined transport object
        //         transporter.sendMail(mailOptions, function(error, info){
        //             if(error){
        //                 return console.log(error);
        //             }
        //             console.log('Message sent: ' + info.response);
        //         });
        //     }).catch(console.log)


//         const mailgun = require("mailgun-js");
// const DOMAIN = 'gmail.com';
// const mg = mailgun({apiKey: '', domain: DOMAIN});
// const data = {
// 	from: 'Excited User <foreverything78096@gmail.com>',
// 	to: 'nickleuer24@gmail.com',
// 	subject: 'Hello',
// 	text: 'Testing some Mailgun awesomness!'
// };
//         mg.messages().send(data, function (error, body) {
//             console.log(body);
//         });

//         const nodemailer = require('nodemailer');
//         const mailGun = require('nodemailer-mailgun-transport');

//         const auth = {
//             auth: {
//                 api_key: '02780310f49299742f4d931618dba15d-9dda225e-082ca2f5',
//                 domain: 'sandboxe03f61f8aa9d4a6f9ce5697267c306f7.mailgun.org'
//             }
//         };

//         const transporter = nodemailer.createTransport(mailGun(auth));

//         const mailOptions = {
//             from: 'foreverything78096@gmail.com',
//             to: 'nickleuer24@gmail.com',
//             subject: 'hello from paul',
//             text: 'sup dude'
//         };

//         transporter.sendMail(mailOptions, function(err, data) {
//             if (err) {
//                 console.log('Error Ocurrs');
//             }
//             else {
//                 console.log('Message Sent')
//             }
// });
        // this.props.passState(this.state.user, this.state.loggedIn);
        // return (
        //     <Redirect to={{
        //         pathname: '/ResetPassword',
        //         state: { email_reset: this.state.email_reset, response: this.state.response}
        //     }} />
        // )
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
            localStorage.setItem('username', '')
        } else {
            this.setState({loggedIn: true, user: this.state.response.userName});
            console.log("Password is correct");
            localStorage.setItem('username', this.state.username)
            localStorage.setItem('is21', true)
            localStorage.setItem('authorized', true);
        }
    };

}

export default Login