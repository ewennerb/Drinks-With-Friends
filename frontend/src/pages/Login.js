import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.state = {modalOpen: false};
    }

    handleClose() {
        this.setState(
            {
                modalOpen: false
            }
        )
    }

    handleOpen() {
        this.setState(
            {
                modalOpen: true
            }
        )
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
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                    />

                    <Button onClick={() => this.loginClicked()} color='blue' fluid size='large' >
                        Login
                    </Button>

                        <Message>
                            {/* Link to open Modal */}
                            <Icon name='help'/>
                            Forgot Username or Password?&nbsp;<a onClick={this.handleOpen}>Click here</a>&nbsp;to reset.
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
                                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
                                    {/* Login Button */}
                                    <Button onClick={() => this.sendEmail()} color='blue' fluid size='large' >
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

    loginClicked(){
        console.log('Login Clicked')
    }
    sendEmail(){
        console.log('Email Sent')
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