import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {Image} from "semantic-ui-react";
import {dotdCard, drinkCard, userCard} from "../pages/utils";
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
    const {container} = render(userCard(0, 'test-username', ""));
    expect(getByTestId(container, "user-card-0")).toBeDefined();
});


test('User card fields render correctly', () => {
    const {container} = render(userCard(0, 'test-username', ""));
    expect(getByTestId(container, "user-name-0").textContent).toEqual("test-username");
    expect(getByTestId(container, "user-placeholder-img-0")).toBeDefined();
    expect(queryByTestId(container, "user-b64-img-0")).toBeNull();
});


test('User card renders b64 image', () => {
    const {container} = render(userCard(0, "test-username", b64Img));
    expect(getByTestId(container, "user-name-0").textContent).toEqual("test-username");
    expect(queryByTestId(container, "user-placeholder-img-0")).toBeNull();
    expect(getByTestId(container, "user-b64-img-0")).toBeDefined();
});



test('Drink Card Renders', () => {
    const {container} = render(drinkCard(0, 'Test Drink', "This is a fake drink", "", ingredients, "Jest"));
    expect(getByTestId(container, "drink-card-0")).toBeDefined();
});


test('Drink card fields render correctly', () => {
    const {container} = render(drinkCard(0, 'Test Drink', "This is a fake drink", "", ingredients, "Jest"));
    expect(getByTestId(container, "drink-name-0").textContent).toEqual("Test Drink");
    expect(getByTestId(container, "drink-placeholder-img-0")).toBeDefined();
    expect(queryByTestId(container, "drink-b64-img-0")).toBeNull();
    expect(getByTestId(container, "drink-publisher-0").textContent).toEqual("Jest");
    expect(getByTestId(container, "drink-description-0").textContent).toEqual("This is a fake drink");
    expect(getByTestId(container, "drink-0-ingredient-0").textContent).toEqual("1 shot vodka");
    expect(getByTestId(container, "drink-0-ingredient-1").textContent).toEqual("8 oz Red Bull");
});


test('Drink card renders with b64 image', () => {
    const {container} = render(drinkCard(0, 'Test Drink', "This is a fake drink", b64Img, ingredients, "Jest"));
    expect(queryByTestId(container, "drink-placeholder-img-0")).toBeNull();
    expect(getByTestId(container, "drink-b64-img-0")).toBeDefined();
});


