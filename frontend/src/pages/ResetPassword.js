import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            password: '',
            email_reset: '',
            fUser: false, //if forgot username is clicked
            fPass: false, //if forgot password is clicked
            response: ''
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

}

export default Login