
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
  x = 0; // The centre of the player
  y = 0; // The centre of the player
  currentSpeedX = 8;
  currentSpeedY = -40;

  hitBoxWidth = 40;
  hitBoxHeight = 80;


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
      this.x - this.spriteWidth/2, // Start x on canvas
      this.y, // Start y on canvas
      this.width / this.numberOfFrames, // Width on canvas
      this.height // Height on canvas
    );
    /*this.context.strokeRect(
      this.x - this.hitBoxWidth/2,
      this.y,
      this.hitBoxWidth,
      this.hitBoxHeight);*/
  };

  update(keystate, windowOffset, maxWindowOffset) {

    /**
     * Must be run after this._updateWindowOffset();
    */
    if(keystate[37]){ // Pressing left
      this.isFlipped = true;
      // If we are not jumping, then we are running
      if (this.state !== PlayerState.JUMPING) {
        this.state = PlayerState.RUNNING;
      }
      if (windowOffset === 0) {
        // We are at the left edge
        //console.log('We are moving left, and are at the left edge')
        this.x -= this.currentSpeedX;
      } else if (windowOffset === maxWindowOffset) {
        // We are at the right edge
        //console.log('We are moving left and are at the right edge')
        this.x -= this.currentSpeedX;
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
        this.x += this.currentSpeedX
      } else if (windowOffset === maxWindowOffset) {
          // We are at the right edge
          //console.log('We are moving right and are at the right edge')
          this.x += this.currentSpeedX
      }
    } else if(this.state !== PlayerState.JUMPING) {
      this.state = PlayerState.STANDING;
    }

    // Handle jumping
    // If the player is not already jumping, and "up" is pressed...
    if(this.state !== PlayerState.JUMPING && keystate[38]) {
      this.state = PlayerState.JUMPING;
    }
    if(this.state === PlayerState.JUMPING) {
      this.y += this.currentSpeedY;
      this.currentSpeedY += 4;
      if(this.y > this.stageHeight - 37*2 - this.hitBoxHeight/2){
        this.state = PlayerState.STANDING;
        this.y = this.stageHeight - 37*2 - this.hitBoxHeight/2;
        this.currentSpeedY = -40;
      }
    }

    // Handle cases where the player is about to leave the stage
    if(this.x < this.hitBoxWidth/2){
      console.log('Player hit left wall!')
      this.x = this.hitBoxWidth/2;
    } else if (this.x > this.stageWidth - this.hitBoxWidth/2) {
      console.log('Player hit right wall!')
      this.x = this.stageWidth - this.hitBoxWidth/2;
    }

    // Handle cases where the player runs past the middle of the screen
    if(windowOffset === 0 && this.x > this.stageWidth/2){
      // We are at the left edge
      console.log('Player ran in the right direction across the middle!')
      this.x = this.stageWidth/2
    } else if (windowOffset === maxWindowOffset && this.x < this.stageWidth/2) {
      // We are at the right edge
      console.log('Player ran left across the middle!')
      this.x = this.stageWidth/2;
    }


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
