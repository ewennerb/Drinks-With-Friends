import React from "react";
import {Card, Image, List, Rating, Loader, FeedLike, Icon, Button, Menu} from "semantic-ui-react";


export default class DrinkCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // user: this.props.user,
            user: undefined,
            index: this.props.index,
            drink: this.props.drink,
            ready: false,
            isLiked: false,
            isDisliked: false
        };
        this.likeDislikeRequestor = this.likeDislikeRequestor.bind(this);
        this.handleLikeDislike = this.handleLikeDislike.bind(this);
    }


    async componentDidMount(){
        await fetch("http://localhost:8080/user/" + this.props.user, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            console.log(data);
            let user;
            let liked = false;
            let disliked = false;
            if (data.userName === null){
                user = undefined
            }else{
                user = data;
                // if (user.likedDrinks.some(item => this.props.drink.id === item)) {
                //     liked = true
                // }
                //
                // if (user.dislikedDrinks.some(item => this.props.drink.id === item)) {
                //     liked = true
                // }
            }
            // await this.setState({dotd: data})
            await this.setState({
                user: user,
                index: this.props.index,
                drink: this.props.drink,
                ready: true,
                isLiked: liked,
                isDisliked: disliked
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
            console.log(data);
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
                    this.likeDislikeRequestor(body, "http://localhost:8080/user/likeDrink/" + this.state.drink.id + "/flip", option);
                }else{
                    //Do normal like
                    this.likeDislikeRequestor(body, "http://localhost:8080/user/likeDrink/" + this.state.drink.id + "/on", option);
                }

                this.setState({isLiked: true, isDisliked: false})
            } else {
                this.likeDislikeRequestor(body, "http://localhost:8080/user/likeDrink/" + this.state.drink.id + "/off", option);
                this.setState({isLiked: false, isDisliked: false})
            }
        }else{
            if(!this.state.isDisliked) {
                //If liked and dislike gets hit, flip
                if (this.state.isLiked){
                    this.likeDislikeRequestor(body, "http://localhost:8080/user/dislikeDrink/" + this.state.drink.id + "/flip", option);
                }else{
                    //Do normal like
                    this.likeDislikeRequestor(body, "http://localhost:8080/user/dislikeDrink/" + this.state.drink.id + "/true" , option);
                }
                this.setState({isLiked: false, isDisliked: true})
            }else{
                //Undo DisLike
                this.likeDislikeRequestor(body, "http://localhost:8080/user/dislikeDrink/" + this.state.drink.id + "/false", option);
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


    render(){
        console.log(this.state.user);
        let {user, drink, index, ready} = this.state;
        let drinkPic, likes;
        if(ready){
            if (user !== undefined) {

                let lColor = this.likeColor();
                let dColor = this.dislikeColor();

                likes = <div>

                    <FeedLike>
                        <Icon name="caret up" size="large" onClick={() => this.handleLikeDislike("like")} color={lColor}/>
                    </FeedLike>
                    {drink.likes} Likes&nbsp;
                    <FeedLike>
                        <Icon name="caret down" size="large" onClick={() => this.handleLikeDislike("dislike")} color={dColor}/>
                    </FeedLike>

                </div>;
            }else{
                likes = <div>{drink.likes} Likes</div>
            }

            //Figures out if the drink comes with an image or not
            if(drink.photo !== ""){
                drinkPic = <Image floated="right" size="small" src={`data:image/jpeg;base64,${drink.photo}`} data-testid={"drink-b64-img-" + index.toString()}/>
            }else{
                drinkPic = <Image floated="right" size="small" src={process.env.PUBLIC_URL + "/placeholder-drink.png"} data-testid={"drink-placeholder-img-" + index.toString()}/>
            }

            return(
                <Card centered style={{width: "450px"}} data-testid={"drink-card-" + index.toString()}>
                    {/*<Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>*/}
                    <Card.Content>
                        <Card.Header textAlign="left" data-testid={"drink-name-" + index.toString()}>{drink.name}</Card.Header>
                        <Card.Meta textAlign="left" data-testid={"drink-publisher-" + index.toString()}>{drink.publisher}</Card.Meta>
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
                                <List bulleted>
                                    {drink.ingredients.map((ingr, idx) => {
                                        return (
                                            <p data-testid={"drink-"+ index.toString() + "-ingredient-" + idx.toString()}>
                                                {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                            </p>
                                        )
                                    })}
                                </List>
                            </Card.Content>
                        </div>
                    </Card.Content>

                    <Card.Content extra>
                        {likes}
                    </Card.Content>
                </Card>
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