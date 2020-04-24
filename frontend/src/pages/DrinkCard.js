import React from "react";
import {Card, Image, List, Loader, FeedLike, Icon, Menu, Modal, Button, Form, Segment, Search, FormGroup, Message} from "semantic-ui-react";
import {NavLink, Link} from "react-router-dom";
import {config} from '../config/config'
import {EmailShareButton, EmailIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon} from "react-share";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import Map from "./MapContainer";
import GeoSearch from "./geoSearch";
import "../css/Drink.css"
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

            editing: false,
            edit_drinkName: this.props.drink.name,
            edit_description: this.props.drink.description,
            selected: false,
            edit_ingredients: JSON.parse(JSON.stringify(this.props.drink.ingredients)),
            edit_postDisabled: false,
            edit_fileString: "",
            editable: this.props.user === this.props.drink.publisher
        };
        
        this.location = {};
        this.likeDislikeRequestor = this.likeDislikeRequestor.bind(this);
        this.handleLikeDislike = this.handleLikeDislike.bind(this);
        this.openMap = this.openMap.bind(this);
        this.closeMap = this.closeMap.bind(this);
        this.openShare = this.openShare.bind(this);
        this.closeShare = this.closeShare.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);

        
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.changeIngredient = this.changeIngredient.bind(this);
        this.createIngredient = this.createIngredient.bind(this);
        this.changeIngredientQuantity = this.changeIngredientQuantity.bind(this);
        this.changeIngredientMeasurement = this.changeIngredientMeasurement.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.canPost = this.canPost.bind(this);
        this.editDrink = this.editDrink.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.fileReader = new FileReader();
        this.handleClose = this.handleClose.bind(this);
        this.fileInputRef = React.createRef();
        
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
        const value = event.target.value;
        this.setState({searchInput: value, isLoading: true});
    }


    async handleNameChange(e){
        await this.setState({
            edit_drinkName: e.target.value
        });
        this.canPost();
    }

    async handleDescriptionChange(event){
        this.setState({edit_description: event.target.value})
    }


    async createIngredient(){
        await this.state.edit_ingredients.push({quantity: "", measurement: "", ingredient: ""});
        this.forceUpdate();
        this.canPost();
    }


    async changeIngredientQuantity(event, index){
        let fakeIngredients = this.state.edit_ingredients;
        fakeIngredients[index].quantity = event.target.value;
        await this.setState({edit_ingredients: fakeIngredients});
    }

    async changeIngredientMeasurement(event, index){
        let fakeIngredients = this.state.edit_ingredients;
        fakeIngredients[index].measurement = event.target.value;
        await this.setState({edit_ingredients: fakeIngredients});
    }

    async changeIngredient(event, index){
        let fakeIngredients = this.state.edit_ingredients;
        fakeIngredients[index].ingredient = event.target.value;
        await this.setState({edit_ingredients: fakeIngredients});
        this.canPost();
    }

    async removeIngredient(event){
        this.state.edit_ingredients.splice(parseInt(event.target.className), 1);
        this.canPost();
        this.forceUpdate();
    }
    handleClose(){
        this.setState({editing: false})

    }
    canPost(){
        let blankIngr = {ingredient: "", quantity: "", measurement: ""};
        let disabled;
        disabled = !(this.state.edit_ingredients.every(val => val.ingredient !== "") &&
            this.state.edit_ingredients.length >= 1 &&
            this.state.edit_drinkName !== "" &&
            this.state.edit_drinkName !== " ");
        
        this.setState({
            postDisabled: disabled
        })
    }
    async editDrink(){
        let photoString = "";
        if(this.state.selected){
            photoString = await base64.encode(this.state.fileString);
        }
        let tester = {
            id: this.state.drink.id,
            publisher: this.state.drink.publisher,
            name: this.state.edit_drinkName,
            description: this.state.edit_description,
            ingredients: this.state.edit_ingredients,
            photo: photoString
        }
        await fetch(config.url.API_URL + '/drink/editDrink', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tester)
        }).then(res => res.json()).then((data) => {
            this.setState({editing: false})
            //if (data.status === "ok"){
            //    window.location.replace('/'+this.state.drink.publisher + '/drink/' + this.state.edit_drinkName) 
            //}
            tester.likes = this.state.drink.likes
            tester.likes = this.state.drink.dislikes
            if (tester.photo === ""){
                tester.photo = this.state.drink.photo
            }
            this.setState({drink: tester})
            let url = window.location.href+' ';
            let name_test = tester.publisher.replace(/ /g, '%20');
            let drink_test = tester.name.replace(/ /g, '%20');
            if (url.includes(name_test+'/drink/')){
                if (!url.includes(name_test+'/drink/'+drink_test + ' ')){
                    window.location.replace(drink_test);
                }
            }
            
            
        }).catch(console.log);
    }

    async handleEdit(){
        this.setState({editing: true})


    }
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


    render(){
        let theseProps = this.props;
        let {user, drink, index, ready} = this.state;
        let drinkPic, likes;
        if(ready){
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
                drinkPic = <Image floated="right" size="small" src={`data:image/jpeg;base64,${drink.photo}`}/>
            }else{
                drinkPic = <Image floated="right" size="small" src={process.env.PUBLIC_URL + "/placeholder-drink.png"}/>
            }

            let shareURL =  "fiveo-clocksomewhere.web.app/" + drink.publisher + "/drink/" + drink.name;
            shareURL = encodeURIComponent(shareURL);

            return(
                <div>
                    <Modal open={this.state.editing} closeOnDimmerClick={true} size="large">
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
                                        content={this.state.edit_drinkName}
                                        onChange={this.handleNameChange}
                                        required={true}
                                        value={this.state.edit_drinkName}
                                        id="edit_drinkName"
                                    />
                                    <Form.Input
                                        placeholder='Description'
                                        content={this.state.edit_description}
                                        value={this.state.edit_description}
                                        onChange={this.handleDescriptionChange}
                                    />
                                    <Button icon="plus" content={"Add Ingredients"} onClick={this.createIngredient}/>
                                    <br/>
                                    <br/>
                                    {this.state.edit_ingredients.map((ing, index) => {
                                        return (
                                            <FormGroup inline>
                                                <Form.Input
                                                    className={index.toString()}
                                                    label={"Amount"}
                                                    labelPosition="top"
                                                    width={3}
                                                    placeholder="1"
                                                    content={this.state.edit_ingredients[index].quantity}
                                                    onChange={(e) => this.changeIngredientQuantity(e, index)}
                                                    value={this.state.edit_ingredients[index].quantity}
                                                />
                                                <Form.Input
                                                    className={index.toString()}
                                                    label={"Amount"}
                                                    labelPosition="top"
                                                    width={3}
                                                    placeholder="ex. oz"
                                                    content={this.state.edit_ingredients[index].measurement}
                                                    onChange={(e) => this.changeIngredientMeasurement(e, index)}
                                                    value={this.state.edit_ingredients[index].measurement}
                                                />
                                                <Form.Input
                                                    className={index.toString()}
                                                    label={"Ingredient"}
                                                    labelPosition="top"
                                                    width={6}
                                                    placeholder="Ex. Smirnoff Vodka"
                                                    content={this.state.edit_ingredients[index].ingredient}
                                                    onChange={(e) => this.changeIngredient(e, index)}
                                                    value={this.state.edit_ingredients[index].ingredient}
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
                                        <Button color='yellow' disabled={this.state.postDisabled} onClick={() => this.editDrink()}>
                                            Post!
                                        </Button>
                                    </div>
                                </Form>

                            </Segment>
                        </Form>
                    </Modal>
                    <Modal open={this.state.shareModal} onClose={this.closeShare} closeOnEscape={false} size="mini" centered closeIcon>
                        <Header textAlign="left">Share Via:</Header>
                        {/*Todo: Actually plug in a legit URL and all the other paramters*/}
                        <Segment basic textAlign="center">
                            <FacebookShareButton quote="Check out this drink I found!" hashtag="#DWF" url={shareURL}>
                                <FacebookIcon size={32}/>
                            </FacebookShareButton>&nbsp;
                            <TwitterShareButton title={"Drinks With Friends"} url={shareURL}>
                                <TwitterIcon size={32}/>
                            </TwitterShareButton>&nbsp;
                            {/*Todo: Figure out how to set up a noReply email address that can send this shit*/}
                            <EmailShareButton subject="Check out this drink I found!" url={shareURL}>
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
                    <Card centered style={{width: "450px"}}>

                        {/*<Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>*/}
                        <Card.Content>

                            <Card.Header textAlign="left">
                                <Link style={{textDecoration: "none"}} to={(`/${drink.publisher}/drink/${drink.name}`)}>{drink.name}</Link>
                                <Icon link name="share alternate" color="grey" style={{"position": "absolute", "right": "0px"}} onClick={this.openShare}/>
                                {/*Todo: Rod - Put your flag in the 'hidden' value and your method to open the modal in the onClick here */}
                                
                                {this.state.editable && <Icon link name="edit" color="grey" style={{"position": "absolute", "right": "25px"}} onClick={this.handleEdit}/>}


                            </Card.Header>

                            <Card.Meta className="pub" textAlign="left"> <Link style={{textDecoration: "none"}} to={(`/${drink.publisher}`)}>{drink.publisher}</Link></Card.Meta>
                        </Card.Content>
                        <Card.Content textAlign="left">
                            {drinkPic}
                            <div>
                                <p><strong>Description: </strong></p>
                                <Card.Description >{drink.description}</Card.Description>

                            </div>

                            <div>
                                <br/>
                                <p><strong>Ingredients: </strong></p>
                                <Card.Content>
                                    <List bulleted >
                                        {drink.ingredients.map((ingr, idx) => {
                                            return (
                                                <p key={idx} >
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
                </div>

            );
        }else{
            return(
                <Loader active inline='centered' />
            )
        }
    }

}

// export const drinkCard = (index, name, description, photo, ingredients, publisher, likes, ) => {
//
//     )
// };