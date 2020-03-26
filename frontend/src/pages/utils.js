import {Card, Header, List, Rating, Segment, Image, Button} from "semantic-ui-react";
import React from "react";
import {NavLink} from "react-router-dom";

export const drinkCard = (index, name, description, photo, ingredients, publisher) => {
    let drinkPic;
    if(photo !== ""){
        drinkPic = <Image floated="right" size="small" src={`data:image/jpeg;base64,${photo}`} data-testid={"drink-b64-img-" + index.toString()}/>
    }else{
        drinkPic = <Image floated="right" size="small" src={process.env.PUBLIC_URL + "/placeholder-drink.png"} data-testid={"drink-placeholder-img-" + index.toString()}/>
    }

    return(
        <Card centered style={{width: "450px"}} data-testid={"drink-card-" + index.toString()}>
            {/*<Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>*/}
                <Card.Content>
                    <Card.Header textAlign="left" data-testid={"drink-name-" + index.toString()}>{name}</Card.Header>
                    <Card.Meta textAlign="left" data-testid={"drink-publisher-" + index.toString()}>{publisher}</Card.Meta>
                </Card.Content>
                <Card.Content textAlign="left">
                    {drinkPic}
                    <div>
                        <p><strong>Description: </strong></p>
                        <Card.Description data-testid={"drink-description-" + index.toString()}>{description}</Card.Description>

                    </div>

                    <div>
                        <br/>
                        <p><strong>Ingredients: </strong></p>
                        <Card.Content>
                            <List bulleted>
                                {ingredients.map((ingr, idx) => {
                                    return (
                                        <p data-testid={"drink-"+ index.toString() + "-ingredient-" + idx.toString()}>
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


export const userCard = (index, username, photo) => {
    let pfp;
    if (photo === null || photo === ""){
        pfp = <Image floated="right" size="tiny" src={process.env.PUBLIC_URL + "/nopfp.png"} data-testid={"user-placeholder-img-" + index.toString()}/>
    }else{
        pfp = <Image floated="right" size="tiny" src={`data:image/jpeg;base64,${photo}`} data-testid={"user-b64-img-" + index.toString()}/>
    }
    //Todo: Add photo functionality
    return(
        <Card centered data-testid={"user-card-" + index.toString()}>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Card.Content>
                    {pfp}
                    <Card.Header data-testid={"user-name-" + index.toString()}>{username}</Card.Header>
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
        <Card style={{width: "500px"}} centered data-testid="dotd-card">
            <Card.Header>Today's Drink of the Day</Card.Header>
            <Segment basic textAlign="left" attached="bottom" style={{width: "500px"}}>
                <Header textAlign="center" style={{marginTop: "0px"}}>
                    <NavLink class="drinklink" to={(`/profile/${dotd.publisher}/drink/${dotd.name}`)} data-testid="dotd-name">
                        {dotd.name}
                    </NavLink>
                </Header>
                <Card.Description content={dotd.description} data-testid="dotd-description"/>
                <br/>
                <Card.Content>
                    <List bulleted>
                        {dotd.ingredients.map((ingr, index) => {
                            return (
                                <List.Item data-testid={"dotd-ingredient-" + index.toString()}>
                                    {ingr.quantity} {ingr.measurement} {ingr.ingredient}
                                </List.Item>
                            )
                        })}
                    </List>
                </Card.Content>
                <Card.Meta data-testid="dotd-publisher">{dotd.publisher}</Card.Meta>
                <Card.Content extra>
                    <Rating icon='star' defaultRating={5} maxRating={5}/>
                </Card.Content>
            </Segment>
        </Card>
    )
};