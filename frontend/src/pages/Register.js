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
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            email: '',
            username: '',
            name: '',
            phoneNum: '',
            password: '',
            conf_pass: '',
            msg: '',
            response: null,
            enabled: true,
            registered: false,
            status: "",
            hidden: true
        };
    }


    //Queries the account creation API endpoint when the button is pressed.
    async handleSubmit() {
        //Todo - This 'Fetch' method will query the API on submission of the form
        await fetch(config.url.API_URL + '/user/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: this.state.username,
                phoneNumber: this.state.phoneNum,
                password: this.state.password,
                name: this.state.name,
                email: this.state.email,
                photo: "",
                bio: "",
                likedDrinks: "",
                dislikedDrinks: "",
                favoritedDrink: "",
                publishedDrinks: "",
                postHistory: "",
                friendsList: "",
                dateCreated: "",
                lastLogin: "",
                response: undefined,
            })
        }).then(res => res.json()).then((data) => {
            this.setState({response: data})
        }).catch(console.log);

        let m = this.state.response.status;
        if (m === "ok") {
            this.setState({
                registered: true
            })
        }else{
            this.setState({
                msg: m,
                registered: false
            });
        }

    };



    //Handles changes that happen to the 'username' field
    async handleUserChange(event) {
        const value = event.target.value;
        await this.setState({username: value});
    };


    async handleNameChange(event){
        this.setState({
            name: event.target.value
        })
    }

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
        // console.log("in ya runder");
        // console.log(this.state.status);

        if (!this.state.registered){
            return (
                <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                    <Grid.Column width={5}/>
                    {/*<Grid.Column style={{maxWidth: 450}}>*/}
                    <Grid.Column width={6}>
                        <Segment textAlign="center">
                            <Header as='h2' color='grey' textAlign='center'>
                                Register for an Account
                            </Header>

                            <Form width={6}>
                                <br/>
                                <Form.Input
                                    width={16}
                                    fluid
                                    label="Username"
                                    labelPosition="left"
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='Username'
                                    required={true}
                                    value={this.state.username}
                                    onChange={this.handleUserChange}
                                    size="large"
                                />
                                <Form.Input
                                    fluid
                                    width={16}
                                    label="Name"
                                    icon='check'
                                    iconPosition='left'
                                    placeholder='John Doe'
                                    required={true}
                                    value={this.state.name}
                                    onChange={this.handleNameChange}
                                    size="large"
                                />
                                <Form.Input
                                    fluid
                                    width={16}
                                    label="Email"
                                    icon='address book'
                                    iconPosition='left'
                                    placeholder='Email@address.com'
                                    required={true}
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
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
                                    fluid
                                    width={16}
                                    label="Phone Number"
                                    icon='phone'
                                    iconPosition='left'
                                    placeholder='XXX-XXX-XXXX'
                                    type='phone'
                                    required={true}
                                    value={this.state.phoneNum}
                                    onChange={this.handlePhoneChange}
                                    size="large"
                                />
                                <Form.Input
                                    fluid
                                    width={16}
                                    label="Password"
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    required={true}
                                    value={this.state.password}
                                    onChange={this.handlePassChange}
                                    size="large"
                                />
                                <Label as={Message} hidden={hidden} pointing='right' size="tiny" active={hidden}>{this.state.msg}</Label>
                                <Form.Input
                                    fluid
                                    width={16}
                                    label="Confirm Password"
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Confirm Password'
                                    type='password'
                                    required={true}
                                    value={this.state.conf_pass}
                                    onChange={this.handleConfChange}
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
                            </Form>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={5}/>
                </Grid>
            )
        }else {
            return (
                <Grid textAlign='center' style={{height: "100vh"}} verticalAlign='middle'>
                    <Grid.Column width={5}/>
                    <Grid.Column width={6}>
                        <Segment placeholder>
                            <Header color="gray">Successfully Registered</Header>
                            <Button color='yellow' fluid size='large' as={Link} to={"/login"}>
                                Return to Login
                            </Button>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={5}/>
                </Grid>
            );
        }
    }
}
