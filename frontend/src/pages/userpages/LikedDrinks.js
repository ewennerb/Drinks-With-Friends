import React, { Component } from 'react';

import 'semantic-ui-css/semantic.min.css';

class LikedDrinks extends Component{
  super(props){
    this.state = {
      user: this.props.user,
    }
  }

  render(){
    return (
        <div >
            Liked drinks ope
        </div>
    );
  }
}

export default LikedDrinks;
