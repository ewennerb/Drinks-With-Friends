import React from 'react';
import './css/App.css';
import Routes from './Routes.js'
import 'semantic-ui-css/semantic.min.css';
import {ThemeProvider} from 'styled-components';
import {GlobalStyles} from './config/global';
import {lightTheme, darkTheme} from './config/theme';

class App extends React.Component{
  
  render(){
    return (
      <ThemeProvider theme={lightTheme}>
          <GlobalStyles/>
          <div className="App">
              <Routes/>
          </div>
        </ThemeProvider>
    );
  }
}

export default App;
