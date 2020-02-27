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
    Modal,
    FormGroup
} from "semantic-ui-react";
import {Link} from "react-router-dom";


export default class ActivityFeed extends React.Component {
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.changeIngredientName = this.changeIngredientName.bind(this);
        this.createIngredient = this.createIngredient.bind(this);
        this.changeIngredientSize = this.changeIngredientSize.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.state = {
            user: "",
            modalOpen: false,
            ingredients: [],
        }
    }

    componentDidMount(){
        this.setState({
            modalOpen: false,
            ingredients: []
        })
    }

    handleClose() {
        this.setState({modalOpen: false})
    }

    handleOpen() {
        this.setState({modalOpen: true})
    }


    createIngredient(){
        let oldIngr = this.state.ingredients;
        oldIngr.push(
            {
                amount: "",
                name: ""
            }
        );

        this.setState({
            ingredients: oldIngr
        })
    }

    changeIngredientName(event, i){
        this.state.ingredients[i].name = event.target.value;
        console.log("Name changed")
    }

    changeIngredientSize(event, i){
        this.state.ingredients[i].amount = event.target.value;
        console.log("Size Changed")
    }

    async removeIngredient(event, i){

        console.log(i);
        // if (this.state.ingredients.length === 1){
        //     this.setState({
        //         ingredients: []
        //     })
        // }else{
        console.log(this.state.ingredients);
        const updatedIngr = this.state.ingredients.splice(i, 1);
        console.log(updatedIngr);
        await this.setState({
            ingredients: updatedIngr
        })
        // }
    }



    render(){
        return(
            <div>
                <Modal open={this.state.modalOpen} onClose={this.handleClose}>
                    <Form size='large'>
                        <Segment stacked>
                            <Form>
                                <Form.Input placeholder='Drink Name' onChange={this.handleNameChange}/>
                                <Button icon="plus" content={"Add Ingredients"} onClick={this.createIngredient}/>

                                {this.state.ingredients.map((ing, index) => {
                                    return (
                                        <FormGroup inline>
                                            <Form.Input
                                                label={"Amount"}
                                                labelPosition="top"
                                                width={3}
                                                placeholder="Ex. 12 oz."
                                                content={this.state.ingredients[index].amount}
                                                onChange={(e) => this.changeIngredientSize(e, index)}
                                            />
                                            <Form.Input
                                                label={"Ingredient"}
                                                labelPosition="top"
                                                width={6}
                                                placeholder="Ex. Smirnoff Vodka"
                                                content={this.state.ingredients[index].name}
                                                onChange={(e) => this.changeIngredientName(e, index)}
                                            />
                                            <Button icon="minus" onClick={(e) => this.removeIngredient(e, index)}/>
                                        </FormGroup>
                                    )
                                })}
                                <Button onClick={() => this.sendEmail()} color='yellow' fluid size='large' >
                                    Post!
                                </Button>
                            </Form>

                        </Segment>
                    </Form>
                </Modal>
                <Grid style={{ height: '100vh' }} columns={16} centered>
                    <Grid.Column width={4}/>
                    <Grid.Column width={8}>
                        <Button icon="beer" color="yellow" onClick={this.handleOpen}>
                            Create a Drink! - Still a WIP
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