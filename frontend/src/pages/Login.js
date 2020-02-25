import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
//import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.state = {
            modalOpen: false,
            email: '',
            password: '',
            logged_in: true,
            email_reset: ''
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
                        placeholder='E-mail address'
                        required='true'
                        value={this.state.email}
                        onChange={this.handleEmailChange}
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
                            Forgot Username or Password?<a onClick={this.handleOpen}> Click here </a>to reset.
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
                                    <Form.Input fluid icon='user' iconPosition='left' value={this.state.email} onChange={this.handleEmailChange}/>
                                    {/* Login Button */}
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


    loginClicked(event){
        console.log('Username and password saved')
        console.log(this.state.email) //Prints email
        console.log(this.state.password) //Prints password
        //TODO: Put logic here to send data to server or whatever
    }
    
    sendEmail(){
        console.log("email_reset: " + this.state.email_reset)
    }

    async handleEmailChange(event){
        const value = event.target.value;
        await this.setState({email: value});
        console.log(value) //print
    };

    async handlePasswordChange(event){
        const value = event.target.value;
        await this.setState({password: value});
        console.log(value) //print
    };

    handleClose() {
        this.setState({modalOpen: false})
    }

    handleOpen() {
        this.setState({modalOpen: true})
    }
    

}


// const ModalExampleMultiple = () => (
//     <Modal trigger={<Button>Multiple Modals</Button>}>
//       <Modal.Header>Modal #1</Modal.Header>
//       {/* <Modal.Content image>
//         <div className='image'>
//           <Icon name='right arrow' />
//       </div> */}
//         <Modal.Description>
//           <p>We have more to share with you. Follow us along to modal 2</p>
//         </Modal.Description>
//       {/* </Modal.Content>
//       <Modal.Actions>
//         <NestedModal />
//       </Modal.Actions> */}
//     </Modal>
//   )

export default Login