import React from 'react';
import 'regenerator-runtime/runtime'
import Search from '../pages/Search.js';
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let wrapper;


beforeAll(() => {
    global.fetch = jest.fn();
    //window.fetch = jest.fn(); if running browser environment
});

beforeEach(() => {
    wrapper = shallow(<Search />, { disableLifecycleMethods: true });
});

afterEach(() => {
    wrapper.unmount();
});


//Setup function that gets called at the beginning of each test
const searchTestSetup = () => {
    const spyDidMount = jest.spyOn(Search.prototype, "componentDidMount");
    fetch.mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => {
                return Promise.resolve({
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
                });
            }
        });
    });
    const didMount = wrapper.instance().componentDidMount();
    return {didMount, spyDidMount};
};



test("Renders without crashing", (done) => {
    const {didMount, spyDidMount} = searchTestSetup();

    // expecting componentDidMount have been called
    expect(spyDidMount).toHaveBeenCalled();
    didMount.then(() => {
        // updating the wrapper
        wrapper.update();

        //Find the drink of the day card and check that it exists
        expect(wrapper.find('[data-testid=\"dotd-card\"]').exists());

        //Find Search Form and check that it exists
        expect(wrapper.find('[data-testid=\"search-form-bar\"]').exists());
        expect(wrapper.find('[data-testid=\"search-form-drinks\"]').exists());
        expect(wrapper.find('[data-testid=\"search-form-ingredients\"]').exists());
        expect(wrapper.find('[data-testid=\"search-form-users\"]').exists());
        expect(wrapper.find('[data-testid=\"search-form-official\"]').exists());
        spyDidMount.mockRestore();
        fetch.mockClear();
        done();
    });
});



test("Search Options Work", (done) => {
    const {didMount, spyDidMount} = searchTestSetup();

    // expecting componentDidMount have been called
    expect(spyDidMount).toHaveBeenCalled();
    didMount.then(() => {
        // updating the wrapper
        wrapper.update();
        const drinkButton = wrapper.find('[data-testid=\"search-form-drinks\"]');
        const ingredientButton = wrapper.find('[data-testid=\"search-form-ingredients\"]');
        const userButton = wrapper.find('[data-testid=\"search-form-users\"]');

        //Check that the default behavior is good
        expect(drinkButton.prop("checked")).toEqual(true);
        expect(ingredientButton.prop("checked")).toEqual(false);
        expect(userButton.prop("checked")).toEqual(false);

        //Simulate a click on a new button and check if the state updates
        userButton.simulate('click');
        wrapper.update();
        expect(wrapper.find('[data-testid=\"search-form-drinks\"]').prop("checked")).toEqual(false);
        expect(wrapper.find('[data-testid=\"search-form-ingredients\"]').prop("checked")).toEqual(false);
        expect(wrapper.find('[data-testid=\"search-form-users\"]').prop("checked")).toEqual(true);


        spyDidMount.mockRestore();
        fetch.mockClear();
        done();


    });
});



test("Input Field Updates", (done) => {
    const {didMount, spyDidMount} = searchTestSetup();

    // expecting componentDidMount have been called
    expect(spyDidMount).toHaveBeenCalled();
    didMount.then(() => {
        // updating the wrapper
        wrapper.update();
        const searchBar = wrapper.find('[data-testid=\"search-form-bar\"]');
        expect(searchBar.prop('value')).toEqual("");
        searchBar.simulate("change", {target: { value: 'Input has changed' }});

        wrapper.update();
        expect(wrapper.find('[data-testid=\"search-form-bar\"]').prop('value')).toEqual('Input has changed');

        spyDidMount.mockRestore();
        fetch.mockClear();
        done();
    });
});
