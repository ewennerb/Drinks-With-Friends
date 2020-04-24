import React from 'react';
import 'regenerator-runtime/runtime'
import DrinkCard from '../pages/DrinkCard.js';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import {getByTestId, render} from "@testing-library/react";

configure({adapter: new Adapter()});

const drink = {
    likes: 0,
    id: 30,
    dislikes: 1,
    name: "Alexander",
    description: "Shake all ingredients with ice and strain contents into a cocktail glass. Sprinkle nutmeg on top and serve.",
    ingredients:[
        {
            measurement:"cl",
            ingredient:"brown crème de cacao",
            quantity: "3",
            username: null,
            drinkId: -1
        },
        {
            measurement: "cl",
            ingredient:"cognac",
            quantity:"3",
            username:null,
            drinkId:-1},
        {
            measurement:"cl",
            ingredient:"light cream",
            quantity:"3",
            username:null,
            drinkId:-1
        },
    ],
    photo:"",
    publisher:"IBA_Official"
};

let wrapper;


beforeAll(() => {
    global.fetch = jest.fn();
    //window.fetch = jest.fn(); if running browser environment
});

beforeEach(() => {
    wrapper = shallow(<DrinkCard drink={drink} />, { disableLifecycleMethods: true });
});

afterEach(() => {
    wrapper.unmount();
});


const testSetup = () => {
    const spyDidMount = jest.spyOn(DrinkCard.prototype, "componentDidMount");
    //This runs a fake query
    fetch.mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => {
                //This value here should be whatever the fetch in componentDidMount expects
                return Promise.resolve({
                    user: undefined
                });
            }
        });
    });
    const didMount = wrapper.instance().componentDidMount();
    return {didMount, spyDidMount};
};



// test("Renders loader without crashing", (done) => {
//     const {container} = render(<DrinkCard drink={drink}/>);
//     expect(getByTestId(container, "drink-loader")).toBeDefined();
//     done();
// });


test("Renders drink with no user passed", (done) => {
    const {didMount, spyDidMount} = testSetup();
    //This waits for componentDidMount to do something before going
    expect(spyDidMount).toHaveBeenCalled();
    didMount.then(() => {
        // updating the wrapper
        wrapper.update();

        //Find the elements on the drink and see if they really exist
        expect(wrapper.find('[data-testid=\"drink-share\"]').exists());
        expect(wrapper.find('[data-testid=\"drink-img-placeholder\"]').exists());
        expect(wrapper.find('[data-testid=\"drink-name\"]').exists());
        expect(wrapper.find('[data-testid=\"drink-ingredient-list\"]').exists());
        expect(wrapper.find('[data-testid=\"drink-likeDislike-loggedOut\"]').exists());

        spyDidMount.mockRestore();
        fetch.mockClear();
        done();
    });
});