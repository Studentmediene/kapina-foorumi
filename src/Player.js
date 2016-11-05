
var Player = function (context, width, height, image, flippedImage) {
  this.context = context;
  this.width = width;
  this.height = height;
  this.image = image;
  this.flippedImage = flippedImage;

  this.standIndex = 0;
  this.runStartIndex = 1;
  this.runEndIndex = 8;
  this.throwStartIndex = 9;
  this.throwEndIndex = 11;
  this.jumpStartIndex = 12;
  this.jumpEndIndex = 13;

  this.frameIndex = 0;
  this.tickCount = 0;
  this.ticksPerFrame = 5;
  this.numberOfFrames = 14;

};

Player.prototype.render = function (flipped) {
  console.log('Drawing image')
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

Player.prototype._update = function (startIndex, endIndex, flipped) {
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
    console.log(startIndex, endIndex);
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
Player.prototype.updateRun = function (flipped) {
  this._update(this.runStartIndex, this.runEndIndex, flipped);
};

/*
  Chooses the index for the stand sprite to be the active frameindex.
*/
Player.prototype.updateStand = function (flipped) {
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
Player.prototype.updateThrow = function(flipped) {
  this._update(this.throwStartIndex, this.throwEndIndex, flipped);
}

Player.prototype.updateJump = function(flipped) {
  this._update(this.jumpStartIndex, this.jumpEndIndex, flipped);
}



export default Player;
