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
    Loader, Button, List,
    Form
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
            results: [],
            searchable: false,
        }
    }


    //Gets the drink of the day as soon as the page loads
    async componentDidMount() {
        await this.getDOTD();
        this.setState({
            loaded: false,
            user: this.props.user,
            done: true,
            results: [],
            searchable: false,
            searchVal: "d",
        })
    }

    handleSettingsChange = (e, { value }) => {
        console.log(value);
        this.setState({ searchVal: value });
        console.log(this.state.value);
    };

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
        }).then(res => res.json()).then(async (data) => {
            console.log(data);
            await this.setState({dotd: data})
        }).catch(console.log);
        await this.setState({done: true})
    }


    //Todo: Send the query parameters to the server and fuck shit up
    async getSearchResults(){

        let url;
        if (this.state.searchVal === 'u'){
            url = "http://localhost:8080/user/" + this.state.searchText;
        }else if(this.state.searchVal === "d"){
            url = "http://localhost:8080/drink/search?s=" + this.state.searchText;
        }else if(this.state.searcVal === "i"){
            url = "http://localhost:8080/ingredients/search?s=" + this.state.searchText;
        }
        console.log(url);
        await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            console.log(data);
            this.setState({results: data.results})
        }).catch(this.setState({results: []}));
        this.setState({loaded: true})
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


    render() {

        const value = this.state.searchVal;

        if (!this.state.done) {
            return (
                <div>
                    <Segment style={{height: '40vh'}} textAlign={"center"}>
                        <Dimmer active>
                            <Loader content='Loading'/>
                        </Dimmer>
                    </Segment>
                </div>
            )
        } else {
            //IF dotd not ready return loader
            return (
                <div>
                    <Grid style={{height: '100vh', overflow: "scroll"}} columns={16} centered>
                        <Grid.Column width={4}/>
                        <Grid.Column width={8} textAlign="center">
                            <br/>
                            <br/>
                            <Card style={{width: "500px"}} centered>
                                <Card.Header>Today's Drink of the Day</Card.Header>
                                <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                                    <Header textAlign="center" style={{marginTop: "0px"}}>
                                        {this.state.dotd.name}
                                    </Header>
                                    <Card.Description content={this.state.dotd.description}/>
                                    <br/>
                                    <Card.Content>
                                        <List bulleted>
                                            {this.state.dotd.ingredients.map(ingr => {
                                                return (
                                                    <List.Item>
                                                        {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                                    </List.Item>
                                                )
                                            })}
                                        </List>
                                    </Card.Content>
                                    <Card.Meta>{this.state.dotd.publisher}</Card.Meta>
                                    <Card.Content extra>
                                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                                    </Card.Content>
                                </Segment>
                            </Card>
                            <br/>
                            <br/>
                            <Grid.Row centered>
                                {/*Todo: Put a button and maybe some options here*/}
                                <Form>
                                    <Form.Group inline>
                                        <label>Search Options</label>
                                        <Form.Radio
                                            label='Drinks'
                                            value='d'
                                            checked={value === 'd'}
                                            onClick={this.handleSettingsChange}
                                        />
                                        <Form.Radio
                                            label='Ingredients'
                                            value='i'
                                            checked={value === 'i'}
                                            onClick={this.handleSettingsChange}
                                        />
                                        <Form.Radio
                                            label='Users'
                                            value='u'
                                            checked={value === 'u'}
                                            onClick={this.handleSettingsChange}
                                        />
                                    </Form.Group>
                                </Form>

                                <Input
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
                                <br/>
                                <br/>
                                {this.state.results.map(result => {
                                    //Todo: Add logic here to figure out what type of results to render
                                    return (
                                        <Card style={{width: "500px"}} centered>
                                            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                                                <Header textAlign="center" style={{marginTop: "0px"}}>
                                                    {result.name}
                                                </Header>
                                                <Card.Description header={result.description}/>
                                                <br/>
                                                <Card.Content>
                                                    <List bulleted>
                                                        {result.ingredients.map(ingr => {
                                                            return (
                                                                <List.Item>
                                                                    {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                                                </List.Item>
                                                            )
                                                        })}
                                                    </List>
                                                </Card.Content>


                                                {/*<Card.Meta>{this.state.dotd.publisher}</Card.Meta>*/}
                                                <Card.Meta>{result.publisher}</Card.Meta>

                                                <Card.Content extra>
                                                    <Rating icon='star' defaultRating={5} maxRating={5}/>
                                                </Card.Content>
                                            </Segment>
                                        </Card>
                                    )
                                })}
                            </Grid.Row>

                        </Grid.Column>
                        <Grid.Column width={4}/>
                    </Grid>

                </div>
            )
        }
    }
}