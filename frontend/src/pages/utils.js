import {
    Card,
    Header,
    List,
    Rating,
    Segment,
    Image,
    Button,
    CardContent,
    Grid,
    GridRow,
    Form,
    Icon
} from "semantic-ui-react";
import React, {Component, useContext} from "react";
import {NavLink, Link} from "react-router-dom";
import {config} from '../config/config'



export const userCard = (index, username, photo, loggedInUsername) => {
    let pfp;
    if (photo === null || photo === ""){
        pfp = <Image floated="right" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"} data-testid={"user-placeholder-img-" + index.toString()}/>
        }else{
        pfp = <Image floated="right" size="tiny" src={`data:image/jpeg;base64,${photo}`} data-testid={"user-b64-img-" + index.toString()}/>
        }
    //Todo: Add photo functionality
    console.log("Index: " + index.toString());

    let newPath;
    newPath = "/" + username;

    return(
        
        <Card centered data-testid={"user-card-" + index.toString()}>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <CardContent textAlign="center" style={{marginTop: "0px",marginRight: "10px", float: "left"}}>
        {pfp}
                    </CardContent>
                <Card.Content>
                   
                <Card.Header data-testid={"user-name-" + index.toString()}>@{username}</Card.Header>
                   
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='grey' onClick={() => {window.location.href = newPath}}>
                            <Link style={{textDecoration: "none", color: "grey"}} to={newPath}>
                                <p style={{marginTop: "0px",marginRight: "10px", float: "left"}} data-testid={"post-name-0"}>
                                    View Profile
                            </p>
                            </Link>
                        </Button>
                        <Button basic color='blue' onClick={() =>
                            fetch(config.url.API_URL + '/user/follow/' + username, {
            method: 'POST',
            headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
        },
            body: JSON.stringify({
            userName: loggedInUsername,
            phoneNumber: "",
            password: "",
            name: "",
            email: "",
            photo: "",
            bio: "",
            likedDrinks: "",
            dislikedDrinks: "",
            favoritedDrink: "",
            publishedDrinks: "",
            postHistory: "",
            friendsList: "",
            dateCreated: "",
            lastLogin: "",
            response: undefined,
            darkMode: 0
        })
        }).then(res => res.json()).then((data) => {
                                console.log(data);
                                window.location.replace('/');

        }).catch(console.log)
        }>
                        Follow
                        </Button>
                    </div>
                </Card.Content>
            </Segment>
        </Card>
    )
        };



export const userCardFollowed = (index, username, photo, loggedInUsername) => {
    let pfp;
    if (photo === null || photo === ""){
        pfp = <Image floated="right" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"} data-testid={"user-placeholder-img-" + index.toString()}/>
        }else{
        pfp = <Image floated="right" size="tiny" src={`data:image/jpeg;base64,${photo}`} data-testid={"user-b64-img-" + index.toString()}/>
        }
        //Todo: Add photo functionality
    let newPath;
    newPath = "/" + username;
    return(
        <Card centered data-testid={"user-card-" + index.toString()}>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <CardContent textAlign="center" style={{marginTop: "0px",marginRight: "10px", float: "left"}}>
        {pfp}
                    </CardContent>
                <Card.Content>
                   
                <Card.Header data-testid={"user-name-" + index.toString()}>@{username}</Card.Header>
                   
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='grey' onClick={() => {window.location.href=newPath}}>
                           
                            <Link style={{textDecoration: "none", color: "grey"}} to={newPath}>
                                <p style={{marginTop: "0px",marginRight: "10px", float: "left"}} data-testid={"post-name-0"}>
                                    View Profile
                            </p>
                            </Link>
                        </Button>
                        <Button basic color='red' onClick={() =>
                            fetch(config.url.API_URL + '/user/unfollow/' + username, { //NEED TO SEND THE RIGHT CALL
        method: 'POST',
        headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        userName: loggedInUsername,
        phoneNumber: "",
        password: "",
        name: "",
        email: "",
        photo: "",
        bio: "",
        likedDrinks: "",
        dislikedDrinks: "",
        favoritedDrink: "",
        publishedDrinks: "",
        postHistory: "",
        friendsList: "",
        dateCreated: "",
        lastLogin: "",
        response: undefined,
        darkMode: 0
        })
        }).then(res => res.json()).then((data) => {
                                console.log(data);
                                window.location.replace('/');

        }).catch(console.log)
        }>
                        Unfollow
                        </Button>
                    </div>
                </Card.Content>
            </Segment>
        </Card>
    )
        };













export const dotdCard = (dotd) => {
    return(
        <Card style={{width: "500px"}} centered data-testid="dotd-card">
            <Card.Header style={{textAlign: "center"}}>Today's Drink of the Day</Card.Header>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Header textAlign="center" style={{marginTop: "0px"}}>  
        {/* changed class to className cause compiler yelled */}
                    <NavLink className="drinklink" to={(`/${dotd.publisher}/drink/${dotd.name}`)} data-testid="dotd-name">
        {dotd.name}
                    </NavLink>
                </Header>
                <Card.Description content={dotd.description} data-testid="dotd-description"/>
                <br/>
                <Card.Content>
                    <List bulleted>
        {dotd.ingredients.map((ingr, index) => {
        // each child in a list should hav a unique key prop
                            return (
                                <List.Item key={index} data-testid={"dotd-ingredient-" + index.toString()}>
        {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                </List.Item>
                            )
                    })}
                    </List>
                </Card.Content>
                <Card.Meta data-testid="dotd-publisher">{dotd.publisher}</Card.Meta>
                <Card.Content extra>
                    <Rating icon='star' defaultRating={5} maxRating={5}/>
                </Card.Content>
            </Segment>
        </Card>
    )
                    };
export const minimalDrinkCard = (drink) => {
    return(
        <Card style={{width: "500px"}} centered>
            
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Header textAlign="center" style={{marginTop: "0px"}}>  
                    {/* changed class to className cause compiler yelled */}
                    <NavLink className="drinklink" to={(`/${drink.publisher}/drink/${drink.name}`)}>
        {drink.name}
                    </NavLink>
                </Header>
                <Card.Meta textAlign="center">{drink.publisher}</Card.Meta>
            </Segment>
        </Card>
    )
                    };



export const ingredientCard = (index, ingrName) => {
    return(
        <Card centered>
            <Card.Header>
                    {ingrName}
            </Card.Header>
        </Card>
    )

                    };


export const postCardDelete = (post) => {
    let pfp;
    if (post.profileImage === null || post.profileImage === ""){
        pfp = <Image floated="right" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"} data-testid={"post-user-placeholder-img-0"}/>
                    }else{
        pfp = <Image floated="right" size="tiny" src={`data:image/png;base64,${post.profileImage}`} data-testid={"post-user-b64-img-0"}/>
        }
    let text_image;
    if (post.image === null || post.image === ""){ 

        text_image = <div  data-testid={"user-div-img-0"}/>

        }else{
        text_image = <Image size="tiny" src={`data:image/png;base64,${post.image}`}  data-testid={"post-b64-img-0"}/>

        }

    return(
        <Card style={{width: "500px"}} centered data-testid={"post-card-0"}>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Link to={(`${post.userName}`)}>
                    <CardContent textAlign="center" style={{marginTop: "0px",marginRight: "10px", float: "left"}}>
        {pfp}
                    </CardContent>
                </Link>
                <Grid columns={1}>
                    <GridRow style={{paddingBottom: "0px"}}>
                        <Link style={{textDecoration: "none"}} to={(`${post.userName}`)}>
                            <p style={{marginTop: "0px",marginRight: "10px", float: "left", fontSize: "larger", fontWeight: "bolder"}} data-testid={"post-username-0"}>
                                @{post.userName}
                            </p>
                        </Link>
                    </GridRow>

                </Grid>

            </Segment>
            <CardContent data-testid={"post-text-0"}>{post.text}</CardContent>
            <CardContent>{text_image}</CardContent>
        </Card>
    )

                        };


class postCardEditandDelete extends Component{
    constructor(props){
        super(props);
        this.state = {
        post: this.props.post,
                        }

                        }

    componentDidMount(){
        //Todo: Get the geotag here and then add it to the
                        }
    

    render() {
        let pfp;
        let post = this.state.post;
        if (post.profileImage === null || post.profileImage === ""){
            pfp = <Image floated="right" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"} data-testid={"post-user-placeholder-img-0"}/>
                        }else{
            pfp = <Image floated="right" size="tiny" src={`data:image/png;base64,${post.profileImage}`} data-testid={"post-user-b64-img-0"}/>
            }
        let text_image;
        if (post.image === null || post.image === ""){ 
    
            text_image = <div  data-testid={"user-div-img-0"}/>
    
            }else{
            text_image = <Image size="tiny" src={`data:image/png;base64,${post.image}`}  data-testid={"post-b64-img-0"}/>
            }

        console.log(post.name);
        console.log(post.username);

    return(
        <Card style={{width: "500px"}} centered data-testid={"post-card-0"}>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Link to={(`/${post.userName}`)} replace>
                    <CardContent textAlign="center" style={{marginTop: "0px",marginRight: "10px", float: "left"}}>
        {pfp}
                    </CardContent>
                </Link>
                <Grid columns={1}>
                    <GridRow style={{paddingBottom: "0px"}}>
        {/* <Link style={{textDecoration: "none", color: "black"}} /> /
                        to={(`${post.userName}`)}> */}
                            <p style={{marginTop: "0px",marginRight: "10px", float: "left", fontSize: "larger", fontWeight: "bolder"}} data-testid={"post-username-0"}>
                                @{post.userName}
                            </p>
        {/* </Link> */}
                    </GridRow>
                    <GridRow  style={{paddingTop: "0px"}}>
                        <Button color='grey' onClick={(ev) => {                                
        //button
                        let input = document.getElementById("postInput");
                        console.log(ev)
                        input.focus();

                        }}
                        >
                            Edit
                        </Button>
                        
                        <Button color='red' onClick={() =>
                            fetch(config.url.API_URL + '/post/delete', {
        method: 'POST',
        headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                        },
        body: JSON.stringify({
        text: "",
        image: "",
        userName: post.userName,
        geolocation: "",
        date: "",
        postId: post.postId
                        })
                        }).then(res => res.json()).then((data) => {
                                console.log(data);
                                window.location.replace('/feed');
                        }).catch(console.log)
                        }>
                            Delete
                        </Button>
                        {/* <Link style={{textDecoration: "none", color: "grey"}} to={(`${post.userName}`)}> */}
                            <p style={{marginTop: "0px",marginRight: "10px", float: "left"}} data-testid={"post-name-0"}>
    {/* {post.name} */}
                                <Form.Input
                                    fluid value={post.text}
                                    id="postInput" 
                                />
                            </p>
    {/* </Link> */}
                    </GridRow>
                </Grid>

            </Segment>
            <CardContent id='text-wrap' data-testid={"post-text-0"}>
    {post.text}
            </CardContent>
            <CardContent>{text_image}</CardContent>
        </Card>
    );
    }   
    }
export default postCardEditandDelete;

