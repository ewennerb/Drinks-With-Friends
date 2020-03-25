import {Card, Header, List, Rating, Segment, Image, Button} from "semantic-ui-react";
import React from "react";
import {NavLink} from "react-router-dom";

export const drinkCard = (name, description, photo, ingredients, publisher) => {
    let drinkPic;
    if(photo !== ""){
        drinkPic = <Image floated="right" size="small" src={`data:image/jpeg;base64,${photo}`} />
    }else{
        drinkPic = <Image floated="right" size="small" src={process.env.PUBLIC_URL + "/placeholder-drink.png"}/>
    }

    return(
        <Card centered style={{width: "450px"}}>
            {/*<Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>*/}
                <Card.Content>
                    <Card.Header textAlign="left">{name}</Card.Header>
                    <Card.Meta textAlign="left">{publisher}</Card.Meta>
                </Card.Content>
                <Card.Content textAlign="left">
                    {drinkPic}
                    <div>
                        <p><strong>Description: </strong></p>
                        <Card.Description>{description}</Card.Description>

                    </div>

                    <div>
                        <br/>
                        <p><strong>Ingredients: </strong></p>
                        <Card.Content>
                            <List bulleted>
                                {ingredients.map(ingr => {
                                    return (
                                        <p>
                                            {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                        </p>
                                    )
                                })}
                            </List>
                        </Card.Content>
                    </div>
                </Card.Content>

                <Card.Content extra>
                    <Rating icon='star' defaultRating={5} maxRating={5}/>
                </Card.Content>
        </Card>
    )
};


export const userCard = (username, photo) => {
    let pfp;
    if (photo === null){
        pfp = <Image floated="right" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"}/>
    }else{
        pfp = <Image floated="right" size="tiny" src={photo}/>
    }
    //Todo: Add photo functionality
    return(
        <Card centered>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Card.Content>
                    {pfp}
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta>*Add Date Joined*</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='grey'>
                            View Profile
                        </Button>
                        <Button basic color='blue'>
                            Follow
                        </Button>
                    </div>
                </Card.Content>
            </Segment>
        </Card>
    )
};


export const dotdCard = (dotd) => {
    return(
        <Card style={{width: "500px"}} centered>
            <Card.Header>Today's Drink of the Day</Card.Header>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Header textAlign="center" style={{marginTop: "0px"}}>
                    <NavLink class="drinklink" to={(`/profile/${dotd.publisher}/drink/${dotd.name}`)}>
                        {dotd.name}
                    </NavLink>
                </Header>
                <Card.Description content={dotd.description}/>
                <br/>
                <Card.Content>
                    <List bulleted>
                        {dotd.ingredients.map(ingr => {
                            return (
                                <List.Item>
                                    {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                </List.Item>
                            )
                        })}
                    </List>
                </Card.Content>
                <Card.Meta>{dotd.publisher}</Card.Meta>
                <Card.Content extra>
                    <Rating icon='star' defaultRating={5} maxRating={5}/>
                </Card.Content>
            </Segment>
        </Card>
    )
};