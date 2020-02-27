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
            fPass: false //if forgot password is clicked
        };
    }

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
    sendEmail(){
        console.log("email_reset: " + this.state.email_reset)
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