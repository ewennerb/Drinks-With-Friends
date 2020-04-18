import React from "react";
import {Link} from 'react-router-dom';
import {Input, Segment, Grid, Loader, Button, Form, FormCheckbox, Header, Accordion, GridColumn, GridRow} from 'semantic-ui-react'
import DrinkCard from "./DrinkCard.js"
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import {dotdCard, minimalDrinkCard, userCard, postCard} from "./utils";
import "../css/Search.css"
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import {config} from '../config/config'

export default class Search extends React.Component{

    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOfficialChange = this.handleOfficialChange.bind(this);
        this.handleSimilarChange = this.handleSimilarChange.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.getDOTD = this.getDOTD.bind(this);
        this.handleRandomModalOpen = this.handleRandomModalOpen.bind(this);
        this.getRecommended = this.getRecommended.bind(this);
        this.getTrendingDrinks = this.getTrendingDrinks.bind(this);

        this.state = {
            user: this.props.user,
            searchText: "",
            dotd: undefined,
            response: undefined,
            loaded: false,
            loggedIn: false,
            officialOnly: false,
            showSimilar: false,
            accActive: 0,
            done: false,
            results: [],
            similarResults: [],
            searchable: false,
            openRandomModal: false,
            randomDrink: "",
            randomNum: 0,
            userLocation: {},
        }
    }


    //Gets the drink of the day as soon as the page loads
    async componentDidMount() {
        await navigator.geolocation.getCurrentPosition(
            async(position) => {
                const { latitude, longitude } = position.coords;
                console.log(latitude);
                console.log(longitude);
                await this.setState({
                    userLocation: { lat: latitude, lng: longitude },
                    done: false
                });
            },
            () => {
                this.setState({ done: false });
            }
        );
        await this.getDOTD();
        await this.setState({
            loaded: false,
            user: this.props.user,
            done: true,
            results: [],
            similarResults: [],
            officialOnly: false,
            accActive: 0,
            showSimilar: false,
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

    handleSimilarChange(event){
        console.log(event);
        this.setState({ showSimilar: !this.state.showSimilar })
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
        await fetch(config.url.API_URL + '/drink/dotd', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            console.log(data);
            await this.setState({dotd: data})
        }).catch(console.log);
        // await this.setState({loaded: true})
    }

    async getRecommended(){
        if (this.state.user === undefined){
            return
        }
        this.setState({results: []})
        await fetch(config.url.API_URL + '/drink/getUserRecommended/'+this.state.user, {
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
        console.log(this.state.searchVal);
        console.log(this.state.officialOnly);
        if (this.state.searchVal === 'u'){
            url = config.url.API_URL + "/user/searchUsers?s=" + this.state.searchText +"&u="+ this.state.user;
        }else if(this.state.searchVal === "d"){
            if(this.state.officialOnly){
                url = config.url.API_URL + "/drink/searchOfficialDrink?s=" + this.state.searchText;
            }else{
                url = config.url.API_URL + "/drink/search?s=" + this.state.searchText;
            }
        }else if(this.state.searchVal === "p"){
            url = config.url.API_URL + "/post/search?s=" + this.state.searchText;
        }else if(this.state.searchVal === "i"){

            url = config.url.API_URL + "/drink/searchIngredients?s=" + this.state.searchText;
        }


        await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            if (this.state.searchVal === 'u'){
                // this.setState({results: [data]})
                this.setState({results: data.results})
                //if (this.state.searchVal === 'd'){
                //    this.setState({similarResults: data.similarDrinks})
               // }
            }else{

                if (this.state.searchVal === 'd'){
                    if (this.state.showSimilar){
                        this.setState({similarResults: data.similarDrinks})
                    }
                    this.setState({results: data.results})

                } else if (this.state.searchVal === 'p'){
                    this.setState({results: data.results})
                    
                    for (let res in data.results) {
                        console.log(data.results[res].userName)
                        let names = {}
                        await fetch(config.url.API_URL + "/user/"+data.results[res].userName, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                        }).then(res => res.json()).then(async (data2) => {
                            names = data2
                            console.log(data2)
                        }).catch(err => {
                            console.log(err)
                        });
                        data.results[res].profileImage = names.photo
                        
                    }
                    this.setState({results: data.results})

                    
                } else {
                    this.setState({results: data.results})
                }
                
            }
            console.log("===== Search Results =====");
            console.log(data);
        }).catch(this.setState({results: []}));
        this.setState({loaded: true});
        
    }

    getTrendingDrinks(e){
        
        fetch('http://localhost:8080/drink/trending', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            this.setState({results: data.results})
        }).catch(console.log);
        console.log("trending")
        this.handleSettingsChange(e, 't');
    }

    getRandomInt(max) { //Paul Added
        this.setState({ randomNum: (Math.floor(Math.random() * Math.floor(max))) });
    }

    async handleRandomModalOpen() { //Paul Added
        this.setState({openRandomModal: true, searchVal: 'd'});

        await fetch(config.url.API_URL + '/drink', {
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
        await fetch(config.url.API_URL + "/drink/search?s=" + randomDrink.name, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            this.setState({results: data.results})
        }).catch(this.setState({results: []}));
        this.setState({loaded: true});

    }


    handleAcc = (e, titleProps) => {
        const { index } = titleProps;
        const { accActive } = this.state;
        const newIndex = accActive === index ? -1 : index;

        this.setState({ accActive: newIndex })
    };




    render() {
        const value = this.state.searchVal;
        const activeIndex = this.state.accActive;
        let showMsg = true;
        let search;
        console.log(this.state.user);
        if (!this.state.showSimilar){
            search =  
                <div>
                    {this.state.results === undefined
                        ? <Header textAlign="center">No Results Found</Header>
                        : this.state.results.map((result, index) => {
                            if(this.state.searchVal === 'd'){
                                console.log(result);
                                return(
                                    <DrinkCard
                                        user={this.state.user}
                                        index={index}
                                        drink={result}
                                        userLocation={this.state.userLocation}
                                    />
                                )
                                // return (drinkCard(index, result.name, result.description, result.photo, result.ingredients, result.publisher))
                            }else if(this.state.searchVal === 'u') {
 
                                return (userCard(index, result.userName, result.photo))
                            } else if(this.state.searchVal === 'i'){
                                //return (ingredientCard(index, result))
                                return(
                                    <DrinkCard
                                        user={this.state.user}
                                        index={index}
                                        drink={result}
                                        userLocation={this.state.userLocation}
                                    />
                                )
                            }
                            else if (this.state.searchVal === 'p'){
                                return (
                                    postCard(result)
                                )
                            } else if (this.state.searchVal === 't') {
                                return(
                                    minimalDrinkCard(result)
                                )
                            }
                        })
                    }
                </div>
        } else {
            search =  
                <div>
                    <div style={{float: "left", padding:"7px"}}>
                        
                        {this.state.results === undefined
                            ? <Header textAlign="center">No Results Found</Header>

                            : this.state.results.map((result, index) => {
                                if(this.state.searchVal === 'd'){
                                    console.log(result);
                                    return(
                                        <DrinkCard
                                            user={this.state.user}
                                            index={index}
                                            drink={result}
                                            userLocation={this.state.userLocation}
                                        />
                                    )
                                    // return (drinkCard(index, result.name, result.description, result.photo, result.ingredients, result.publisher))
                                }else if(this.state.searchVal === 'u') {
                                    console.log(result);
                                    console.log("Before return user card");
                                    console.log(index);
                                    return (userCard(index, result.userName, result.photo))
                                } else if(this.state.searchVal === 'i'){
                                    //return (ingredientCard(index, result))
                                    return(
                                        <DrinkCard
                                            user={this.state.user}
                                            index={index}
                                            drink={result}
                                            userLocation={this.state.userLocation}
                                        />
                                    )
                                }
                                else if (this.state.searchVal === 'p'){
                                    return (
                                        postCard(result)
                                    )
                                } 
                            })
                        }
                    </div>
                    <div style={{float: "right", padding:"7px"}}>
                        {this.state.similarResults === undefined
                            ? <Header textAlign="center">No Results Found</Header>
                            : this.state.similarResults.map((result, index) => {
                                if(this.state.searchVal === 'd'){
                                    console.log(result);
                                    return(
                                        <DrinkCard
                                            user={this.state.user}
                                            index={index}
                                            drink={result}
                                            userLocation={this.state.userLocation}
                                        />
                                    )
                                    // return (drinkCard(index, result.name, result.description, result.photo, result.ingredients, result.publisher))
                                }
                            })
                        }
                    </div>
                </div>
        }
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

            if (this.state.user !== undefined){
                showMsg = false;
            }

            //IF dotd not ready return loader
            return (
                <div>
                    <Grid style={{height: '100vh', overflowY: 'scroll'}} columns={16} centered>
                        <Grid.Column width={4} className="frontpage"/>
                        <Grid.Column width={8} >
                            <Grid.Row textAlign="center">
                                <br/>
                                <br/>

                                {/*This is a method from utils.js that renders drink of the day now*/}
                                {/* {dotdCard(this.state.dotd)} */}

                                <br/>
                                <br/>
                            </Grid.Row>


                            <Grid.Row textAlign="left">
                                
                                <Grid.Column width={16} textAlign="left">
                                    <Accordion>
                                        <Accordion.Title
                                            active={activeIndex === 0}
                                            index={0}
                                            onClick={this.handleAcc}
                                        >
                                            <Icon name="dropdown"/>
                                            Search Options
                                        </Accordion.Title>
                                        {/* changed this to a boolean because compiler yelled */}
                                        <Accordion.Content active={this.state.accActive != 0}>
                                            <Form>
                                                    <Form.Group inline>
                                                        <label>Search For</label>
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
                                                        <Form.Radio
                                                            label='Trending'
                                                            value='t'
                                                            checked={value === 't'}
                                                            onClick={(e) => this.getTrendingDrinks(e)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group inline>
                                                        <FormCheckbox
                                                            label='Display Official Drinks Only'
                                                            checked={this.state.officialOnly}
                                                            onClick={this.handleOfficialChange}
                                                            data-testid="search-form-official"
                                                        />
                                                    </Form.Group>
                                                    <Form.Group inline>
                                                        <FormCheckbox
                                                            label='Show Me Similar Drinks'
                                                            checked={this.state.showSimilar}
                                                            onClick={this.handleSimilarChange}
                                                            data-testid="search-form-similar"
                                                        />
                                                    </Form.Group>
                                            </Form>
                                        </Accordion.Content>
                                    </Accordion>

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row centered textAlign="center">
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
                                <div style={{textAlign: "center"}}>
                                    <div style={{display: "inline-block"}}>
                                        <p hidden={!showMsg}>
                                            <Link to='/login'>Log In</Link> - or - <Link to='/register'>Register</Link>
                                        </p>
                                    </div>
                                </div>


                                <br/>
                                <br/>

                                <br/>
                                <br/>
                            </Grid.Row>

                        </Grid.Column>
                        <Grid.Column width={4}/>
                        <GridRow>{search}</GridRow>
                    </Grid>

                </div>
            )
        }
    }
}




