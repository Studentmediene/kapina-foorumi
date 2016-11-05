
export default class Player {
  constructor(context, width, height, image, flippedImage) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.image = image;
    this.flippedImage = flippedImage;
  }

  standIndex = 0;
  runStartIndex = 1;
  runEndIndex = 8;
  throwStartIndex = 9;
  throwEndIndex = 11;
  jumpStartIndex = 12;
  jumpEndIndex = 13;

  frameIndex = 0;
  tickCount = 0;
  ticksPerFrame = 5;
  numberOfFrames = 14;


  /*
    Cycles through the running sprites.
  */
  updateRun = function (flipped) {
    this._update(this.runStartIndex, this.runEndIndex, flipped);
  };

  render = function (flipped) {
    let image = this.image;
    if (flipped) {
      image = this.flippedImage;
    }
    this.context.drawImage(
      image,
      this.frameIndex * this.width / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      0,
      0,
      this.width / this.numberOfFrames,
      this.height
    );
  };


  _update = function (startIndex, endIndex, flipped) {
    if (!flipped) {
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
    Chooses the index for the stand sprite to be the active frameindex.
  */
  updateStand = function (flipped) {
    if (flipped) {
      this.frameIndex = this.numberOfFrames - this.standIndex - 1;
    }
    else {
      this.frameIndex = this.standIndex;
    }
  }


  /*
    Cycles through the throwing sprites.
  */
  updateThrow = function(flipped) {
    this._update(this.throwStartIndex, this.throwEndIndex, flipped);
  }

  updateJump = function(flipped) {
    this._update(this.jumpStartIndex, this.jumpEndIndex, flipped);
  }

}
