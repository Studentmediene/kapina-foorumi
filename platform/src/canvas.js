import React, { Component } from 'react';
import ReactDom from 'react-dom';

import './canvas.css'
import Player, { PlayerState } from './Player'
import Bug from './Bug'
import AnimatedSprite from './AnimatedSprite'
import playerImage from './it-man-sprite.png'
import flippedPlayerImage from './it-man-sprite-flipped.png'
import './canvas.css'
import lvl1 from './level1'
import grassBlock from './grass-block.png'
import grassBlockLeft from './grass-block-left.png'
import grassBlockRight from './grass-block-right.png'
import cloud1 from './cloud1.png'
import cloud2 from './cloud2.png'
import cloud3 from './cloud3.png'
import coin from './rrcoin-sprite.png'
import bugSprite from './bug.png'

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
  bugs: null;
  coins: null;
  edges: null;
  maxWindowOffsetX = - lvl1[0].length * this.tileSize + this.TILES_IN_VIEW_X * this.tileSize


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

    // Initialize the player
    const image = new Image();
    const flippedImage = new Image();
    image.src = playerImage;
    flippedImage.src = flippedPlayerImage;
    this.player = new Player(this._context, 1344, 80, this.props.width, this.props.height,  image, flippedImage);
    this.player.x = this.props.width/2;
    this.player.y = this.props.height - 37*2 - this.player.hitBoxHeight/2;

    this.coins = [];
    lvl1.forEach((row,i) => {
      row.forEach((tile,j) => {
        if(tile == 'm'){ // If tile is not sky.
          const img = new Image();
          img.src = coin;
          const coinSprite = new AnimatedSprite(this._context, img, 308, 40, 7, j*this.tileSize, i*this.tileSize);
          this.coins.push(coinSprite);
        }
      });
    });
    
    this.edges = [];
    lvl1.forEach((row,i) => {
      row.forEach((tile,j) => {
        if(tile == '>' || tile == '<') { // If tile is not sky.
          this.edges.push({x: j * this.tileSize, y: i * this.tileSize});
        }
      });
    });
    console.log(this.edges);
    
    this.bugs = [];
    lvl1.forEach((row,i) => {
      row.forEach((tile,j) => {
        if(tile == 'b'){
          const bugImage = new Image();
          bugImage.src = bugSprite;
          const bug = new Bug(this._context, bugImage, lvl1[0].length * this.tileSize, this.props.height, j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize, this.edges);
          this.bugs.push(bug);
        }
      });
    });
    
    

    

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
    this.updateWindowOffset();
    this.updatePlayerPosition();
    this.updateBugPostition();
    this.updateCoins();
  }

  updateWindowOffset() {
    if (this.keystate[39]){ // Right pressed
      // If the player is moving on the left side, do nothing
      if(this.player.x < this.props.width/2){
        return;
      }
      this.windowOffset -= this.player.currentSpeedX
    } else if (this.keystate[37]) { // Left pressed
      // If the player is moving on the right side, do nothing
      if(this.player.x > this.props.width/2){
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
    this.player.update(this.keystate, this.windowOffset, this.maxWindowOffsetX);
  }

  updateCoins() {
    this.coins.forEach((coin) => {
      coin.update(this.windowOffset);
    })
  }

  updateBugPostition() {
    this.bugs.forEach((bug) =>{
      bug.update(this.windowOffset, this.maxWindowOffset);
      })
  }

  _draw() {
    // Only put drawing on the canvas element here.
    this._context.clearRect(0, 0, this.props.width, this.props.height); // Clear canvas
    this.drawTiles(); // Draw the tiles in the world
    this.drawPlayer(); // Draw the player
    this.drawBug();
    this.drawCoins();
  }

  drawBug(){
    this.bugs.forEach((bug) => {
      bug.draw();
    })
  }

  drawPlayer() {
    this.player.render();
  }

  drawCoins() {
    this.coins.forEach((coin) => {
      coin.draw();
    })
  }

  drawTiles() {
    lvl1.forEach((row,i) => {
      row.forEach((tile,j) => {
        if(tile !== 'o' || tile !== 'm'){ // If tile is not sky or money.
          this.drawTile(tile, j, i);
        }
      });
    });
  }

  drawTile(tileType, col, row){
    const img = new Image();
    let x = col * this.tileSize + this.windowOffset;
    let y = row * this.tileSize;
    let width = this.tileSize;
    let height = this.tileSize;

    if (tileType == '#') {
      img.src = grassBlock;
    }
    else if (tileType == '<') {
      img.src = grassBlockLeft;
    }
    else if (tileType == '>') {
      img.src = grassBlockRight;
    }
    else if (tileType == 'c1') {
      img.src = cloud1;
    }
    else if (tileType == 'c2') {
      img.src = cloud2;
    }
    else if (tileType == 'c3') {
      img.src = cloud3;
    }

    /* If the tile is a type of cloud */
    if (tileType.includes("c")) {
      width = width * 3;
      height = height * 2;
    }

    this._context.drawImage(img, x, y, width, height);
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
