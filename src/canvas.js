import React, { Component } from 'react';
import ReactDom from 'react-dom';

import './canvas.css'
import Player, { PlayerState } from './Player'
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
  _keystate = {};
  _canvas = undefined;
  _context = undefined;
  gameStarted = false;
  _ballRadius = 10;
  _x = this.props.width/2;
  _y = this.props.height-30;
  _dx = 8;
  _dy = -40;
  tileSize = 40;
  _windowOffsetX = 0;
  _windowOffsetY = 0;
  player: null;
  playerFlipped = true;
  playerWidth = 40;
  playerHeight = -80;

  _maxWindowOffsetX = - lvl1[0].length * this.tileSize + this.TILES_IN_VIEW_X * this.tileSize


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

    // If the game is already started, do nothing.
    if(this.gameStarted){
      return;
    }

    document.addEventListener('keydown', (evt) => {
      this._keystate[evt.keyCode] = true;
      //console.log('Key pressed')
    });
    document.addEventListener('keyup', (evt) => {
      // Do not delete, setting to undefined is faster.
      this._keystate[evt.keyCode] = undefined;
      //console.log('key up')
    });

    // Initialize the player
    const image = new Image();
    const flippedImage = new Image();
    image.src = playerImage;
    flippedImage.src = flippedPlayerImage;
    this.player = new Player(this._context, 1050, 80, image, flippedImage);
    this.player.x = this.props.width/2 - this.playerWidth/2;
    this.player.y = this.props.height - this.tileSize - this.player.height + 4;

    // Start the animation
    this.startTime = Date.now();
    this.then = this.startTime;
    this.gameStarted = true;
    this.animate()

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
    this._updateWindowOffset();
    this._updatePlayerPosition()
    //this._updateBall();
  }

  _updateWindowOffset() {
    //console.log(this._windowOffsetX)
    //console.log(lvl1[0].length * this.tileSize)
    if (this._keystate[39]){ // Right pressed
      // If the player is moving on the left side, do nothing
      if(this.player.x < this.props.width/2 - this.playerWidth/2){
        return;
      }
      this._windowOffsetX -= this._dx
    } else if (this._keystate[37]) { // Left pressed
      if(this.player.x > this.props.width/2 - this.playerWidth/2){
        return
      }
      this._windowOffsetX += this._dx
    }
    if (this._windowOffsetX > 0) {
      this._windowOffsetX = 0;
    } else if (this._windowOffsetX < this._maxWindowOffsetX){
      this._windowOffsetX = this._maxWindowOffsetX
    }
  }

  _updatePlayerPosition() {
    /**
     * Must be run after this._updateWindowOffset();
    */
    if(this._keystate[37]){ // Pressing left
      this.player.isFlipped = true;
      if (this.player.state !== PlayerState.JUMPING) {
        console.log('Now running')
        this.player.state = PlayerState.RUNNING;
      }
      if (this._windowOffsetX === 0) {
        // We are at the left edge
        //console.log('We are moving left, and are at the left edge')
        this.player.x -= this._dx
      } else if (this._windowOffsetX === this._maxWindowOffsetX) {
        // We are at the right edge
        //console.log('We are moving left and are at the right edge')
        this.player.x -= this._dx
      }
    } else if(this._keystate[39]){ // Pressing right
      this.player.isFlipped = false;

      if (this.player.state !== PlayerState.JUMPING) {
        console.log('Now running')
        this.player.state = PlayerState.RUNNING;
      }
      if (this._windowOffsetX === 0) {
        // We are at the left edge
        //console.log('We are moving right, and are at the left edge')
        this.player.x += this._dx
      }
      else if (this._windowOffsetX === this._maxWindowOffsetX) { // Right pressed
          // We are at the right edge
          //console.log('We are moving right and are at the right edge')
          this.player.x += this._dx
      }
    }

    // Handle jumping
    // If the player is not already jumping, and "up" is pressed...
    if(this.player.state !== PlayerState.JUMPING && this._keystate[38]) {
      this.player.state = PlayerState.JUMPING;
    }
    if(this.player.state === PlayerState.JUMPING) {
      this.player.y += this._dy;
      this._dy += 4;
      if(this.player.y > this.props.height - this.tileSize - this.player.height + 4){
        console.log('NOW STANDING')
        this.player.state = PlayerState.STANDING;
        this.player.y = this.props.height - this.tileSize - this.player.height + 4;
        this._dy = -40;
      }
    }

    // Handle cases where the player is about to leave the stage
    if(this.player.x < 0){
      console.log('Player hit left wall!')
      this.player.x = 0;
    } else if (this.player.x > this.props.width - this.playerWidth) {
      console.log('Player hit right wall!')
      this.player.x = this.props.width - this.playerWidth;
    }

    // Handle cases where the player runs past the middle of the screen
    if(this._windowOffsetX === 0 && this.player.x > this.props.width/2 - this.playerWidth/2){
      // We are at the left edge
      console.log('Player ran right across the middle!')
      this.player.x = this.props.width/2 - this.playerWidth/2
    } else if (this._windowOffsetX === this._maxWindowOffsetX && this.player.x < this.props.width/2 - this.playerWidth/2) {
      // We are at the right edge
      console.log('Player ran left across the middle!')
      this.player.x = this.props.width/2 - this.playerWidth/2
    }

    this.player.update();
  }

  _draw() {
    // Only put drawing on the canvas element here.
    this._context.clearRect(0, 0, this.props.width, this.props.height); // Clear canvas
    this.drawTiles(); // Draw the tiles in the world
    this.drawPlayer(); // Draw the player
  }

  drawPlayer() {

    this.player.render(this.playerFlipped);
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
                        this._windowOffsetX,
                        this._windowOffsetY); //draw a rectangle at j,i
        }
      });
    });
    this._context.fill();
    this._context.stroke();
    this._context.closePath();
  }

  drawTile(x,y, length, height, offsetX, offsetY){
    this._context.rect(
      x + offsetX, y + offsetY,
      height, length
    );
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
