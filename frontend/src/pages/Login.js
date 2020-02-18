import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';


class Login extends React.Component{
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

                    <Button onClick={() => this.loginClicked()} color='grey' fluid size='large' >
                        Login
                    </Button>


                    <Modal //Begin Modal
                        //open={open}
                        onOpen={(e)=> this.openModal}
                        onClose={this.close}
                        size='small'
                        trigger={
                        <Button primary icon >
                            Forgot Username/Password
                        </Button>
                        }
                    >
                        <Modal.Content>
                            {/* This is where the logic for username/password shoulr go -- Paul */}
                            <Header as='h2' color='grey' textAlign='center'>
                                Account Reset
                            </Header>

                            <Form size='large'>
                                <Segment stacked>
                                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />

                                    <Button onClick={() => this.sendEmail()} color='grey' fluid size='large' >
                                        Send Email
                                    </Button>
                                </Segment>
                            </Form>
                        </Modal.Content>

                        <Modal.Actions>
                            <Button icon='check' content='Close Window' onClick={this.onOpen} />
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
    openModal(e){
        e.setState({visible:true})
    }
    closeModal(e){
        e.setState({visible:false})
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