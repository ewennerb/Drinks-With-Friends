import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {dotdCard, drinkCard, userCard} from "../pages/utils";
import {render, waitForElement, getByTestId} from "@testing-library/react";


test('Drink of the Day Card Renders', () => {
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

