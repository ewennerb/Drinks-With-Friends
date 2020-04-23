import React from "react";
import {Button, Card, CardContent, Grid, GridRow, Header, Icon, Image, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {config} from "../config/config";

export class PostCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            post: this.props.post,
            geoTag: undefined
        }
    }

    async componentDidMount(){
        console.log(this.props.post);
        this.setState({
            post: this.props.post
        });
    }

    render(){
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

        let postLocation;

        console.log(post);
        console.log("Hey retard! " + post.geolocation.toString());
        if(post.geolocation !== " " && post.geolocation !== ""){
            let locString = post.geolocation.split(" - ");
            console.log(post.geolocation);
            console.log(locString);
            postLocation = <div>
                <Header as="h4" color="grey" floated="left">
                    <Icon name='map marker alternate' color="grey"/>
                    <Header.Content>
                        {locString[0]}
                        <Header.Subheader>
                            {locString[1]}
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            </div>
        }else{
            postLocation = <div/>
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
                        <GridRow  style={{paddingTop: "0px"}}>
                            <Link style={{textDecoration: "none", color: "grey"}} to={(`${post.userName}`)}>
                                <p style={{marginTop: "0px",marginRight: "10px", float: "left"}} data-testid={"post-name-0"}>
                                    {post.name}
                                </p>
                            </Link>
                        </GridRow>
                        <GridRow>
                            {postLocation}
                        </GridRow>
                    </Grid>

                </Segment>

                {/*This figures out if the user is logged in or not and renders a delete/edit button for you if that's the case. Otherwise it does nothing*/}
                {this.state.user === post.userName
                    ? <GridRow style={{paddingTop: "0px"}}>

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
                                    userId: 0,
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
                        <Link style={{textDecoration: "none", color: "grey"}} to={(`${post.userName}`)}>
                            <p style={{marginTop: "0px", marginRight: "10px", float: "left"}}
                               data-testid={"post-name-0"}>
                                {post.name}
                            </p>
                        </Link>
                    </GridRow>
                    : <div/>
                }
                <CardContent data-testid={"post-text-0"}>{post.text}</CardContent>
                <CardContent>{text_image}</CardContent>
            </Card>
        )
    }
};