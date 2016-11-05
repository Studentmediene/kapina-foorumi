import React, { Component } from 'react';
import ReactDom from 'react-dom';

import styles from './canvas.css'
import Player from './Player'
import playerImage from './it-man-sprite.png'

class Canvas extends Component {
  constructor(props) {
    super(props);
    this._startGame = this._startGame.bind(this);
  }
  _keystate: {};
  _canvas: undefined;
  _context: undefined;
  _loop: null;
  _player: null;

  componentDidMount() {
    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Starting Game',
      this.props.width/2,
      this.props.height/2 );
    setTimeout(this._startGame, 1000);
  }

  _setupCanvas() {
    this._canvas = ReactDom.findDOMNode(this);
    this._context = this._canvas.getContext('2d');
  }

  _startGame() {

    // If the game loop is already started, do nothing.
    if(this._loop){
      return;
    }

    const keystate = this._keystate;
    document.addEventListener('keydown', function(evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function(evt) {
      // Do not delete, setting to undefined is faster.
      keystate[evt.keyCode] = undefined;
    });
    
    var image = new Image();
    image.src = playerImage;
    this._player = new Player(this._context, 1048, 80, image);
    
    

    this._loop = setInterval(() => {
      this._update();
      this._draw();
    },10);
  }

  _update() {
    this._player.updateRun();
    
    // Put all computations of the new state here
  }

  _draw() {
    
    this._player.render();
    //this._player.updateRun();

    // Only put drawing on the canvas element here.
  }

  render() {
    return (
      <canvas id="myCanvas" className={styles.gameCanvas} width={this.props.width} height={this.props.height}></canvas>
    );
  }
}

Canvas.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
}

export default Canvas;
