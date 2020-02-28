import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpenUser = this.handleOpenUser.bind(this);
        this.handleOpenPass = this.handleOpenPass.bind(this);
        this.state = {
            modalOpen: false,
            username: '',
            password: '',
            logged_in: true,
            email_reset: '',
            fUser: false, //if forgot username is clicked
            fPass: false, //if forgot password is clicked
            response: ''
        };
    }

    /*sendEmail = async e => { //WORK IN PROGRESS
        e.preventDefault();
        if (this.state.email_reset == '') { //if nothing is enetered in the email box
            this.setState({
                showEmailError: false,
                messageFromServer: '',
            });
        }
        else { //If there is something in the email box
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

    render(){
        return(
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>

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

                    <Button onClick={() => this.loginClicked()} color='yellow' fluid size='large' >
                        Login
                    </Button>

                        <Message>
                            {/* Link to open Modal */}
                            <Icon name='help'/>
                            Forgot <a onClick={this.handleOpenUser}> Username </a> or <a onClick={this.handleOpenPass}> Password</a>?
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
                                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Email' onChange={this.handleEmailChange}/>
                                    {/* Send Email button*/}
                                    <Button onClick={() => this.sendEmail()} color='yellow' fluid size='large' >
                                        Send Email
                                    </Button>
                                </Segment>
                            </Form>
                        </Modal.Content>

                        <Modal.Actions>
                            <Button icon='check' content='Close Window' onClick={this.handleClose.bind(this)} />
                        </Modal.Actions>
                    </Modal>
                    </Segment>
                 </Form>
                </Grid.Column>
            </Grid>
        ) //End Return
    } //End Render


    
    //When the user types in stuff in the username box, the username variable is updated
    async handleUserChange(event){
        const value = event.target.value;
        await this.setState({username: value});
    };

    //When the user types in stuff in the username box, the username variable is updated
    async handleEmailChange(event){
        const value = event.target.value;
        await this.setState({email_reset: value});
    };

    //When the user types in stuff in the password box, the password variable is updated
    async handlePasswordChange(event){
        const value = event.target.value;
        await this.setState({password: value});
    };

    //If "Username" is clicked
    handleOpenUser() {
        this.setState({modalOpen: true})
        this.setState({fUser: true})
    }

    //If "Password" is clicked
    handleOpenPass() {
        this.setState({modalOpen: true})
        this.setState({fPass: true})
    }

    //Close window button / modal
    handleClose() {
        this.setState({modalOpen: false})
        //when the window is closed, all variables should be reset
        this.setState({fUser: false})
        this.setState({fPass: false})
        this.setState({username: ''})
        this.setState({password: ''})
        this.setState({email_reset: ''})
    }
    
    //when the "send email button is clicked"
    async sendEmail(){
        console.log("email_reset: " + this.state.email_reset)
        // await fetch('http://localhost:8080/user/find/' + this.state.email_reset, {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //     }).then(res => res.json()).then((data) => { //If there is a user with the given email
        //         console.log(data);
        //         this.setState({response: data})
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


    }

    //when the "login" button is clicked
    loginClicked(event){
        console.log('Username and password saved')
        console.log(this.state.username) //Prints username
        console.log(this.state.password) //Prints password
        console.log('User: ' + this.state.fUser) //Prints fUser
        console.log('Pass: ' + this.state.fPass) //Prints fPass
        //TODO: Put logic here to send data to server or whatever
    }

}

export default Login