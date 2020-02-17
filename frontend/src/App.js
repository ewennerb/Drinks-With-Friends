import React from 'react';
import './css/App.css';
import Routes from './Routes.js'
import 'semantic-ui-css/semantic.min.css';

class App extends React.Component{
  render(){
    return (
        <div className="App">
            <h1>DRINKS WITH FRIENDS</h1>
            <Routes/>
        </div>
    );
  }
}

export default App;
