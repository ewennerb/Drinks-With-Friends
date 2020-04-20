import React from 'react';
import {Search} from 'semantic-ui-react';
import { withGoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";

export default class GeoSearch extends React.Component{
    constructor( props ){
        super( props );
        this.state = {
            address: '',
            city: '',
            area: '',
            mapState: '',
            searchInput: '',
            isLoading: false,
            results: [],
            mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            markerPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.resetComponent = this.resetComponent.bind(this);
        this.autoComp = React.createRef();
    }


    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });

    async handleSearchChange(event, google) {
        const value = event.target.value;
        this.setState({searchInput: value});


        const loadPredictions = (predictions, status) => {
            let bars = [];

            //Todo: try and maybe somehow do a bar where you can slide for location
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
                return;
            }
            console.log(predictions);
            this.setState({isLoading: false, results: predictions})
        };
        //
        //
        // this.autoComp = new google.maps.places.AutocompleteService();
        // console.log("Autocomplete service set up");
        // await this.autoComp.getPlacePredictions(
        //     {
        //         input: this.state.searchInput,
        //         location: new google.maps.LatLng({ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }),
        //         types: ["establishment"],
        //         radius: 32187
        //     },
        //     loadPredictions
        // );
        const map = new google.maps.Map(document.getElementById('map'));
        const autoComp = new google.maps.places.PlacesService(map);
        const center =  new google.maps.LatLng({ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng });
        if(value.length > 2){
            await autoComp.nearbySearch(
                {
                    name: this.state.searchInput,
                    location: center,
                    radius: 32187,
                    type: ['bar'],
                },
                loadPredictions
            );
        }
    }

    handleResultSelect = (e, { result }) => this.setState({ value: result.title });

    render(){

        const Bar = withScriptjs(props =>
            <div>

                <Search
                    fluid
                    loading={this.state.isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={(e) => this.handleSearchChange(e, window.google)}
                    results={[]}
                    value={this.state.searchInput}
                />
            </div>
            );


        return(
            <Bar
                googleMapURL="https://maps.googleapis.com/maps/api/places/textjs?key=AIzaSyA0jKEk1Wwq_0Ny1z7y70JyE_4XJhho15k&fields="
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        )

    }
}