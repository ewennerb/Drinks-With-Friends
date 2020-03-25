import React from "react";
import 'semantic-ui-css/semantic.min.css';
import {Link} from 'react-router-dom';
import {Input, Segment, Grid, Loader, Button, Form} from 'semantic-ui-react'
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import "../css/Search.css"
import {dotdCard, drinkCard, userCard} from "./utils";


export default class Search extends React.Component{

    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.getDOTD = this.getDOTD.bind(this);
        this.handleRandomModalOpen = this.handleRandomModalOpen.bind(this);
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
            openRandomModal: false,
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
        this.setState({ searchVal: value, results: this.state.results });
    };


    //Fetches the Drink of the Day
    async getDOTD(){
        await fetch('http://localhost:8080/drink/dotd', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            console.log(data);
            await this.setState({dotd: data})
        }).catch(console.log);
        await this.setState({done: true})
    }


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
            if (this.state.searchVal === 'u'){
                this.setState({results: [data]})
            }else{
                this.setState({results: data.results})
            }
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


    handleRandomModalOpen() { //Paul Added
        this.setState({openRandomModal: true});
        console.log("random clicked!");
    }


    render() {
        const value = this.state.searchVal;
        if (!this.state.done) {
            return (
                <div>
                    <Segment style={{height: '40vh', overflow:"auto"  }} textAlign={"center"}>
                        <Dimmer active>
                            <Loader content='Loading'/>
                        </Dimmer>
                    </Segment>

                    <Button color="yellow" onClick={this.handleRandomModalOpen} width={8}>
                        Search
                    </Button>
                </div>
            )
        } else {
            //IF dotd not ready return loader
            return (
                <div>
                    <Grid style={{height: '100vh'}} columns={16} centered>
                        <Grid.Column width={4}/>
                        <Grid.Column width={8} textAlign="center">
                            <br/>
                            <br/>
                            {/*This is a method from utils.js that renders drink of the day now*/}
                            {dotdCard(this.state.dotd)}
                            <br/>
                            <br/>
                            <Grid.Row centered>
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
                                    if(this.state.searchVal === 'd'){
                                        console.log(result);
                                        return (drinkCard(result.name, result.description, result.photo, result.ingredients, result.publisher))
                                    }else if(this.state.searchVal === 'u') {
                                        console.log(result.userName);
                                        return (userCard(result.userName, result.photo))
                                    }
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