import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {Image} from "semantic-ui-react";
import {dotdCard, userCard} from "../pages/utils";
import {PostCard} from "../pages/PostCard"
import {render, getByTestId, queryByTestId} from "@testing-library/react";
import b64Img from "./resources/4horsemen.js"

const ingredients = [
    {
        ingredient: "vodka",
        quantity: "1",
        measurement: "shot"
    },
    {
        ingredient: "Red Bull",
        quantity: "8",
        measurement: "oz"
    },
];

const sampleDOTD = {
    name: "Test DOTD",
    publisher: "Jest",
    description: "This is a fake test drink",
    ingredients: ingredients,
};


test('Drink of the Day Card Renders', () => {

    const {container} = render(<BrowserRouter>{dotdCard(sampleDOTD)}</BrowserRouter>);
    expect(getByTestId(container, "dotd-card")).toBeDefined();
});


test('Drink of the Day Fields Render Correctly', () => {
    const sampleDOTD = {
        name: "Test DOTD",
        publisher: "Jest",
        description: "This is a fake test drink",
        ingredients: [
            {
                ingredient: "vodka",
                quantity: "1",
                measurement: "shot"
            },
            {
                ingredient: "Red Bull",
                quantity: "8",
                measurement: "oz"
            },
        ]
    };
    const {container} = render(<BrowserRouter>{dotdCard(sampleDOTD)}</BrowserRouter>);

    expect(getByTestId(container, "dotd-card")).toBeDefined();
    expect(getByTestId(container, "dotd-name").textContent).toEqual("Test DOTD");
    expect(getByTestId(container, "dotd-publisher").textContent).toEqual("Jest");
    expect(getByTestId(container, "dotd-description").textContent).toEqual("This is a fake test drink");
    expect(getByTestId(container, "dotd-ingredient-0").textContent).toEqual("1 shot vodka");
    expect(getByTestId(container, "dotd-ingredient-1").textContent).toEqual("8 oz Red Bull");
});



test('User Card Renders', () => {
    const {container} = render(<BrowserRouter>{userCard(0, 'test-username', "", "not-user")}</BrowserRouter>);
    expect(getByTestId(container, "user-card-0")).toBeDefined();
});


test('User card fields render correctly', () => {
    const {container} = render(<BrowserRouter>{userCard(0, 'test-username', "", "not-user")}</BrowserRouter>);
    expect(getByTestId(container, "user-name-0").textContent).toEqual("@test-username");
    expect(getByTestId(container, "user-placeholder-img-0")).toBeDefined();
    expect(queryByTestId(container, "user-b64-img-0")).toBeNull();
});


test('User card renders b64 image', () => {
    const {container} = render(<BrowserRouter>{userCard(0, 'test-username', b64Img, "not-user")}</BrowserRouter>);
    expect(getByTestId(container, "user-name-0").textContent).toEqual("@test-username");
    expect(queryByTestId(container, "user-placeholder-img-0")).toBeNull();
    expect(getByTestId(container, "user-b64-img-0")).toBeDefined();
});


test('User post renders correctly', () => {
    let sameplePostCard = {
        test: "This is some sample text for testing, LATEE DAAA",
        userName: "Jest",
        geolocation: "This is a fake test location",
        date: "3/30/2020",
        profileImage: "",
        image: "",
        name: "Jestname"
    };
    const {container} = render(<BrowserRouter><PostCard post={sameplePostCard}/></BrowserRouter>);
    expect(getByTestId(container, "post-card-0")).toBeDefined();
});

test('User post fields render correctly', () => {
    let sameplePostCard = {
        text: "This is some sample text for testing, LATEE DAAA",
        userName: "Jest",
        geolocation: "This is a fake test location",
        date: "3/30/2020",
        profileImage: null,
        image: null,
        name: "Jest's name"
    }
    const {container} = render(<BrowserRouter><PostCard post={sameplePostCard}/></BrowserRouter>);
    expect(getByTestId(container, "post-name-0").textContent).toEqual("(Jest's name)");
    expect(getByTestId(container, "post-username-0").textContent).toEqual("@Jest");
    expect(getByTestId(container, "post-text-0").textContent).toEqual("This is some sample text for testing, LATEE DAAA");
    expect(getByTestId(container, "post-user-placeholder-img-0")).toBeDefined();
    expect(queryByTestId(container, "post-user-b64-img-0")).toBeNull();
    expect(queryByTestId(container, "post-b64-img-0")).toBeNull();
});

test('User post images render correctly', () => {
    let sameplePostCard = {
        text: "This is some sample text for testing, LATEE DAAA",
        userName: "Jest",
        geolocation: "This is a fake test location",
        date: "3/30/2020",
        profileImage: null,
        image: null,
        name: "Jest's name"
    }
    const {container} = render(<BrowserRouter><PostCard post={sameplePostCard}/></BrowserRouter>);
    expect(getByTestId(container, "post-name-0").textContent).toEqual("(Jest's name)");
    expect(getByTestId(container, "post-username-0").textContent).toEqual("@Jest");
    expect(getByTestId(container, "post-text-0").textContent).toEqual("This is some sample text for testing, LATEE DAAA");
    expect(queryByTestId(container, "post-user-b64-img-0")).toBeDefined();
    expect(queryByTestId(container, "post-b64-img-0")).toBeDefined();
    
});
test('User post user image renders correctly', () => {
    let sameplePostCard = {
        text: "This is some sample text for testing, LATEE DAAA",
        userName: "Jest",
        geolocation: "This is a fake test location",
        date: "3/30/2020",
        profileImage: null,
        image: null,
        name: "Jest's name"
    }
    const {container} = render(<BrowserRouter><PostCard post={sameplePostCard}/></BrowserRouter>);
    expect(getByTestId(container, "post-name-0").textContent).toEqual("(Jest's name)");
    expect(getByTestId(container, "post-username-0").textContent).toEqual("@Jest");
    expect(getByTestId(container, "post-text-0").textContent).toEqual("This is some sample text for testing, LATEE DAAA");
    expect(queryByTestId(container, "post-user-b64-img-0")).toBeDefined();
    expect(queryByTestId(container, "user-div-img-0")).toBeDefined();
    
});


test('User post fields render correctly', () => {
    let sameplePostCard = {
        text: "This is some sample text for testing, LATEE DAAA",
        userName: "Jest",
        geolocation: "This is a fake test location",
        date: "3/30/2020",
        profileImage: null,
        image: null,
        name: "Jest's name"
    }
    const {container} = render(<BrowserRouter><PostCard post={sameplePostCard}/></BrowserRouter>);
    expect(getByTestId(container, "post-name-0").textContent).toEqual("(Jest's name)");
    expect(getByTestId(container, "post-username-0").textContent).toEqual("@Jest");
    expect(getByTestId(container, "post-text-0").textContent).toEqual("This is some sample text for testing, LATEE DAAA");
    expect(queryByTestId(container, "post-user-placeholder-img-0")).toBeDefined();
    expect(queryByTestId(container, "post-b64-img-0")).toBeDefined();
    
});

// test('Drink Card Renders', () => {
//     const {container} = render(<DrinkCard>index={0} </DrinkCard>
//     </DrinkCard>drinkCard(0, 'Test Drink', "This is a fake drink", "", ingredients, "Jest"));
//     expect(getByTestId(container, "drink-card-0")).toBeDefined();
// });
//
//
// test('Drink card fields render correctly', () => {
//     const {container} = render(drinkCard(0, 'Test Drink', "This is a fake drink", "", ingredients, "Jest"));
//     expect(getByTestId(container, "drink-name-0").textContent).toEqual("Test Drink");
//     expect(getByTestId(container, "drink-placeholder-img-0")).toBeDefined();
//     expect(queryByTestId(container, "drink-b64-img-0")).toBeNull();
//     expect(getByTestId(container, "drink-publisher-0").textContent).toEqual("Jest");
//     expect(getByTestId(container, "drink-description-0").textContent).toEqual("This is a fake drink");
//     expect(getByTestId(container, "drink-0-ingredient-0").textContent).toEqual("1 shot vodka");
//     expect(getByTestId(container, "drink-0-ingredient-1").textContent).toEqual("8 oz Red Bull");
// });
//
//
// test('Drink card renders with b64 image', () => {
//     const {container} = render(drinkCard(0, 'Test Drink', "This is a fake drink", b64Img, ingredients, "Jest"));
//     expect(queryByTestId(container, "drink-placeholder-img-0")).toBeNull();
//     expect(getByTestId(container, "drink-b64-img-0")).toBeDefined();
// });


