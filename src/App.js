import React, { Component } from 'react';
import ReactDom from 'react-dom';
import logo from './logo.svg';
import Canvas from './canvas';
import './App.css';

class App extends Component {

  componentDidMount() {
    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Starting Game',
      this.props.width/2,
      this.props.height/2 );
  }

  _setupCanvas() {
    this._canvas = ReactDom.findDOMNode(this);
    this._context = this._canvas.getContext('2d');
  }

  render() {
    return (
      <Canvas id="myCanvas" width={480} height={320}/>
    );
  }
}

export default App;
