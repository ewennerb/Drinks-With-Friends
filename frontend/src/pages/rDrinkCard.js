import React from "react";
import {Card, Image, List, Loader, FeedLike, Icon, Menu,
     Modal, Button, Form, Segment, Search, Container,
    FormGroup, Message, } from "semantic-ui-react";
import {NavLink, Link} from "react-router-dom";
import {config} from '../config/config'
import {EmailShareButton, EmailIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon} from "react-share";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";

import "../css/Drink.css"
//rods version
var base64 = require('base-64');


export default class DrinkCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // user: this.props.user,
            user: undefined,
            index: this.props.index,
            drink: this.props.drink,
            likes: this.props.drink.likes,
            dislikes: this.props.drink.dislikes,
            userLocation: this.props.userLocation,
            ready: false,
            isLiked: false,
            isDisliked: false,
            shareModal: false,
            mapModal: false,
            isLoading: false,
            searchInput: "",
            //rods
            profileOwner: this.props.profileOwner,
            editModal:false,
            //stuff for modal
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
        };
        this.location = {};
        this.likeDislikeRequestor = this.likeDislikeRequestor.bind(this);
        this.handleLikeDislike = this.handleLikeDislike.bind(this);
        this.openMap = this.openMap.bind(this);
        this.closeMap = this.closeMap.bind(this);
        this.openShare = this.openShare.bind(this);
        this.closeShare = this.closeShare.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);

        //this.handleEditDrink = this.handleEditDrink.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);
        this.changeIngredient = this.changeIngredient.bind(this);
        this.createIngredient = this.createIngredient.bind(this);
        this.changeIngredientQuantity = this.changeIngredientQuantity.bind(this);
        this.changeIngredientMeasurement = this.changeIngredientMeasurement.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.postDrink = this.postDrink.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.fileReader = new FileReader();
    }


    async componentDidMount() {

        let userData;

        await fetch(config.url.API_URL + "/user/" + this.props.user, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {

            //Doing another fetch to get the status of each drink and whether it is liked by the user or not
            let user;
            let isLiked = false;
            let isDisliked = false;

            //DOesn't do query if not logged in
            if (data.userName === null){
                user = undefined;
            }else{
                user = data;
                await fetch(config.url.API_URL + "/user/getLikeStatus/" + user.userName + "/" + this.props.drink.id, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(res => res.json()).then(async (data) => {
                    console.log(data);
                    isLiked = data.isLiked;
                    isDisliked = data.isDisliked;
                }).catch(console.log);
            }
            // await this.setState({dotd: data})
            await this.setState({
                user: user,
                index: this.props.index,
                drink: this.props.drink,
                likes: this.props.drink.likes,
                dislikes: this.props.drink.dislikes,
                userLocation: this.props.userLocation,
                ready: true,
                isLiked: isLiked,
                isDisliked: isDisliked
            });
        }).catch(console.log);



    }



    async likeDislikeRequestor(body, url, option) {
        console.log(url);
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        }).then(res => res.json()).then(async (data) => {
            await this.setState({
                likes: data.likes,
                dislikes: data.dislikes
            })
        }).catch(console.log);
    }



    async handleLikeDislike(option){
        const body = JSON.stringify({
            userName: this.state.user.userName,
            phoneNumber: this.state.user.phoneNumber,
            password: this.state.user.password,
            name: this.state.user.name,
            email: this.state.user.email,
            photo: this.state.user.photo,
            bio: this.state.user.bio,
            likedDrinks: this.state.user.likedDrinks,
            dislikedDrinks: this.state.user.dislikedDrinks,
            favoritedDrink: this.state.user.favoritedDrink,
            publishedDrinks: this.state.user.publishedDrinks,
            postHistory: this.state.user.postHistory,
            friendsList: this.state.user.friendsList,
            dateCreated: this.state.user.dateCreated,
            lastLogin: this.state.user.lastLogin,
        });

        console.log(this.state.drink);
        if (option === "like") {
            if (!this.state.isLiked) {
                //If disliked and like gets hit, flip
                if (this.state.isDisliked){
                    this.likeDislikeRequestor(body, config.url.API_URL + "/user/likeDrink/" + this.state.drink.id + "/flip", option);
                }else{
                    //Do normal like
                    this.likeDislikeRequestor(body, config.url.API_URL + "/user/likeDrink/" + this.state.drink.id + "/on", option);
                }

                this.setState({isLiked: true, isDisliked: false})
            } else {
                this.likeDislikeRequestor(body, config.url.API_URL + "/user/likeDrink/" + this.state.drink.id + "/off", option);
                this.setState({isLiked: false, isDisliked: false})
            }
        }else{
            if(!this.state.isDisliked) {
                //If liked and dislike gets hit, flip
                if (this.state.isLiked){
                    this.likeDislikeRequestor(body, config.url.API_URL + "/user/dislikeDrink/" + this.state.drink.id + "/flip", option);
                }else{
                    //Do normal like
                    this.likeDislikeRequestor(body, config.url.API_URL + "/user/dislikeDrink/" + this.state.drink.id + "/on" , option);
                }
                this.setState({isLiked: false, isDisliked: true})
            }else{
                //Undo DisLike
                this.likeDislikeRequestor(body, config.url.API_URL + "/user/dislikeDrink/" + this.state.drink.id + "/off", option);
                this.setState({ isLiked: false, isDisliked: false});
            }
        }
    }

    likeColor(){
        if(this.state.isLiked){
            return "yellow";
        }else{
            return undefined;
        }
    }

    dislikeColor(){
        if(this.state.isDisliked){
            return "yellow";
        }else{
            return undefined;
        }
    }

    openShare(){
        this.setState({shareModal: true});
    }

    closeShare(){
        this.setState({shareModal: false});
    }


    openMap(){
        this.setState({mapModal: true});
    }

    closeMap(){
        this.setState({mapModal: false});
    }


    handleSearchChange(event) {
        // console.log(google);
        const value = event.target.value;
        // console.log(value);
        this.setState({searchInput: value, isLoading: true});
    }

    handleEditDrink() {
        this.setState({
        editModal: true
      }) 
    }
    handleClose() {
        this.setState({
            editModal: false,   
        })
      }
    
    handleOpen() {
          this.setState({
            editModal: true
        }) 
      }


    render(){
        // console.log(this.state.user);
        let theseProps = this.props;
        console.log(this.state.userLocation);
        let {user, drink, index, ready} = this.state;
        let drinkPic, likes, editDrink;
        if(ready){
            console.log(user);
            if (user !== undefined) {

                let lColor = this.likeColor();
                let dColor = this.dislikeColor();

                likes =
                    <Menu fluid>
                        <Menu.Item position="left">
                            <FeedLike>
                                <Icon name="caret up" size="large" onClick={() => this.handleLikeDislike("like")} color={lColor}/>
                            </FeedLike>
                            {this.state.likes}
                        </Menu.Item>
                        <Menu.Item position="right">
                            {this.state.dislikes}
                            <FeedLike>
                                <Icon name="caret down" size="large" onClick={() => this.handleLikeDislike("dislike")} color={dColor}/>
                            </FeedLike>
                        </Menu.Item>
                    </Menu>
                ;

            }else{
                likes = <div>
                    <Menu fluid>
                        <Menu.Item position="left">
                            {this.state.likes} Likes
                        </Menu.Item>
                        <Menu.Item position="right">
                            {this.state.dislikes} Dislikes
                        </Menu.Item>
                    </Menu>
                </div>;
            }

            //Figures out if the drink comes with an image or not
            if(drink.photo !== ""){
                drinkPic = <Image floated="right" size="small" src={`data:image/jpeg;base64,${drink.photo}`} data-testid={"drink-b64-img-" + index.toString()}/>
            }else{
                drinkPic = <Image floated="right" size="small" src={process.env.PUBLIC_URL + "/placeholder-drink.png"} data-testid={"drink-placeholder-img-" + index.toString()}/>
            }
            //whether to render edit button or not
            if(this.state.profileOwner){
                editDrink = 
                    <Button animated="fade" onClick={this.handleOpen}  >
                    <Button.Content visible>Edit Drink</Button.Content>
                    <Button.Content hidden>
                    <Icon name="edit"/>
                    </Button.Content>
                    </Button>
                
            } else {
                editDrink = <p/>;
            }
            return(
                <div>
                    <Modal open={this.state.shareModal} onClose={this.closeShare} closeOnEscape={false} size="mini" centered closeIcon>
                        <Header textAlign="left">Share Via:</Header>
                        {/*Todo: Actually plug in a legit URL and all the other paramters*/}
                        <Segment basic textAlign="center">
                            <FacebookShareButton quote="Check out this drink I found!" hashtag="#DWF" url={`http://localhost:3000/${drink.publisher}/drink/${drink.name}`}>
                                <FacebookIcon size={32}/>
                            </FacebookShareButton>&nbsp;
                            <TwitterShareButton title={"Drinks With Friends"} url={`http://localhost:3000/${drink.publisher}/drink/${drink.name}`}>
                                <TwitterIcon size={32}/>
                            </TwitterShareButton>&nbsp;
                            {/*Todo: Figure out how to set up a noReply email address that can send this shit*/}
                            <EmailShareButton subject="Check out this drink I found!" url={`http://localhost:3000/${drink.publisher}/drink/${drink.name}`}>
                                <EmailIcon size={32}/>
                            </EmailShareButton>
                        </Segment>
                    </Modal>
                    {/*<Modal open={this.state.mapModal} onClose={this.closeMap} closeOnEscape={false} centered closeIcon size="large">*/}
                    {/*    <h1>Goodle Maps</h1>*/}
                    {/*    <div style={{ margin: '100px' }}>*/}
                    {/*        <GeoSearch*/}
                    {/*            google={this.props.google}*/}
                    {/*            center={{lat: this.state.userLocation.lat, lng: this.state.userLocation.lng}}*/}
                    {/*        />*/}
                    {/*        <Map*/}
                    {/*            google={this.props.google}*/}
                    {/*            center={{lat: this.state.userLocation.lat, lng: this.state.userLocation.lng}}*/}
                    {/*            height='300px'*/}
                    {/*            zoom={15}*/}
                    {/*        />*/}


                    {/*    </div>*/}
                    {/*</Modal>*/}
                    <Card centered style={{width: "450px"}} data-testid={"drink-card-" + index.toString()}>
                        {/*<Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>*/}
                        <Card.Content>

                            <Card.Header textAlign="left" data-testid={"drink-name-" + index.toString()}>
                                <Link style={{textDecoration: "none"}} to={(`/${drink.publisher}/drink/${drink.name}`)}>{drink.name}</Link>
                                <Icon link name="share alternate" color="grey" style={{"position": "absolute", "right": "0px"}} onClick={this.openShare}/>
                                <Icon link name="globe" color="grey" style={{"position": "absolute", "right": "25px"}} onClick={this.openMap}/>
                                <br/>
                                {editDrink}
                            </Card.Header>

                            <Card.Meta className="pub" textAlign="left" data-testid={"drink-publisher-" + index.toString()}> <Link style={{textDecoration: "none"}} to={(`/${drink.publisher}`)}>{drink.publisher}</Link></Card.Meta>
                        </Card.Content>
                        <Card.Content textAlign="left">
                            {drinkPic}
                            <div>
                                <p><strong>Description: </strong></p>
                                <Card.Description data-testid={"drink-description-" + index.toString()}>{drink.description}</Card.Description>

                            </div>

                            <div>
                                <br/>
                                <p><strong>Ingredients: </strong></p>
                                <Card.Content>
                                    <List bulleted >
                                        {drink.ingredients.map((ingr, idx) => {
                                            return (
                                                <p key={idx} data-testid={"drink-"+ index.toString() + "-ingredient-" + idx.toString()}>
                                                    {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                                </p>
                                            )
                                        })}
                                    </List>
                                </Card.Content>
                            </div>
                          
                        </Card.Content>

                        <Card.Content>
                            {likes}
                        </Card.Content>
                    </Card>



                {/* rods modal */}
                
            <Modal open={this.state.editModal} closeOnDimmerClick={false} closeOnEscape={false} onClose={this.handleClose} size="large">
            <Modal.Header>
                Edit a Drink
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
                            accept="image/gif, image/jpeg, image/png"
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
                {/* end of modal */}
            </div>//parentelement
            );
        }else{
            return(
                <Loader active inline='centered' />
            )
        }
    }

    //rods
    handleFileRead = (e) => {
        this.setState({fileString: this.fileReader.result});
    };

    
    async fileChange(event) {
        if(event.target.files === undefined){
            this.setState({
                file: undefined,
                selected: false,
                fileName: ""
            })
        }else{
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
        }
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
        
        await fetch(config.url.API_URL + '/drink/', {
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

}

// export const drinkCard = (index, name, description, photo, ingredients, publisher, likes, ) => {
//
//     )
// };