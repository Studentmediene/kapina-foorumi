
import Rect from './Rect'

export const PlayerState = Object.freeze({
  STANDING: 'STANDING',
  RUNNING: 'RUNNING',
  JUMPING: 'JUMPING',
  THROWING: 'THROWING',
});



export default class Player {
  constructor(context, width, height, stageWidth, stageHeight, image, flippedImage) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.image = image;
    this.flippedImage = flippedImage;
    this.update = this.update.bind(this);
  }

  // Indexes used to render the correct sprite on canvas
  standIndex = 0;
  runStartIndex = 1;
  runEndIndex = 8;
  throwStartIndex = 9;
  throwEndIndex = 11;
  jumpStartIndex = 12;
  jumpEndIndex = 13;

  // Fields containing the current state of sprite
  frameIndex = 0;
  tickCount = 0;
  ticksPerFrame = 5;
  numberOfFrames = 14;
  spriteWidth = 96;
  spriteHeight = 80;

  // Fields containing the state of the player
  x = 0; // left side of the player
  y = 0; // The top of the player
  currentSpeedX = 8;
  currentSpeedY = 8;

  hitBoxWidth = 40;
  hitBoxHeight = 80;

  rect = new Rect(0, 0, 40, 80);

  state = PlayerState.STANDING;


  render = function () {
    let image = this.image;
    if (this.isFlipped) {
      image = this.flippedImage;
    }
    this.context.drawImage(
      image,
      this.frameIndex * this.width / this.numberOfFrames, // Start clip x of image
      0, // Start y clip of image
      this.width / this.numberOfFrames, // End x clip of image
      this.height, // End y clip of image
      this.x + this.hitBoxWidth / 2 - this.spriteWidth/2, // Start x on canvas
      this.y, // Start y on canvas
      this.width / this.numberOfFrames, // Width on canvas
      this.height // Height on canvas
    );
  };

  update(keystate, windowOffset, maxWindowOffset, collisionRects) {

    /**
     * Must be run after this._updateWindowOffset();
    */

    /*

    // If the player collides set the current Y speed to 0. Otherwise accelerate the player towards the ground.
    if (collisionBottom) {
      this.currentSpeedY = 0;
      this.state = PlayerState.STANDING; // The player has landed.
    }
    else {
      this.currentSpeedY += 2;
    }


    console.log(this.state);
    // If the player is not already jumping, and "up" is pressed
    if(this.state !== PlayerState.JUMPING && keystate[38]) {
      this.state = PlayerState.JUMPING;
      this.currentSpeedY += -20;
    }
    // If left is pressed
    else if (keystate[37]) {
      this.isFlipped = true;
      // Accelerate in the left direction if max speed is not reached.
      if (this.currentSpeedX > -10) {
        this.currentSpeedX -= 2;
      }
    }
    // If right is pressed
    else if (keystate[39] && !collisionRight) {
      this.isFlipped = false;
      // Accelerate in the right direction if max speed is not reached.
      if (this.currentSpeedX < 10) {
        this.currentSpeedX += 2;
      }
    }

    // Motion in the X-axis without motion in the Y-axis, means we are RUNNING
    if (this.currentSpeedX != 0 && this.currentSpeedY == 0 && this.state != PlayerState.JUMPING) {
      this.state = PlayerState.RUNNING;
    }

    // Deaccelerate in the x direction
    if (this.currentSpeedX < 0) {
      this.currentSpeedX += 1;
    }
    else if (this.currentSpeedX > 0) {
      this.currentSpeedX -= 1;
    }

    // Increment x and y with the current speeds
    this.x += this.currentSpeedX;
    this.y += this.currentSpeedY;
    this.rect.x = this.x;
    this.rect.y = this.y;

    */
    // Find out if the player collides with any of the rectangles
    const collision = {
      up: false,
      bottom: false,
      left: false,
      right: false,
    }

    collisionRects.forEach(rect => {

      let col = rect.isCollidingWith(this)
      //console.log(col)
      if (col.bottom) {
        console.log('Colliding bottom!')
        collision.bottom = true;
      }
      if (col.right) {
        console.log('Colliding right!')
        collision.right = true;
      }
      if (col.up) {
        console.log('Colliding up!')
        collision.up = true;
      }
      if (col.left) {
        console.log('Colliding left!')
        collision.left = true;
      }
      }
    )



    if(keystate[37]){ // Pressing left
      this.isFlipped = true;
      // If we are not jumping, then we are running
      if (this.state !== PlayerState.JUMPING) {
        this.state = PlayerState.RUNNING;
      }
      if (windowOffset === 0) {
        // We are at the left edge
        //console.log('We are moving left, and are at the left edge')
        if(!collision.left){
          this.x -= this.currentSpeedX;
        }
      } else if (windowOffset === maxWindowOffset) {
        // We are at the right edge
        //console.log('We are moving left and are at the right edge')
        if(!collision.left){
          this.x -= this.currentSpeedX;
        }
      }
    } else if(keystate[39]){ // Pressing right
      this.isFlipped = false;
      // If we are not jumping, then we are running
      if (this.state !== PlayerState.JUMPING) {
        this.state = PlayerState.RUNNING;
      }
      if (windowOffset === 0) {
        // We are at the left edge
        //console.log('We are moving right, and are at the left edge')
        if(!collision.right){
          this.x += this.currentSpeedX
        }
      } else if (windowOffset === maxWindowOffset) {
          // We are at the right edge
          //console.log('We are moving right and are at the right edge')
          if(!collision.right){
            this.x += this.currentSpeedX
          } else {
            console.log('Colliding right!')
          }
      }
    } else if(this.state !== PlayerState.JUMPING) {
      // If we aren't running or jumping, then we are standing
      this.state = PlayerState.STANDING;
    }

    // Handle jumping
    // If the player is not already jumping, and "up" is pressed...
    if(this.state !== PlayerState.JUMPING && keystate[38]) {
      this.state = PlayerState.JUMPING;
    }
    if(this.state === PlayerState.JUMPING) {
      if(collision.up) {
        this.y += Math.abs(this.currentSpeedY);
        this.currentSpeedY += 4;
      } else if (collision.bottom){
        this.state = PlayerState.STANDING;
        this.currentSpeedY = -40;
      } else {
        this.y += this.currentSpeedY;
        this.currentSpeedY += 4;
      }
    }

    // Handle cases where the player is about to leave the stage
    if(this.x < 0){
      console.log('Player hit left wall!')
      this.x = 0;
    } else if (this.x > this.stageWidth - this.hitBoxWidth) {
      console.log('Player hit right wall!')
      this.x = this.stageWidth - this.hitBoxWidth;
    }

    // Handle cases where the player runs past the middle of the screen
    if(windowOffset === 0 && this.x > this.stageWidth / 2 - this.hitBoxWidth / 2){
      // We are at the left edge
      console.log('Player ran in the right direction across the middle!')
      this.x = this.stageWidth / 2 - this.hitBoxWidth / 2
    } else if (windowOffset === maxWindowOffset && this.x < this.stageWidth/2 - this.hitBoxWidth / 2) {
      // We are at the right edge
      console.log('Player ran left across the middle!')
      this.x = this.stageWidth / 2 - this.hitBoxWidth / 2;
    }

    // Update sprite
    if (this.state === PlayerState.RUNNING) {
      this.updateRun()
    } else if (this.state === PlayerState.JUMPING) {
      this.updateJump()
    } else if (this.state === PlayerState.THROWING) {
      this.updateThrow()
    } else {
      this.updateStand()
    }
  }


  _update = function (startIndex, endIndex) {
    if (!this.isFlipped) {
        if (this.frameIndex < startIndex || this.frameIndex > endIndex) {
          this.frameIndex = startIndex;
        }
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;
          if (this.frameIndex < endIndex) {
            this.frameIndex += 1;
          }
          else {
            this.frameIndex = startIndex;
          }
        }
    }
    else {
      /* Adjust the indexes to the flipped image */
      startIndex = this.numberOfFrames - startIndex - 1;
      endIndex = this.numberOfFrames - endIndex - 1;
      //console.log(startIndex, endIndex);
      if (this.frameIndex > startIndex || this.frameIndex < endIndex) {
        this.frameIndex = startIndex;
      }
      this.tickCount += 1;
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        if (this.frameIndex > endIndex) {
          this.frameIndex -= 1;
        }
        else {
          this.frameIndex = startIndex;
        }
      }
    }

  }


  /*
    Cycles through the running sprites.
  */
  updateRun = function () {
    this._update(this.runStartIndex, this.runEndIndex);
  };

  /*
    Chooses the index for the stand sprite to be the active frameindex.
  */
  updateStand = function () {
    if (this.isFlipped) {
      this.frameIndex = this.numberOfFrames - this.standIndex - 1;
    }
    else {
      this.frameIndex = this.standIndex;
    }
  }


  /*
    Cycles through the throwing sprites.
  */
  updateThrow = function() {
    this._update(this.throwStartIndex, this.throwEndIndex);
  }

  updateJump = function() {
    this._update(this.jumpStartIndex, this.jumpEndIndex);
  }

}
