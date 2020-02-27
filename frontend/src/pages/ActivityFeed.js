import React from "react";
import {
    Feed,
    Card,
    Grid,
    Header,
    Image,
    Input,
    Rating,
    Segment,
    TextArea,
    Menu,
    MenuItem,
    Button,
    Form,
    Icon,
    List,
    Item,
    Label,
    Modal
} from "semantic-ui-react";
import {Link} from "react-router-dom";


export default class ActivityFeed extends React.Component {
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.state = {
            user: "",
            modalOpen: false,

        }
    }

    handleClose() {
        this.setState({modalOpen: false})
    }

    handleOpen() {
        this.setState({modalOpen: true})
    }



    render(){
        return(
            <div>
                <Modal open={this.state.modalOpen}
                           onClose={this.handleClose}>
                    fug
                </Modal>
                <Grid style={{ height: '100vh' }} columns={16} centered>
                    <Grid.Column width={4}/>
                    <Grid.Column width={8}>
                        <Button icon="beer" color="yellow" onClick={this.handleOpen}>
                            Create a Drink!
                        </Button>
                    </Grid.Column>
                    <Grid.Column width={4}/>
                </Grid>
                <Feed>
                    Bottom Text
                </Feed>
            </div>
        )
    }
}