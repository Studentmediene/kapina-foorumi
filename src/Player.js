
export const PlayerState = Object.freeze({
  STANDING: 'STANDING',
  RUNNING: 'RUNNING',
  JUMPING: 'JUMPING',
  THROWING: 'THROWING',
});



export default class Player {
  constructor(context, width, height, image, flippedImage) {
    this.context = context;
    this.width = width;
    this.height = height;
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

  // Fields containing the state of the player
  x = 0;
  y = 0;
  currentSpeedX = 0;
  currentSpeedY = 0;

  playerHitBoxWidth = 40;
  playerHitBoxHeight = 80;

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
      this.x, // Start x
      this.y, // Start y
      this.width / this.numberOfFrames, // Width on canvas
      this.height // Height on canvas
    );
  };

  update() {
    if (this.state == PlayerState.RUNNING) {
      this.updateRun()
    } else if (this.state == PlayerState.JUMPING) {
      this.updateJump()
    } else if (this.state == PlayerState.THROWING) {
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
