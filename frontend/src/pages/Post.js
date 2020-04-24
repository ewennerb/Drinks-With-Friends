import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import {
    Image,
    Rating,
    Input,
    Button,
    Card,
    Segment,
    Header,
    Grid,
    List,
    GridColumn,
    GridRow,
    Form,
    Loader, Icon, CardContent
} from "semantic-ui-react";
import {Link, Router} from 'react-router-dom';
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import "../css/Drink.css"
import {config} from '../config/config'
import {PostCard} from "./PostCard";




class Post extends Component{
    constructor(props){
        super(props);
        this.getPost = this.getPost.bind(this);
        console.log(this.props.match.params);
        this.state = {
            user: this.props.match.user,
            post: undefined,
            response: undefined,
            loaded: false,
            loggedIn: false,
            done: false,
        }
    }


    async componentDidMount() {
        let x = await this.getPost();
        await this.setState({
            loaded: false,
            user: this.props.match.user,
            post: x,
            done: true,
            results: [],
            searchable: false
        })
    }


    async getPost(){
        let post = undefined;
        console.log(this.props.match.params.postId);
        await fetch(config.url.API_URL + '/post/getPost/'+ this.props.match.params.postId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(async (data) => {
            if (data.length === 0) {
                post = 404;
            } else {
                await fetch(config.url.API_URL + "/user/" + this.props.match.params.publisher, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(res => res.json()).then(async (data2) => {
                    console.log(data2);
                    data[0].profileImage = data2.photo;
                    data[0].name = data2.name;
                    data[0].userName = this.props.match.params.publisher;
                    post = data;
                }).catch(err => {
                    console.log(err)
                });

            }
        }).catch(err => {
            console.log(err)
        });


        return post;
    }


    render(){
        let pfp;
        let post = this.state.post;
        if(this.state.post === 404){
            return(
                <Segment basic placeholder style={{height: "100vh"}}>
                    <Header>Whoops! This post wasnt found</Header>
                </Segment>
            )
        }else{
            if(this.state.done !== true){
                return (<div/>);
            }else{

                return(
                    <PostCard post={this.state.post[0]}/>
                )
            }
        }


    }
}

export default Post