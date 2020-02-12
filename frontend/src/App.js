import React from 'react';
import './App.css';
import Routes from './Routes.js'

class App extends React.Component{
  render(){
    return (
        <div className="App">
          <header className="App-header">
            Drinks with Friends
              <Routes/>
          </header>
        </div>
    );
  }
}

export default App;
