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


        console.log("POSTCARD DEBUG");
        console.log(post.userName);
        console.log(post.profileImage);
        console.log(this.props.user);


        if (post.profileImage === null || post.profileImage === "" || post.profileImage === undefined){
            pfp = <Image floated="left" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"} data-testid={"post-user-placeholder-img-0"}/>
        }else{
            pfp = <Image floated="left" size="tiny" verticalAlign="middle" circular src={`data:image/png;base64,${post.profileImage}`} data-testid={"post-user-b64-img-0"}/>
        }
        let text_image;
        if (post.image === null || post.image === "" || post.image === undefined){

            text_image = <div  data-testid={"user-div-img-0"}/>

        }else{
            text_image = <Image size="large" src={`data:image/png;base64,${post.image}`}  data-testid={"post-b64-img-0"}/>
        }

        let postLocation;

        console.log(post);
        if(post.geolocation !== " " && post.geolocation !== ""){
            let locString;
            try {
                locString = post.geolocation.split(" - ");
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
            }catch(e){
                postLocation = <div/>
            }


        }else{
            postLocation = <div/>
        }

        let x = "/" + post.userName;

        return(
            <Card style={{width: "500px"}} centered data-testid={"post-card-0"}>
                <Card.Content>
                    {this.state.user === post.userName
                        ? <div className='ui two icons right floated inline'>
                            <Icon link color='grey' name='edit' onClick={(ev) => {
                                let input = document.getElementById("postInput");
                                console.log(ev);
                                input.focus();
                            }}/>
                            <Icon link color='grey' name="trash" onClick={() =>
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
                            }/>
                        </div>

                        : <div/>
                    }
                    {text_image}


                    <Header as="h4" textAlign="left" data-testid={"user-name-"} dividing>
                        {pfp}
                        <div className="left aligned">
                            <Header.Content>
                                    <Link to={x}>@{post.userName}</Link>
                                    <div className="meta">
                                        <p style={{fontSize: "75%"}}>({post.name})</p>
                                    </div>
                            </Header.Content>
                            <Header.Subheader>{post.text}</Header.Subheader>
                        </div>

                    </Header>
                    <Card.Meta>
                        {postLocation}
                    </Card.Meta>
                </Card.Content>



                {/*<Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>*/}
                {/*    <Link to={x}>*/}
                {/*        <CardContent textAlign="center" style={{marginTop: "0px",marginRight: "10px", float: "left"}}>*/}
                {/*            {pfp}*/}
                {/*        </CardContent>*/}
                {/*    </Link>*/}
                {/*    <Grid columns={1}>*/}
                {/*        <GridRow style={{paddingBottom: "0px"}}>*/}
                {/*            <Link style={{textDecoration: "none"}} to={x}>*/}
                {/*                <p style={{marginTop: "0px",marginRight: "10px", float: "left", fontSize: "larger", fontWeight: "bolder"}} data-testid={"post-username-0"}>*/}
                {/*                    @{post.userName}*/}
                {/*                </p>*/}
                {/*            </Link>*/}
                {/*        </GridRow>*/}
                {/*        <GridRow  style={{paddingTop: "0px"}}>*/}
                {/*            <Link style={{textDecoration: "none", color: "grey"}} to={x}>*/}
                {/*                <p style={{marginTop: "0px",marginRight: "10px", float: "left"}} data-testid={"post-name-0"}>*/}
                {/*                    {post.name}*/}
                {/*                </p>*/}
                {/*            </Link>*/}
                {/*        </GridRow>*/}
                {/*        <GridRow>*/}
                {/*            {postLocation}*/}
                {/*        </GridRow>*/}
                {/*    </Grid>*/}

                {/*</Segment>*/}

                {/*This figures out if the user is logged in or not and renders a delete/edit button for you if that's the case. Otherwise it does nothing*/}

            </Card>
        )
    }
};