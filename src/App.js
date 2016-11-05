import React, { Component } from 'react';

import Canvas from './canvas';
import './App.css';

class App extends Component {

  render() {
    return (
      <Canvas id="myCanvas" className="canvas" width={640} height={400}/>
    );
  }
}

export default App;
