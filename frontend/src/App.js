import React from 'react';
import './css/App.css';
import Routes from './Routes.js'
import 'semantic-ui-css/semantic.min.css';

class App extends React.Component{
  
  render(){
    return (
        <div className="App">
            <Routes/>
        </div>
    );
  }
}

export default App;
