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
            response: undefined,
            loaded: false
        }
    }

    async componentDidMount() {
        await this.getDOTD();
        this.setState({
            loaded: true
        })
    }

    async getDOTD(){
        await fetch('http://localhost:8080/drink/dotd', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //     username: this.state.username,
            //     password: this.state.password,
            //     confirm_password: this.state.conf_pass,
            // })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            this.setState({response: data})
        }).catch(console.log);
    }

    async handleInputChange(event){
        const value = event.target.value;
        await this.setState({searchText: value});
    };

    render(){

        if (this.state.loaded){
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

                                <Input
                                    action={{
                                        color: 'yellow',
                                        labelPosition: 'right',
                                        icon: 'search',
                                        content: 'Search',
                                    }}
                                    actionPosition='right'
                                    actionPositisize="huge" fluid placeholder='Search...' onChange={this.handleInputChange}
                                />

                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}/>
                    </Grid>
                    {/*Todo: Put a second grid below for rendering search results*/}
                    <Grid></Grid>
                </div>
            )
        }else{
            return(
                <div/>
            )
        }
    }
}