import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import {
  Grid,
  List,
  GridColumn, 
  GridRow,
} from "semantic-ui-react";


import "../css/All.css"
import { NavLink } from "react-router-dom/esm/react-router-dom";





class All extends Component{
  constructor(props){
    super(props)
    this.initData()
    this.handleSearch = this.handleSearch.bind(this)
    this.state = {
        resultsCol1: [],
        resultsCol2: [],
        resultsCol3: []
    }

  }
  
  async handleSearch(letter) {
    await fetch('http://localhost:8080/drink/all/' + letter, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
          }).then(res => res.json()).then(async (data) => {
            
            if (!(data.results === undefined)) {
              let MAX_COL = 20
              let col = []
              for (let i = 0; i < MAX_COL && i < data.results.length; i++) {
                col.push(data.results[i] );
              }
              this.setState({resultsCol1: col});
              if (data.results.length > MAX_COL) {
                col = [];
                for (let i = MAX_COL; i < MAX_COL * 2 && i < data.results.length; i++) {
                  col.push(data.results[i]);
                }
                this.setState({resultsCol2: col});
              }
              if (data.results.length > MAX_COL * 2) {
                col = [];
                for (let i = MAX_COL * 2; i < MAX_COL * 3 && i < data.results.length; i++) {
                  col.push(data.results[i]);
                }
                this.setState({resultsCol3: col});
              }
              
            }
            
          }).catch(err => {
            console.log("no names found");
            this.setState({results: []});
          })
  }

  initData(){
    let pos = window.location.hash
    if (pos.length <= 1) {
      return;
    }
    this.handleSearch(pos[1])
  }

  

  render(){

    return(
      <div>
        <Grid style={{ height: '100vh'}} columns={16} centered verticalAlign="top">
            <GridRow>
                <GridColumn width={10} id="list">
                  <ul>
                    <div>
                      <li onClick={() => this.handleSearch('a')}><a href="#a">a</a></li>
                      <li onClick={() => this.handleSearch('b')}><a href="#b">b</a></li>
                      <li onClick={() => this.handleSearch('c')}><a href="#c">c</a></li>
                      <li onClick={() => this.handleSearch('d')}><a href="#d">d</a></li>
                      <li onClick={() => this.handleSearch('e')}><a href="#e">e</a></li>
                      <li onClick={() => this.handleSearch('f')}><a href="#f">f</a></li>
                      <li onClick={() => this.handleSearch('g')}><a href="#g">g</a></li>
                      <li onClick={() => this.handleSearch('h')}><a href="#h">h</a></li>
                      <li onClick={() => this.handleSearch('i')}><a href="#i">i</a></li>
                      <li onClick={() => this.handleSearch('j')}><a href="#j">j</a></li>
                      <li onClick={() => this.handleSearch('k')}><a href="#k">k</a></li>
                      <li onClick={() => this.handleSearch('l')}><a href="#l">l</a></li>
                      <li onClick={() => this.handleSearch('m')}><a href="#m">m</a></li>
                      <li onClick={() => this.handleSearch('n')}><a href="#n">n</a></li>
                      <li onClick={() => this.handleSearch('o')}><a href="#o">o</a></li>
                      <li onClick={() => this.handleSearch('p')}><a href="#p">p</a></li>
                      <li onClick={() => this.handleSearch('q')}><a href="#q">q</a></li>
                      <li onClick={() => this.handleSearch('r')}><a href="#r">r</a></li>
                      <li onClick={() => this.handleSearch('s')}><a href="#s">s</a></li>
                      <li onClick={() => this.handleSearch('t')}><a href="#t">t</a></li>
                      <li onClick={() => this.handleSearch('u')}><a href="#u">u</a></li>
                      <li onClick={() => this.handleSearch('v')}><a href="#v">v</a></li>
                      <li onClick={() => this.handleSearch('w')}><a href="#w">w</a></li>
                      <li onClick={() => this.handleSearch('x')}><a href="#x">x</a></li>
                      <li onClick={() => this.handleSearch('y')}><a href="#y">y</a></li>
                      <li onClick={() => this.handleSearch('z')}><a href="#z">z</a></li>
                    </div>
                  </ul>
                </GridColumn>
            </GridRow>
            <GridRow>
                <GridColumn width={4}>
                {this.state.resultsCol1.map(result => {
                  var test = <NavLink class="drinklink" to={(`/${result.publisher}/drink/${result.name}`)}>
                    {result.name} by {result.publisher}
                    </NavLink>
                  return(
                    test
                  )
                })}
                </GridColumn>
                <GridColumn width={4}>
                {this.state.resultsCol2.map(result => {
                  var test = <List.Item>
                      {result.name}
                    </List.Item>
                  return(
                    test
                  )
                })}
                </GridColumn>
                
                <GridColumn width={4} >
                {this.state.resultsCol3.map(result => {
                  var test = <List.Item>
                      {result.name}
                    </List.Item>
                  return(
                    test
                  )
                })}
                </GridColumn>
                
            </GridRow>
            <GridRow/>
            <GridRow/>
            <GridRow/>
            <GridRow/>
            <GridRow/>
            <GridRow/>
            <GridRow/>
            <GridRow/>
            <GridRow/>


            
        
        </Grid>
      </div>  
    )
  }

}

export default All