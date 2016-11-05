



var Player = function (context, width, height, image) {
  this.context = context;
  this.width = width;
  this.height = height;
  this.image = image;

  this.running = false;

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

Player.prototype.render = function () {
  console.log('Drawing image')
  this.context.drawImage(
    this.image,
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

Player.prototype._update = function (startIndex, endIndex) {
  if (this.frameIndex < startIndex || this.frameIndex > endIndex) {
    this.frameIndex = this.startIndex;
  }
  this.tickCount += 1;
  if (this.tickCount > this.ticksPerFrame) {
    console.log(this.frameIndex);

    this.tickCount = 0;
    if (this.frameIndex < endIndex) {
      this.frameIndex += 1;
    }
    else {
      this.frameIndex = startIndex;
    }
  }
}

/*
  Cycles through the running sprites.
*/
Player.prototype.updateRun = function () {
  this._update(this.runStartIndex, this.runEndIndex);
};

/*
  Chooses the index for the stand sprite to be the active frameindex.
*/
Player.prototype.updateStand = function () {
  this.frameIndex = this.standIndex;
}

/*
  Cycles through the throwing sprites.
*/
Player.prototype.updateThrow = function() {
  this._update(this.throwStartIndex, this.throwEndIndex);
}



export default Player;
