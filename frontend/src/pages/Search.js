import React from "react";
import {Link} from 'react-router-dom';
import {Input, Segment, Grid, Loader, Button, Form, FormCheckbox, Header} from 'semantic-ui-react'
import DrinkCard from "./DrinkCard.js"
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import {dotdCard, ingredientCard, userCard, postCard} from "./utils";
import "../css/Search.css"

export default class Search extends React.Component{

    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOfficialChange = this.handleOfficialChange.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.getDOTD = this.getDOTD.bind(this);
        this.handleRandomModalOpen = this.handleRandomModalOpen.bind(this);
        this.getRecommended = this.getRecommended.bind(this);
        this.state = {
            user: this.props.user,
            searchText: "",
            dotd: undefined,
            response: undefined,
            loaded: false,
            loggedIn: false,
            officialOnly: true,
            done: false,
            results: [],
            searchable: false,
            openRandomModal: false,
            randomDrink: "",
            randomNum: 0,
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
            officialOnly: true,
            searchable: false,
            searchVal: "d",
        })
    }


    handleSettingsChange(event, value) {
        this.setState({ searchVal: value, results: [] });
    };


    handleOfficialChange(event){
        console.log(event);
        this.setState({ officialOnly: !this.state.officialOnly })
    }


    //Records Search Bar Input
    async handleInputChange(event){
        const value = event.target.value;
        let searchable;
        searchable = !(value !== ' ' && value !== undefined && value !== "");
        await this.setState({searchText: value, searchable: searchable});
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

    async getRecommended(){
        if (this.state.user === undefined){
            return
        }
        await fetch('http://localhost:8080/drink/getUserRecommended/'+this.state.user, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            this.setState({results: data.results, searchVal: 'd'})
        }).catch(console.log);
        this.setState({loaded: true});
    }


    async getSearchResults(){
        let url;
        console.log(this.state.searchVal)
        console.log(this.state.officialOnly)
        if (this.state.searchVal === 'u'){
            url = "http://localhost:8080/user/" + this.state.searchText;
        }else if(this.state.searchVal === "d"){
            if(this.state.officialOnly){
                url = "http://localhost:8080/drink/searchOfficialDrink?s=" + this.state.searchText;
            }else{
                url = "http://localhost:8080/drink/search?s=" + this.state.searchText;
            }
        }else if(this.state.searchVal === "p"){
            url = "http://localhost:8080/post/search?s=" + this.state.searchText;
        }else if(this.state.searchVal === "i"){
            url = "http://localhost:8080/drink/searchIngredients?s=" + this.state.searchText;
        }

        //Todo: IF this.state.officialOnly set url = "http://localhost:8080/ingredients/searchOfficialDrink?s=" + this.state.searchText;
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
        this.setState({loaded: true});

        console.log(this.state.user);
    }

    getRandomInt(max) { //Paul Added
        this.setState({ randomNum: (Math.floor(Math.random() * Math.floor(max))) });
    }

    async handleRandomModalOpen() { //Paul Added
        this.setState({openRandomModal: true});

        await fetch('http://localhost:8080/drink', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            console.log(data);
            await this.setState({randomDrink: data})
        }).catch(console.log);
        //await this.setState({done: true})

        var max = this.state.randomDrink.length;
        //console.log(max); //test to make sure that the max is right
        this.getRandomInt(max);
        var randomDrink = this.state.randomDrink[this.state.randomNum];
        console.log(randomDrink.name);


        //searches the drink
        await fetch("http://localhost:8080/drink/search?s=" + randomDrink.name, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            this.setState({results: data.results})
        }).catch(this.setState({results: []}));
        this.setState({loaded: true});

        console.log(this.state.user);

    }




    render() {
        const value = this.state.searchVal;
        const officialOnly = this.state.officialOnly;
        if (!this.state.done) {
            return (
                <div>
                    <Segment style={{height: '40vh', overflow:"auto"  }} textAlign={"center"}>
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
                    <Grid style={{height: '100vh', overflowY: 'scroll'}} columns={16} centered>
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
                                            onClick={(e) => this.handleSettingsChange(e,'d')}
                                            data-testid="search-form-drinks"
                                        />
                                        <Form.Radio
                                            label='Ingredients'
                                            value='i'
                                            checked={value === 'i'}
                                            onClick={(e) => this.handleSettingsChange(e,'i')}
                                            data-testid="search-form-ingredients"
                                        />
                                        <Form.Radio
                                            label='Users'
                                            value='u'
                                            checked={value === 'u'}
                                            onClick={(e) => this.handleSettingsChange(e,'u')}
                                            data-testid="search-form-users"
                                        />
                                        <Form.Radio
                                            label='Posts'
                                            value='p'
                                            checked={value === 'p'}
                                            onClick={(e) => this.handleSettingsChange(e,'p')}

                                        />
                                        <FormCheckbox
                                            label='Display Official Drinks Only'
                                            checked={officialOnly}
                                            onClick={this.handleOfficialChange}
                                            data-testid="search-form-official"
                                        />
                                    </Form.Group>
                                </Form>
                                <Input
                                    size="huge"
                                    fluid
                                    placeholder='Search...'
                                    onChange={this.handleInputChange}
                                    data-testid="search-form-bar"
                                    value={this.state.searchText}
                                />

                                <br/>
                                <div className='ui three buttons'>
                                    <Button color='yellow' onClick={this.getSearchResults} width={8} content="Search"/>
                                    <Button color='yellow' onClick={this.getRecommended} width={8} content="For You"/>
                                    <Button color='yellow' onClick={this.handleRandomModalOpen} width={8} content="Random Drink"/>
                                </div>
                                <br/>
                                <br/>
                                <p hidden={this.state.loggedIn}>
                                    <Link to='/login'>Log In</Link> - or - <Link to='/register'>Register</Link>
                                </p>
                                <br/>
                                <br/>
                                <div>
                                    <Button color="yellow" onClick={this.handleRandomModalOpen} width={8}>
                                        Random Drink
                                    </Button>
                                </div>
                                
                                {this.state.results === undefined
                                    ? <Header>No Results Found</Header>
                                    : this.state.results.map((result, index) => {
                                        if(this.state.searchVal === 'd'){
                                            console.log(result);
                                            return(
                                                <DrinkCard
                                                    user={this.state.user}
                                                    index={index}
                                                    drink={result}
                                                />
                                            )
                                            // return (drinkCard(index, result.name, result.description, result.photo, result.ingredients, result.publisher))
                                        }else if(this.state.searchVal === 'u') {
                                            console.log(result.userName);
                                            return (userCard(index, result.userName, result.photo))
                                        } else if(this.state.searchVal === 'i'){
                                                return (ingredientCard(index, result))
                                        }
                                        else if (this.state.searchVal === 'p'){
                                            return (
                                                postCard(result)
                                            )
                                        }
                                    })
                                }


                                <br/>
                                <br/>

                            </Grid.Row>

                        </Grid.Column>
                        <Grid.Column width={4}/>
                    </Grid>

                </div>
            )
        }
    }
}