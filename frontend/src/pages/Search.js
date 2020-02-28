import React from "react";
import 'semantic-ui-css/semantic.min.css';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {
    Card,
    Input,
    Rating,
    Image,
    Segment,
    Header,
    Grid,
    Loader, Button,
} from 'semantic-ui-react'
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";


export default class Search extends React.Component{

    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.getDOTD = this.getDOTD.bind(this);
        this.state = {
            user: this.props.user,
            searchText: "",
            dotd: undefined,
            response: undefined,
            loaded: false,
            loggedIn: false,
            done: false,
            // is21: this.props.location.state.is21,
            searchable: false,
        }
    }


    //Gets the drink of the day as soon as the page loads
    async componentDidMount() {
        await this.getDOTD();
        this.setState({
            loaded: true,
            user: this.props.user,
            done: true,
            searchable: false
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
            this.setState({dotd: data})
        }).catch(console.log);
    }


    //Todo: Send the query parameters to the server and fuck shit up
    async getSearchResults(){
        await fetch('http://localhost:8080/drink/search?' + this.state.searchText, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({response: data, modalOpen: false})
        }).catch(console.log);
    }


    //Records Search Bar Input
    async handleInputChange(event){
        const value = event.target.value;
        let searchable;
        if(value !== ' ' && value !== undefined && value !== ""){
            searchable = false;
        }else{
            searchable = true;
        }
        await this.setState({searchText: value, searchable: searchable});
    };


    render(){
        if (!this.state.done){
            return(
                <div>
                    <Segment style={{ height: '100vh' }} textAlign={"center"}>
                        <Dimmer active>
                            <Loader content='Loading' />
                        </Dimmer>
                    </Segment>
                </div>
            )
        }
            //IF dotd not ready return loader
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
                                        {this.state.dotd.name}
                                    </Header>
                                    {/*<Card.Content header={this.state.dotd.description}/>*/}
                                    <Card.Content header={"Description Here"}/>

                                    {/*<Card.Meta>{this.state.dotd.publisher}</Card.Meta>*/}
                                    <Card.Meta>Publisher Here</Card.Meta>

                                    <Card.Content extra>
                                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                                    </Card.Content>
                                </Segment>
                            </Card>
                            <br/>
                            <br/>
                            <Grid.Row centered>
                                {/*Todo: Put a button and maybe some options here*/}

                                <Input
                                    // action={{
                                    //     color: 'yellow',
                                    //     labelPosition: 'left',
                                    //     icon: 'search',
                                    //     content: 'Search',
                                    //     onClick: this.getSearchResults()
                                    // }}
                                    // actionPosition='right'
                                    size="huge"
                                    fluid
                                    placeholder='Search...'
                                    onChange={this.handleInputChange}
                                />
                                <br/>
                                <Button color="yellow" onClick={this.getSearchResults} width={8}>
                                    Search
                                </Button>

                                <br/>
                                <p hidden={this.state.loggedIn}>
                                    <Link to='/login'>Log In</Link> - or - <Link to='/register'>Register</Link>
                                </p>

                            </Grid.Row>

                        </Grid.Column>
                        <Grid.Column width={4}/>
                    </Grid>
                    {/*Todo: Put a second grid below for rendering search results*/}
                    <Grid>

                    </Grid>
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