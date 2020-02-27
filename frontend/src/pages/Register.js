import React from "react";
import {Button, Form, Grid, Message, Segment, Icon, Header, Label} from "semantic-ui-react";
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
// import {PhoneInput} from 'react-phone-input-2';
import 'react-phone-input-2/lib/semantic-ui.css'



export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleConfChange = this.handleConfChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            email: '',
            username: '',
            phoneNum: '',
            password: '',
            conf_pass: '',
            msg: '',
            registered: false,
            response: null,
            enabled: true
        };
    }


    //Queries the account creation API endpoint when the button is pressed.
    async handleSubmit() {
        //Todo - This 'Fetch' method will query the API on submission of the form
        await fetch('http://127.0.0.1:8080/users/insert', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                confirm_password: this.state.conf_pass,

            })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({response: data})
        }).catch(console.log);


        // This logic will keep track of a 'logged-in' state
        // let m = this.state.response['detail'];
        // if (m === undefined && this.state.response['username']) {
        //     this.setState({
        //         registered: true
        //     })
        // }else{
        //     this.setState({
        //         msg: m,
        //         registered: false
        //     });
        // }
    };



    //Handles changes that happen to the 'username' field
    async handleUserChange(event) {
        const value = event.target.value;
        await this.setState({username: value});
    };

    async handleEmailChange(event){
        const value = event.target.value;
        await this.setState({email: value});
    };

    async handlePhoneChange(event){
        const value = event.target.value;
        await this.setState({phoneNum: value});
    }

    //Handles changes that happen to the 'password' field
    async handlePassChange(event){
        const value = event.target.value;
        await this.setState({password: value});
    };


    //Handles changes that happen to the 'confirm password' field
    async handleConfChange(event){
        const value = event.target.value;
        if (this.state.password !== value){
            await this.setState({
                conf_pass: value,
                msg: "Passwords do not match",
                enabled: false
            })
        }else{
            await this.setState({
                conf_pass: value,
                msg: "",
                enabled: true
            })
        }
    };


    // Main render method that is called on load or when this component's state changes
    render() {

        let hidden = true;
        if (this.state.msg !== "") {
            hidden = false;
        }

        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='big' widths={'equal'}>
                        <Segment textAlign="center">
                            <Header as='h2' color='grey' textAlign='center'>
                               Register for an Account
                            </Header>

                            <br/>
                            <Form.Input
                                fluid icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                required={true}
                                value={this.state.username}
                                onChange={this.handleUserChange}
                                width='200px'
                                size="large"
                            />
                            <Form.Input
                                fluid icon='address book'
                                iconPosition='left'
                                placeholder='Email'
                                required={true}
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                                width='200px'
                                size="large"
                            />
                            {/*Todo: Getting this to work would be cool*/}
                            {/*<PhoneInput*/}
                            {/*    country={'us'}*/}
                            {/*    value={this.state.phoneNum}*/}
                            {/*    placeholder="XXX-XXX-XXXX"*/}
                            {/*    onChange={this.handlePhoneChange}*/}
                            {/*/>*/}
                            <Form.Input
                                fluid icon='phone'
                                iconPosition='left'
                                placeholder='Password'
                                type='phone'
                                required={true}
                                value={this.state.phoneNum}
                                onChange={this.handlePhoneChange}
                                width="200px"
                                size="large"
                            />
                            <Form.Input
                                fluid icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                required={true}
                                value={this.state.password}
                                onChange={this.handlePassChange}
                                width="200px"
                                size="large"
                            />
                            <Label as={Message} hidden={hidden} pointing='right' size="tiny" active={hidden}>{this.state.msg}</Label>
                            <Form.Input
                                fluid icon='lock'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                type='password'
                                required={true}
                                value={this.state.conf_pass}
                                onChange={this.handleConfChange}
                                width="200px"
                                size="large"
                            />

                            <Button color='yellow' fluid size='large' active={this.state.enabled} onClick={this.handleSubmit}>
                                Register
                            </Button>
                            <Message hidden={hidden} color='red'>
                                {this.state.msg}
                            </Message>
                            <br/>
                            <Message>
                                <Icon name='help'/>
                                Already signed up?&nbsp;<Link to='/login'>Login here</Link>&nbsp;instead.
                            </Message>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}
