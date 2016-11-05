import React, { Component } from 'react';
import ReactDom from 'react-dom';

import styles from './canvas.css'
import lvl1 from './level1'

class Canvas extends Component {
  constructor(props) {
    super(props);
    this._startGame = this._startGame.bind(this);
    this.drawTiles = this.drawTiles.bind(this);
    this.drawTile = this.drawTile.bind(this);
  }
  _keystate = {};
  _canvas = undefined;
  _context = undefined;
  _loop: null;
  _ballRadius = 10;
  _x = this.props.width/2;
  _y = this.props.height-30;
  _dx = 4;
  _dy = -4;
  tileSize = 40;

  componentDidMount() {
    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Foorumi',
      this.props.width/2,
      this.props.height/2 );
    setTimeout(this._startGame, 500);
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

    this._loop = setInterval(() => {
      this._update();
      this._draw();
    },15);
  }

  _update() {
    // Put all computations of the new state here
    this._updateBall();
  }

  _draw() {
    // Only put drawing on the canvas element here.
    this._context.clearRect(0, 0, this.props.width, this.props.height);
    this.drawTiles();
    this._drawBall();
  }

  _drawBall() {
    this._context.beginPath();
    this._context.arc(this._x, this._y, this._ballRadius, 0, Math.PI*2);
    this._context.fillStyle = "#0095DD";
    this._context.fill();
    this._context.closePath();
  }

  drawTiles() {
    const self = this;
    this._context.fillStyle = "rgba(255,0,0,0.6)";
    this._context.strokeStyle = "black";
    lvl1.forEach(function(row,i){
      row.forEach(function(tile,j){
        if(tile !== 'o'){ //if tile is not walkable
          self.drawTile(j,i); //draw a rectangle at j,i
        }
      });
    });
  }

  drawTile(x,y){
    //console.log(x + y)
    //console.log(this.tilesize)
    //console.log('drawing tile at:')
    //console.log(x * this.tileSize)
    //console.log(y * this.tileSize)
    //const self = this
    this._context.fillRect(
      x * this.tileSize, y * this.tileSize,
      this.tileSize, this.tileSize
    );
    this._context.strokeRect(
      x * this.tileSize, y * this.tileSize,
      this.tileSize, this.tileSize
    );
  }

  _updateBall() {
    if(this._x + this._dx > this.props.width - this._ballRadius || this._x + this._dx < this._ballRadius) {
      this._dx = -this._dx;
    }

    if(this._y + this._dy > this.props.height - this._ballRadius || this._y + this._dy < this._ballRadius) {
      this._dy = -this._dy;
    }
    this._x += this._dx;
    this._y += this._dy;
  }

  render() {
    return (
      <canvas id="myCanvas" className={'canvas'} width={this.props.width} height={this.props.height}></canvas>
    );
  }
}

Canvas.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
}

export default Canvas;
