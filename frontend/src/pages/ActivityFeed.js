import React from "react";
import {
    Feed,
    Grid,
    Segment,
    Button,
    Form,
    Modal, Header, FormCheckbox,
    FormGroup, Icon, Message, GridRow, GridColumn, Item
} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {postCard, postCardDelete} from "./utils";
import Map from "./MapContainer";
var base64 = require('base-64');



export default class ActivityFeed extends React.Component {
    constructor(props){
        super(props);
        this.canPost = this.canPost.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);
        this.handleOpenPost = this.handleOpenPost.bind(this);
        this.handleClosePost = this.handleClosePost.bind(this);
        this.handlePostTextChange = this.handlePostTextChange.bind(this);
        this.setResponse = this.setResponse.bind(this);

        this.changeIngredient = this.changeIngredient.bind(this);
        this.createIngredient = this.createIngredient.bind(this);
        this.changeIngredientQuantity = this.changeIngredientQuantity.bind(this);
        this.changeIngredientMeasurement = this.changeIngredientMeasurement.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.postDrink = this.postDrink.bind(this);
        this.postPost = this.postPost.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.fileReader = new FileReader();
        this.removeGeotag = this.removeGeotag.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.handleSettingsChange = this.handleSettingsChange.bind(this);
        this.addMap = this.addMap.bind(this);
        this.delMap = this.delMap.bind(this);
        this.state = {
            user: this.props.user || localStorage.getItem('username'),
            modalOpen: false,
            modalOpen2: false,
            postText: "",
            postDisabled: true,
            postDisabled2: true,
            file: {},
            fileString: "",
            fileName: "",
            selected: false,
            drinkName: "",
            description: "",
            ingredients: [
                {
                    ingredient: "",
                    quantity: "",
                    measurement: ""
                }
            ],
            results: [],
            geoTag: undefined,

            resultsNoDelete: [],
            resultsDelete: [],
            searchVal: 'd',
            mapSegment: false,
            userLocation: this.props.userLocation,

        };
        this.fileInputRef = React.createRef();
    }

    handleSettingsChange(event, value) {
        this.setState({ searchVal: value});
        if (value === 'p') {
            this.handleClose();
            this.handleOpenPost();
        }
        if (value === 'd') {
            this.handleClosePost();
            this.handleOpen();
        }
    };
    async componentDidMount(){
        navigator.geolocation.getCurrentPosition(
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
        console.log(this.state.userLocation);
        this.setState({
            user: this.props.user || localStorage.getItem('username'),
            modalOpen: false,
            description: "",
            drinkName: "",
            postText: "",
            mapSegment: false,
            geoTag: undefined,
            ingredients: [
                {
                    ingredient: "",
                    quantity: "",
                    measurement: ""
                }
            ],
            value: 'd'
        })
        this.getSearchResults();
    }

    async getSearchResults(){
        let url = "http://localhost:8080/post/search?s="
        

        await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            
            this.setState({results: data.results})
                    
            for (let res in data.results) {
                console.log(data.results[res].userName)
                let names = {}
                await fetch("http://localhost:8080/user/"+data.results[res].userName, {
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

        }).catch(this.setState({results: []}));
        console.log(this.state.results)
        
    }

    handleFileRead = (e) => {
        this.setState({fileString: this.fileReader.result});
    };

    async fileChange(event) {
        const file = event.target.files[0];
        const fileName = event.target.files[0].name;
        this.fileReader = new FileReader();

        this.fileReader.onload = this.handleFileRead;

        await this.fileReader.readAsBinaryString(file);

        await this.setState({
            file: file,
            selected: true,
            fileName: fileName,
        });
    };

    canPost(){
        let blankIngr = {ingredient: "", quantity: "", measurement: ""};
        let disabled;
        console.log(this.state.ingredients);
        disabled = !(this.state.ingredients.every(val => val.ingredient !== "") &&
            this.state.ingredients.length >= 1 &&
            this.state.drinkName !== "" &&
            this.state.drinkName !== " ");
        this.setState({
            postDisabled: disabled
        })
    }

    handleClose() {
        //Resets everything back to default values if closed or if posted.
        this.setState({
            modalOpen: false,
            drinkName: "",
            description: "",
            ingredients: [
                {
                    ingredient: "",
                    quantity: "",
                    measurement: ""
                }
            ],
            file: undefined,
            selected: false,
            fileString: "",
            fileName: "",
            postText: ""
        });
    }

    handleOpen() {
        this.setState({modalOpen: true, searchVal: 'd'})
    }

    handleClosePost() {
        //Resets everything back to default values if closed or if posted.
        this.setState({
            modalOpen2: false,
            postText: "",
            fileName: "",
            fileString: "",
            file: undefined
        });
    }

    handlePostTextChange(event) {
        this.setState({postText: event.target.value})
        console.log(event.target.value)
    }

    handleOpenPost() {
        this.setState({modalOpen2: true, searchVal: 'p'})
    }


    async createIngredient(){
        await this.state.ingredients.push({quantity: "", measurement: "", ingredient: ""});
        this.forceUpdate();
        this.canPost();
    }


    async changeIngredientQuantity(event, index){
        let fakeIngredients = this.state.ingredients;
        fakeIngredients[index].quantity = event.target.value;
        await this.setState({ingredients: fakeIngredients});
    }

    async changeIngredientMeasurement(event, index){
        let fakeIngredients = this.state.ingredients;
        fakeIngredients[index].measurement = event.target.value;
        await this.setState({ingredients: fakeIngredients});
    }

    async changeIngredient(event, index){
        let fakeIngredients = this.state.ingredients;
        fakeIngredients[index].ingredient = event.target.value;
        await this.setState({ingredients: fakeIngredients});
        this.canPost();
    }

    async removeIngredient(event){
        console.log(parseInt(event.target.className));
        console.log(event.target.className);
        this.state.ingredients.splice(parseInt(event.target.className), 1);
        this.canPost();
        this.forceUpdate();
    }

    async handleNameChange(event){
        await this.setState({
            drinkName: event.target.value
        });
        this.canPost();
    }

    async handleDescriptionChange(event){
        this.setState({
            description: event.target.value
        });
    }

    addGeotag(row){
        this.setState({
            geoTag: row,
            mapSegment: false
        })
    }

    removeGeotag(){
        this.setState({
            geoTag: undefined,
            mapSegment: false
        })
    }


    async postDrink(){
        let photoString = "";
        if(this.state.selected){
            photoString = await base64.encode(this.state.fileString);
        }
        
        await fetch('http://localhost:8080/drink/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publisher: this.state.user,
                name: this.state.drinkName,
                description: this.state.description,
                ingredients: this.state.ingredients,
                photo: photoString
            })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({response: data, modalOpen: false})
        }).catch(console.log);
    };

    async postPost(){
        let photoString = "";
        if(this.state.selected){
            photoString = await base64.encode(this.state.fileString);
        }

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var n = String(mm + '/' + dd + '/' + yyyy);
        console.log(n, this.state.user);

        await fetch('http://localhost:8080/post/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: this.state.postText,
                image: photoString,
                userId: 0,
                geolocation: " ",
                date: n,
                userName: this.state.user,
            })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({response: data, modalOpen2: false})
            window.location.replace('/feed');
        }).catch(console.log);
    };

    async setResponse() {
        await fetch('http://localhost:8080/post', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then((data) => {
            //console.log(data);
            this.setState({response: data})
        }).catch(console.log);
    }

    addMap(){
        this.setState({mapSegment: true});
    }
    delMap(){
        this.setState({mapSegment: false});
    }

    render(){
        const value = this.state.searchVal;

        let mapSeg;

        if(!this.state.mapSegment){
            if(this.state.geoTag === {} || this.state.geoTag === undefined){
                console.log("segment active")
                mapSeg = <div>
                    <Button icon="plus" content="Add a Location" onClick={this.addMap}/>
                </div>
            }else{
                mapSeg = <div>
                    <Item>
                        <Icon name="map marker alternate"/>
                        <Item.Content>
                            <Item.Header>{this.state.geoTag.name}</Item.Header>
                            <Item.Meta>{this.state.geoTag.vicinity}</Item.Meta>
                        </Item.Content>
                        <Icon name="x" link onClick={this.removeGeotag}/>
                    </Item>
                    {/*<Header color="grey">{this.state.geoTag.name} - {this.state.geoTag.vicinity}</Header>*/}
                </div>
            }

        }else{
            console.log("Not active yet")
            //Todo: Add map shit here
            mapSeg = <div>
                {/*<Segment.Group horizontal>*/}
                {/*    <Segment>*/}
                        <Map
                            addGeotag={this.addGeotag.bind(this)}
                            google={this.props.google}
                            center={{lat: this.state.userLocation.lat, lng: this.state.userLocation.lng}}
                            height='300px'
                            zoom={15}
                        />

                {/*    </Segment>*/}
                {/*    <Segment compact>*/}
                {/*        <Header>Add a Location</Header>*/}

                {/*    </Segment>*/}
                {/*</Segment.Group>*/}

                {/*<Segment.Group horizontal>*/}
                {/*    */}
                {/*    */}
                {/*</Segment.Group>*/}
            </div>
        }


        let notUser = <p/>;
        if (this.props.user === "" || this.props.user === undefined){
            notUser =
                <Modal open={true} closeOnDimmerClick={false} closeOnEscape={false}>
                    <Segment stacked>
                        <h1>Create an Free Account!</h1>
                        <p>
                            <Link to='/login'>Sign up </Link> for Drinks With Friends to create your own drinks and save your favorites from others!
                            <Message>
                                <Icon name='help'/>
                                Already signed up?&nbsp;<Link to='/login'>Login here</Link>&nbsp;instead.
                            </Message>
                        </p>

                    </Segment>
                </Modal>
        }

        return(

            <div>
                {notUser}
                <Modal open={this.state.modalOpen} closeOnDimmerClick={false} closeOnEscape={false} onClose={this.handleClose} size="large" style={{"height": "90vh"}}>
                    <Modal.Header>
                        <Form>
                            <Form.Group inline>
                                <label>Create For</label>
                                <Form.Radio
                                    label='Drinks'
                                    value='d'
                                    checked={value === 'd'}
                                    onClick={(e) => this.handleSettingsChange(e,'d')}
                                    data-testid="search-form-drinks"
                                />
                                <Form.Radio
                                    label='Posts'
                                    value='p'
                                    checked={value === 'p'}
                                    onClick={(e) => this.handleSettingsChange(e,'p')}
                                    data-testid="search-form-ingredients"
                                />
                            </Form.Group>
                        </Form>
                        Create a Drink
                    </Modal.Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form>
                                <Button
                                    content="Choose File"
                                    labelPosition="left"
                                    icon="file"
                                    onClick={() => this.fileInputRef.current.click()}
                                />
                                <input
                                    ref={this.fileInputRef}
                                    type="file"
                                    hidden
                                    onChange={this.fileChange}
                                />
                                <Message hidden={!this.state.selected} >{this.state.fileName}</Message>
                                <Form.Input
                                    placeholder='Drink Name'
                                    content={this.state.drinkName}
                                    onChange={this.handleNameChange}
                                    required={true}
                                />
                                <Form.Input
                                    placeholder='Description'
                                    content={this.state.description}
                                    onChange={this.handleDescriptionChange}
                                />
                                <Button icon="plus" content={"Add Ingredients"} onClick={this.createIngredient}/>
                                <br/>
                                <br/>
                                {this.state.ingredients.map((ing, index) => {
                                    return (
                                        <FormGroup inline>
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Amount"}
                                                labelPosition="top"
                                                width={3}
                                                placeholder="1"
                                                content={this.state.ingredients[index].quantity}
                                                onChange={(e) => this.changeIngredientQuantity(e, index)}
                                            />
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Amount"}
                                                labelPosition="top"
                                                width={3}
                                                placeholder="ex. oz"
                                                content={this.state.ingredients[index].measurement}
                                                onChange={(e) => this.changeIngredientMeasurement(e, index)}
                                            />
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Ingredient"}
                                                labelPosition="top"
                                                width={6}
                                                placeholder="Ex. Smirnoff Vodka"
                                                content={this.state.ingredients[index].ingredient}
                                                onChange={(e) => this.changeIngredient(e, index)}
                                            />
                                            <Button className={index.toString()} icon="minus" onClick={(e) => this.removeIngredient(e, index)}/>
                                        </FormGroup>
                                    )
                                })}
                                <br/>
                                <div className='ui two buttons'>
                                    <Button color='grey' onClick={this.handleClose}>
                                        Cancel
                                    </Button>
                                    <Button color='yellow' disabled={this.state.postDisabled} onClick={() => this.postDrink()}>
                                        Post!
                                    </Button>
                                </div>
                            </Form>

                        </Segment>
                    </Form>
                </Modal>




                
                <Modal open={this.state.modalOpen2} closeOnDimmerClick={false} closeOnEscape={false} onClose={this.handleClose} size="large">
                    <Modal.Header>
                        <Form>
                            <Form.Group inline>
                                <label>Create For</label>
                                <Form.Radio
                                    label='Drinks'
                                    value='d'
                                    checked={value === 'd'}
                                    onClick={(e) => this.handleSettingsChange(e,'d')}
                                    data-testid="search-form-drinks"
                                />
                                <Form.Radio
                                    label='Posts'
                                    value='p'
                                    checked={value === 'p'}
                                    onClick={(e) => this.handleSettingsChange(e,'p')}
                                    data-testid="search-form-ingredients"
                                />
                            </Form.Group>
                        </Form>
                        Create a Post
                    </Modal.Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form>
                                <Form.Group inline>
                                    <Button
                                        content="Choose File"
                                        labelPosition="left"
                                        icon="file"
                                        onClick={() => this.fileInputRef.current.click()}
                                    />
                                    <input
                                        ref={this.fileInputRef}
                                        type="file"
                                        hidden
                                        width="100%"
                                        onChange={this.fileChange}
                                    />
                                    <Message hidden={!this.state.selected} >{this.state.fileName}</Message>
                                    <Form.Input
                                        placeholder='Text for Post'
                                        content={this.postText}
                                        onChange={this.handlePostTextChange}
                                        required={true}
                                    />
                                </Form.Group>

                                <br/>
                                <br/>
                            </Form>

                            {mapSeg}
                            <div className='ui two buttons'>
                                <Button color='grey' onClick={this.handleClosePost}>
                                    Cancel
                                </Button>
                                <Button color='yellow' disabled={this.state.postText === ""} onClick={() => this.postPost()}>
                                    Post!
                                </Button>
                            </div>
                        </Segment>
                    </Form>


                    {/*    <Segment stacked placeholder textAlign="left">*/}
                    {/*    */}
                    {/*        <Form.Group>*/}
                    {/*            <Button*/}
                    {/*                content="Choose File"*/}
                    {/*                labelPosition="left"*/}
                    {/*                icon="file"*/}
                    {/*                onClick={() => this.fileInputRef.current.click()}*/}
                    {/*            />*/}
                    {/*            <input*/}
                    {/*                ref={this.fileInputRef}*/}
                    {/*                type="file"*/}
                    {/*                hidden*/}
                    {/*                onChange={this.fileChange}*/}
                    {/*            />*/}
                    {/*            <Message hidden={!this.state.selected} >{this.state.fileName}</Message>*/}
                    {/*            <Form.Input*/}
                    {/*                placeholder='Text for Post'*/}
                    {/*                content={this.postText}*/}
                    {/*                onChange={this.handlePostTextChange}*/}
                    {/*                required={true}*/}
                    {/*            />*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*        </Form.Group>*/}
                    {/*    </Form>*/}

                    {/*</Segment>*/}

                    {/*<Form size='large'>*/}
                    {/*    <Segment stacked placeholder>*/}

                </Modal>




                <Grid style={{ height: '100vh', overflowY: 'scroll'}} columns={16} centered>
                    <GridRow >
                        <Grid.Column width={4}/>
                        <Grid.Column width={8}>
                            <Button icon="beer" color="yellow" onClick={this.handleOpen}>
                                Create A Post
                            </Button>
                            
                        </Grid.Column>
                        <Grid.Column width={4}/>
                    </GridRow>
                    
                    <br/>
                    <br/>
                    <GridRow>
                        <GridColumn style={{width: "auto"}}>
                            {this.state.results === undefined
                                ? <Header textAlign="center">No Results Found</Header>
                                :this.state.results.map((result, index) => {
                                    if (result.userName === this.state.user) {
                                        console.log(result);
                                        return (
                                            postCardDelete(result)
                                        )
                                    }
                                    return (
                                        postCard(result)
                                    )
                                })
                            }
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        )
    }
}