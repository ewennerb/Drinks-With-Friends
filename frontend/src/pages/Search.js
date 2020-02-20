import React from "react";
import 'semantic-ui-css/semantic.min.css';
import {Card, Input, Button, Message, Icon, Image, Segment, Header, FormInput, Label} from 'semantic-ui-react'


export default class Search extends React.Component{

    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            searchText: "",
        }
    }

    async handleInputChange(event){
        const value = event.target.value;
        await this.setState({searchText: value});
    };

    render(){
        return(
            <div>
                <Segment basic placeholder attached="bottom" style={{width: "100%", height: "90vh"}} textAlign="center">
                    <Card style={{width: "350px"}} centered>
                        <Card.Header>Today's Drink of the Day</Card.Header>
                        <Segment basic textAlign="left" attached="bottom" style={{width: "350px"}}>
                            <Image
                                floated='left'
                                size='small'
                                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            />
                            <Header textAlign="center" style={{marginTop: "0px"}}>
                                Nothing!
                            </Header>
                            <Card.Content header="Today's Drink of the Day: NOTHING!"/>

                            <Card.Meta>New User</Card.Meta>

                            <Card.Content extra>
                                <Icon name='user' />4 Friends
                            </Card.Content>
                        </Segment>
                    </Card>
                    <FormInput
                        icon="search"
                        iconPosition="left"
                        style={{width: "700px"}}
                    >

                    </FormInput>

                    {/*<Segment>*/}
                    {/*    <Label ribbon color="blue" size="massive">Support</Label>*/}

                    {/*        <Button style={{textAlign: "center"}}>contact us</Button>*/}
                    {/*    </Segment>*/}
                    {/*</Segment>*/}
                </Segment>
            </div>
        )
    }
}