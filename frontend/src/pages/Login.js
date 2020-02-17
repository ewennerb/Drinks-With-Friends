import React from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
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

                    <Button onClick={() => this.forgotPasswordClicked()} attached='bottom' color='grey' fluid size='small'>
                        Forgot Password?
                    </Button>

                    </Segment>
                 </Form>
      
                </Grid.Column>
            </Grid>
        ) //End Return
    } //End Render

    loginClicked(){
        console.log('Login Clicked')
    }

    forgotPasswordClicked(e){
        console.log('Forgot Password Clicked')
        
    }



}

export default Login