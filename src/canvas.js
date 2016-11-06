import React, { Component } from 'react';
import ReactDom from 'react-dom';

import './canvas.css'
import Player, { PlayerState } from './Player'
import Rect from './Rect'
import playerImage from './it-man-sprite.png'
import flippedPlayerImage from './it-man-sprite-flipped.png'
import './canvas.css'
import lvl1 from './level1'

class Canvas extends Component {
  constructor(props) {
    super(props);
    this._startGame = this._startGame.bind(this);
    this.animate = this.animate.bind(this);
  }

  // Fields handling the speed of the game loop
  fps = 50;
  fpsInterval = 1000/this.fps;
  startTime = undefined;
  then = undefined;

  TILES_IN_VIEW_X = 16;
  keystate = {};
  canvas = undefined;
  _context = undefined;
  gameStarted = false;
  tileSize = 40;
  windowOffset = 0;
  player: null;
  collisionRects: undefined;
  boardWidth: 0;

  maxWindowOffsetX = - lvl1[0].length * this.tileSize + this.TILES_IN_VIEW_X * this.tileSize

  offsetX: 0;
  offsetY: 0;
  
  
  componentDidMount() {
    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Foorumi',
      this.props.width/2,
      this.props.height/2 );
    setTimeout(this._startGame, 500);
  }



  _setupCanvas() {
    this.canvas = ReactDom.findDOMNode(this);
    this._context = this.canvas.getContext('2d');
  }

  _startGame() {

    // If the game is already started, do nothing.
    if(this.gameStarted){
      return;
    }

    document.addEventListener('keydown', (evt) => {
      this.keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', (evt) => {
      // Do not use delete, setting to undefined is faster.
      this.keystate[evt.keyCode] = undefined;
    });
    this.boardSize = lvl1[0].length * this.tileSize;
    // Initialize the player
    const image = new Image();
    const flippedImage = new Image();
    image.src = playerImage;
    flippedImage.src = flippedPlayerImage;
    this.player = new Player(this._context, 1344, 80, this.props.width, this.props.height,  image, flippedImage);
    this.player.x = this.props.width / 2;
    this.player.y = this.props.height - 37*2 - this.player.hitBoxHeight / 2;
    this.player.rect.x = this.player.x - this.player.hitBoxWidth / 2;
    this.player.rect.y = this.player.y - this.player.hitBoxHeight / 2;
    this.collisionRects = [];
    this.makeCollisionRects();

    // Start the animation
    this.startTime = Date.now();
    this.then = this.startTime;
    this.gameStarted = true;
    this.animate();

  }

  animate() {

    // calc elapsed time since last loop
    const now = Date.now();
    const elapsed = now - this.then;

    if (elapsed > this.fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        this.then = now - (elapsed % this.fpsInterval);

        // Update the state of the game for the next frame
        this._update();
        // Draw the next frame
        this._draw();
    }
      // request another frame
      requestAnimationFrame(this.animate);
  }

  _update() {
    // Put all computations of the new state here
    this.updateWindowOffset();
    this.makeCollisionRects();
    this.updatePlayerPosition();
    
  }

  updateWindowOffset() {
    
    if (this.keystate[39]){ // Right pressed
      // If the player is moving on the left side, do nothing
      if(this.player.rect.x < this.props.width/2){
        return;
      }
      this.windowOffset -= this.player.currentSpeedX
    } else if (this.keystate[37]) { // Left pressed
      // If the player is moving on the right side, do nothing
      if(this.player.rect.x > this.props.width/2){
        return
      }
      this.windowOffset += this.player.currentSpeedX
    }

    // Handle situations when the window is on the edge of the map
    if (this.windowOffset > 0) {
      this.windowOffset = 0;
    } else if (this.windowOffset < this.maxWindowOffsetX){
      this.windowOffset = this.maxWindowOffsetX
    }
  }

  updatePlayerPosition() {
    this.player.update(this.keystate, this.windowOffset, this.maxWindowOffsetX, this.collisionRects);
  }

  _draw() {
    // Only put drawing on the canvas element here.
    this._context.clearRect(0, 0, this.props.width, this.props.height); // Clear canvas
    this.drawTiles(); // Draw the tiles in the world
    this.drawPlayer(); // Draw the player
  }

  drawPlayer() {
    this.player.render();
  }

  drawTiles() {
    this._context.beginPath();
    this._context.lineWidth = 1;
    this._context.fillStyle = "rgba(255,0,0,0.6)";
    this._context.strokeStyle = "black";
    lvl1.forEach((row,i) => {
      row.forEach((tile,j) => {
        if(tile !== 'o'){ //if tile is not walkable
          this.drawTile(j * this.tileSize,
                        i * this.tileSize,
                        this.tileSize,
                        this.tileSize,
                        this.windowOffset); //draw a rectangle at j,i
        }
      });
    });
    this._context.fill();
    this._context.stroke();
    this._context.closePath();
  }

  drawTile(x,y, length, height, offsetX){
    this._context.rect(
      x + offsetX, y,
      height, length
    );
    
  }
  
  // Generate the collisionrects from the # tiles.
  makeCollisionRects() {
    this.collisionRects = [];
    lvl1.forEach((row, i) => {
      row.forEach((tile, j) => {
        if (tile == '#') {
            this.collisionRects.push(new Rect(j * this.tileSize + this.windowOffset, i * this.tileSize, this.tileSize, this.tileSize));
        }
      })
    })
  }


  render() {
    return (
      <canvas id="myCanvas" className={'canvas'} width={this.props.width} height={this.props.height}>
        Your browser is not good enough to play our amazing game.
      </canvas>
    );
  }
}

Canvas.propTypes = {
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
}

export default Canvas;
