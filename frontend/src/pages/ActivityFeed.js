import React from "react";
import {
    Feed,
    Grid,
    Segment,
    Button,
    Form,
    Modal, Header,
    FormGroup, Icon, Message, GridRow, GridColumn
} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {dotdCard, ingredientCard, userCard, postCard} from "./utils";
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
        this.getSearchResults = this.getSearchResults.bind(this);
        
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
            results: []
        };
        this.fileInputRef = React.createRef();
    }

    componentDidMount(){
        this.setState({
            user: this.props.user || localStorage.getItem('username'),
            modalOpen: false,
            description: "",
            drinkName: "",
            postText: "",
            ingredients: [
                {
                    ingredient: "",
                    quantity: "",
                    measurement: ""
                }
            ],
        })
        this.getSearchResults();
    }

    async getSearchResults(){
        let url = "http://localhost:8080/post/"
        

        await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            
            this.setState({results: data})
            
            console.log("===== Search Results =====");
            console.log(data);
        }).catch(this.setState({results: []}));
        
        
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
        this.setState({modalOpen: true})
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
        this.setState({modalOpen2: true})
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
        console.log(n);

        await fetch('http://localhost:8080/post/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: this.state.postText,
                image: photoString,
                userName: this.state.user,
                geolocation: " ",
                date: n
            })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({response: data, modalOpen2: false})
        }).catch(console.log);
    };

    render(){

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
                <Modal open={this.state.modalOpen} closeOnDimmerClick={false} closeOnEscape={false} onClose={this.handleClose}>
                    <Modal.Header>Create a Drink</Modal.Header>
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




                
                <Modal open={this.state.modalOpen2} closeOnDimmerClick={false} closeOnEscape={false} onClose={this.handleClose}>
                    <Modal.Header>Create a Post</Modal.Header>
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
                                    placeholder='Text for Post'
                                    content={this.postText}
                                    onChange={this.handlePostTextChange}
                                    required={true}
                                />
                                <br/>
                                <br/>
                                <div className='ui two buttons'>
                                    <Button color='grey' onClick={this.handleClosePost}>
                                        Cancel
                                    </Button>
                                    <Button color='yellow' disabled={this.state.postText == ""} onClick={() => this.postPost()}>
                                        Post!
                                    </Button>
                                </div>
                            </Form>

                        </Segment>
                    </Form>
                </Modal>




                <Grid style={{ height: '100vh' }} columns={16} centered>
                    <GridRow >
                        <Grid.Column width={4}/>
                        <Grid.Column width={8}>
                            <Button icon="beer" color="yellow" onClick={this.handleOpen}>
                                Create Drink
                            </Button>
                            <Button icon="beer" color="yellow" onClick={this.handleOpenPost}>
                                Create Post
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
                                    console.log(result)
                                    return (
                                        postCard(result)
                                    )
                                })
                            }
                        </GridColumn>
                    </GridRow>
                </Grid>
                <Feed>
                    Bottom Text
                </Feed>
            </div>
        )
    }
}