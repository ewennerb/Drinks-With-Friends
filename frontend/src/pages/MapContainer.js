import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker, P } from "react-google-maps";
import {Search, Segment, Header, List, Icon} from "semantic-ui-react";
import Geocode from "react-geocode";
import _ from 'lodash';
import Autocomplete from 'react-google-autocomplete';
Geocode.setApiKey( "AIzaSyA0jKEk1Wwq_0Ny1z7y70JyE_4XJhho15k" );
Geocode.enableDebug();




class Map extends Component{

    constructor( props ){
        super( props );
        this.state = {
            address: '',
            city: '',
            area: '',
            state: '',
            mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            markerPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            searchInput: '',
            isLoading: false,
            ready:false,
            results: undefined
        };
        this.services = undefined;
        this.bars = [];
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.onPlaceSelected = this.onPlaceSelected.bind(this);
        // this.resetComponent = this.resetComponent.bind(this);
        this.autoComp = React.createRef();
    }


    /**
     * Get the current address from the default map position and set those values in the state
     */
    async componentDidMount() {
        // this.autoComp = new google.maps.places.AutocompleteService();
        Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray =  response.results[0].address_components,
                    city = this.getCity( addressArray ),
                    area = this.getArea( addressArray ),
                    state = this.getState( addressArray );

                console.log( 'city', city, area, state );
                console.log(response.results[0]);
                this.bars = [];
                this.setState( {
                    address: ( address ) ? address : '',
                    area: ( area ) ? area : '',
                    city: ( city ) ? city : '',
                    state: ( state ) ? state : '',
                    results: undefined,
                    mapPosition: {
                        lat: this.props.center.lat,
                        lng: this.props.center.lng
                    },
                    markerPosition: {
                        lat: this.props.center.lat,
                        lng: this.props.center.lng
                    },
                    ready: false
                } )
            },
            error => {
                console.error( error );
            }
        );
    };


    handleSearchChange(event){
        // console.log(google);
        const value = event.target.value;
        console.log(value);
        this.setState({searchInput: value});
        console.log(this.state);


        // const loadPredictions = (predictions, status) => {
        //     let bars = [];
        //     if (status !== google.maps.places.PlacesServiceStatus.OK) {
        //         alert(status);
        //         return;
        //     }
        //     console.log(predictions);
        //         //     for(let i = 0; i < predictions.length; i++){
        //         //         if(predictions[i].types.some(item => 'bar' === item.name)){
        //         //             bars.push(predictions[i]);
        //         //         }
        //         //         // if(predictions[i].types)
        //         //     }
        //         //     console.log(bars);
        //         //     this.setState({isLoading: false, results: predictions})
        //         // };
        //         //
        //         //
        //         // this.autoComp = new google.maps.places.AutocompleteService();
        //         // console.log("Autocomplete service set up");
        //         // await this.autoComp.getPlacePredictions(
        //         //     {
        //         //         input: this.state.searchInput,
        //         //         location: new google.maps.LatLng({ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }),
        //         //         types: ["establishment"],
        //         //         radius: 32187
        //         //     },
        //         //     loadPredictions
        //         // );
    };









    /**
     * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
     *
     * @param nextProps
     * @param nextState
     * @return {boolean}
    //  */
    shouldComponentUpdate( nextProps, nextState ){
        if (
            this.state.markerPosition.lat !== this.props.center.lat ||
            this.state.address !== nextState.address ||
            this.state.city !== nextState.city ||
            this.state.area !== nextState.area ||
            this.state.state !== nextState.state ||
            this.state.results !== nextState.results
        ) {
            return true
        } else if ( this.props.center.lat === nextProps.center.lat || this.state.results === undefined || nextState.results === undefined ){
            return false
        }
    }
    /**
     * Get the city and set the city input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    getCity = ( addressArray ) => {
        let city = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
                city = addressArray[ i ].long_name;
                return city;
            }
        }
    };
    /**
     * Get the area and set the area input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    getArea = ( addressArray ) => {
        let area = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0]  ) {
                for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
                    if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
                        console.log(addressArray[i]);
                        area = addressArray[ i ].long_name;
                        return area;
                    }
                }
            }
        }
    };
    /**
     * Get the address and set the address input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    getState = ( addressArray ) => {
        let state = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            for( let i = 0; i < addressArray.length; i++ ) {
                if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
                    state = addressArray[ i ].long_name;
                    return state;
                }
            }
        }
    };
    /**
     * And function for city,state and address input
     * @param event
     */
    onChange = ( event ) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    /**
     * This Event triggers when the marker window is closed
     *
     * @param event
     */
    onInfoWindowClose = ( event ) => {

    };


    /**
     * When the user types an address in the search box
     * @param place
     */
    async onPlaceSelected( place, google ) {
        console.log( 'plc', place );
        this.setState({ready: false});

        const address = place.formatted_address,
            addressArray =  place.address_components,
            city = this.getCity( addressArray ),
            area = this.getArea( addressArray ),
            state = this.getState( addressArray ),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();
        // Set these values in the state.


        //Gets a list of the bars near the city you selected
        await this.getCityBars(google);
        console.log("swaos");
        console.log(this.state);


        await this.setState({
            address: ( address ) ? address : '',
            area: ( area ) ? area : '',
            city: ( city ) ? city : '',
            state: ( state ) ? state : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
            ready: true,
            // results: bars
        })
        //Todo: put inter-component function here to pass location to the top
    };



//Todo: Fuck this shit I do not care
    async getCityBars(google) {
        let searchQuery = {
            location: new google.maps.LatLng({ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }),
            radius: 4828,
            types: ['bar']
        };

        const loadResults = (results) => {
            this.bars = results;
            this.setState({results: results});
            return results;
        };

        if (this.services === undefined){
            let map = new google.maps.Map(
                await document.getElementById('map'), {center: { lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }, zoom: 15});
            this.services = await new google.maps.places.PlacesService(map);
        }

        let bars = await this.services.nearbySearch(searchQuery, (results) => loadResults(results));
        //     results: results,
        //     mapPosition: {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},
        //     markerPosition: {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()}
        // })});
        console.log(bars);
        return;
    }


    //
    // }


    render(){
        const { isLoading, results } = this.state;
        let renderResult;
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                                <GoogleMap id="map" google={ this.props.google }
                                           defaultZoom={ this.props.zoom }
                                           defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}


                                >
                                    {/* InfoWindow on top of marker */}
                                    {/*<InfoWindow*/}
                                    {/*    onClose={this.onInfoWindowClose}*/}
                                    {/*    position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}*/}
                                    {/*>*/}
                                    {/*    <div>*/}
                                    {/*        <span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>*/}
                                    {/*    </div>*/}
                                    {/*</InfoWindow>*/}
                                    {/*Marker*/}
                                    <Marker google={this.props.google}
                                            name={'Dolores park'}
                                            draggable={false}
                                            position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                                    />

                                </GoogleMap>

                )
            )
        );

        const Sbar = withScriptjs(
            withGoogleMap(props => (

                    <Autocomplete
                        // google={this.props.google}
                        style={{
                            width: '100%',
                            height: '40px',
                            paddingLeft: '16px',
                            marginTop: '2px',
                            marginBottom: '50px'
                        }}
                        onPlaceSelected={async (e) => await this.onPlaceSelected(e, window.google)}
                        types={['(cities)']}
                    />
                )
            )
        );
        if( this.props.center.lat !== undefined ) {
            if (this.state.ready) {
                let x = 0;
                console.log("X = 0!");
                // do {x += 1} while(this.bars === undefined && x <= Infinity);
                console.log(this.state.results);
                renderResult = <div>
                    <List divided verticalAlign='middle'>
                        {this.bars.map((res, index) => {
                            console.log(res.name);
                            return (
                                <List.Item>
                                    {res.name}
                                </List.Item>
                            )

                            //Todo: make the onClick method here return the props back up to the main component
                        })}
                    </List>;
                </div>

            } else {
                renderResult = <Header size="small">No Bars Here :(</Header>
            }
        }
            return(
                <Segment.Group horizontal>
                    <Segment placeholder textAlign="center" style={{"width": "50%"}}>
                        <Header>
                            <AsyncMap
                                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0jKEk1Wwq_0Ny1z7y70JyE_4XJhho15k&libraries=places"
                                loadingElement={
                                    <div style={{ height: `100%` }} />
                                }
                                containerElement={
                                    <div style={{ height: this.props.height }} />
                                }
                                mapElement={
                                    <div id="map" style={{ height: `100%`, width: `100%`}} />
                                }
                            />
                        </Header>
                    </Segment>
                    <Segment compact textAlign="left" style={{"width": "50%"}}>
                        <Header >
                            Searching for Bars In:
                            <Sbar
                                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0jKEk1Wwq_0Ny1z7y70JyE_4XJhho15k&libraries=places"
                                loadingElement={
                                    <div style={{ height: `50%` }} />
                                }
                                containerElement={
                                    <div style={{ height: this.props.height }} />
                                }
                                mapElement={
                                    <div style={{ height: `0px`, width: `0px`}} />
                                }
                            />
                            {renderResult}
                        </Header>
                        <Segment basic attached="top">

                        </Segment>

                    </Segment>
                </Segment.Group>
            );
        // } else {
        //     return(<div style={{height: this.props.height}} />);
        // }
    }
}
export default Map