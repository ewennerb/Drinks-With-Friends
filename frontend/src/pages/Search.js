import React from "react";
import 'semantic-ui-css/semantic.min.css';
import {Link} from 'react-router-dom';
import {
    Card,
    Input,
    Rating,
    Image,
    Segment,
    Header,
    Grid,
    Modal,
    Button
} from 'semantic-ui-react'
const axios = require('axios');


export default class Search extends React.Component{

    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            searchText: "",
            response: undefined,
            loaded: false,
            loggedIn: false,
        }
    }


    //Gets the drink of the day as soon as the page loads
    async componentDidMount() {
        await this.getDOTD();
        this.setState({
            loaded: true
        })
    }


    //Fetches the Drink of the Day
    async getDOTD(){
        await fetch('http://localhost:8080/drink/dotd', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //     username: this.state.username,
            //     password: this.state.password,
            //     confirm_password: this.state.conf_pass,
            // })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({response: data})
        }).catch(console.log);
    }


    //Todo: Send the query parameters to the server and fuck shit up
    async getSearchResults(){
        return
    }


    //Records Search Bar Input
    async handleInputChange(event){
        const value = event.target.value;
        await this.setState({searchText: value});
    };


    render(){
        if (!this.state.user) {
            return(
                <div>
                    <Modal size='fullscreen' open={true} centered>
                        <Segment size="massive" placeholder inverted style={{width: "100%", height: "100vh"}} padded attached="top">
                            ARE YE 21 YEHT?
                        </Segment>
                    </Modal>
                </div>

            )
        }else{
            return(
                <div>
                    <Grid style={{ height: '100vh' }} columns={16} centered>
                        <Grid.Column width={4}/>
                        <Grid.Column width={8} textAlign="center">
                            <br/>
                            <br/>
                            <Card style={{width: "500px"}} centered>
                                <Card.Header>Today's Drink of the Day</Card.Header>
                                <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                                    <Image
                                        floated='left'
                                        size='small'
                                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                                    />
                                    <Header textAlign="center" style={{marginTop: "0px"}}>
                                        {this.state.response.name}
                                    </Header>
                                    <Card.Content header="A pretty good drink if I do say so myself"/>

                                    <Card.Meta>New User</Card.Meta>

                                    <Card.Content extra>
                                        <Rating icon='star' defaultRating={5} maxRating={5} />
                                    </Card.Content>
                                </Segment>
                            </Card>
                            <br/>
                            <br/>
                            <Grid.Row centered>
                                {/*Todo: Put a button and maybe some options here*/}

                                <Input
                                    action={{
                                        color: 'yellow',
                                        labelPosition: 'left',
                                        icon: 'search',
                                        content: 'Search',
                                    }}
                                    actionPosition='right'
                                    size="huge"
                                    fluid
                                    placeholder='Search...'
                                    onChange={this.handleInputChange}
                                />
                                <br/>
                                <p hidden={this.state.loggedIn}>
                                    <Link to='/login'>Log In</Link> - or - <Link to='/register'>Register</Link>
                                </p>

                            </Grid.Row>

                        </Grid.Column>
                        <Grid.Column width={4}/>
                    </Grid>
                    {/*Todo: Put a second grid below for rendering search results*/}
                    <Grid></Grid>
                </div>
            )
        }




        // if (this.state.loaded){
        //
        // }else{
        //     return(
        //         <div/>
        //     )
        // }
    }
}