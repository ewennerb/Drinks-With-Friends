import React from "react";
import 'semantic-ui-css/semantic.min.css';
import {
    Card,
    Input,
    Icon,
    Image,
    Segment,
    Header,
    Grid,
} from 'semantic-ui-react'


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
                <Grid style={{ height: '100vh' }} columns={16} centered>
                    <Grid.Column width={4}/>
                    <Grid.Column width={8} textAlign="center">
                        <br/>
                        <br/>
                        <Card style={{width: "500px"}} centered>
                            <Card.Header>Today's Drink of the Day</Card.Header>
                            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
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
                        <br/>
                        <br/>
                        <Grid.Row centered>
                            {/*Todo: Put a button and maybe some options here*/}
                            <Input size="huge" fluid icon='search' placeholder='Search...' onChnage={this.handleInputChange}/>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={4}/>
                </Grid>

                {/*Todo: Put a second grid below for rendering search results*/}
                <Grid></Grid>
            </div>

        )
    }
}