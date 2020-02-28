import React from "react";
import {
    Feed,
    Grid,
    Segment,
    Button,
    Form,
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
            drinkName: "",
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
        this.state.ingredients.push({amount: "", name: ""});
        this.forceUpdate()
        // let oldIngr = this.state.ingredients;
        // oldIngr.push(
        //     {
        //         amount: "",
        //         name: ""
        //     }
        // );
        // this.setState({
        //     ingredients: oldIngr
        // })
    }


    changeIngredientSize(event){
        this.state.ingredients[parseInt(event.target.className)].amount = event.target.value;
    }

    changeIngredientName(event){
        this.state.ingredients[parseInt(event.target.className)].name = event.target.value;
    }

    async removeIngredient(event){
        this.state.ingredients.splice(parseInt(event.target.className), 1);
        this.forceUpdate();
    }



    render(){
        return(
            <div>
                <Modal open={this.state.modalOpen} onClose={this.handleClose}>
                    <Form size='large'>
                        <Segment stacked>
                            <Form>
                                <Form.Input
                                    placeholder='Drink Name'
                                    content={this.state.drinkName}
                                    onChange={this.handleNameChange}
                                />
                                <Button icon="plus" content={"Add Ingredients"} onClick={this.createIngredient}/>
                                <br/>
                                <br/>
                                {this.state.ingredients.map((ing, index) => {
                                    return (
                                        <FormGroup inline>
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Amount"}
                                                labelPosition="top"
                                                width={3}
                                                placeholder="Ex. 12 oz."
                                                content={this.state.ingredients[index].amount}
                                                onChange={(e) => this.changeIngredientSize(e)}
                                            />
                                            <Form.Input
                                                className={index.toString()}
                                                label={"Ingredient"}
                                                labelPosition="top"
                                                width={6}
                                                placeholder="Ex. Smirnoff Vodka"
                                                content={this.state.ingredients[index].name}
                                                onChange={(e) => this.changeIngredientName(e)}
                                            />
                                            <Button className={index.toString()} icon="minus" onClick={(e) => this.removeIngredient(e)}/>
                                        </FormGroup>
                                    )
                                })}
                                <br/>
                                <Button onClick={() => this.sendEmail()} color='yellow' fluid size='large'>
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
                            Post Something
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