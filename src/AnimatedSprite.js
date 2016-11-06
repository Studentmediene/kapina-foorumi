
export default class AnimatedSprite {
  
  constructor(context, image, imageWidth, imageHeight, numberOfFrames, x, y) {
    this.context = context;
    this.image = image;
    this.numberOfFrames = numberOfFrames;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.x = x;
    this.y = y;
  }
  
  frameIndex = 0;
  tickCount = 0;
  ticksPerFrame = 5;
  windowOffset = 0;
  
  update(windowOffset) {
    this.windowOffset = windowOffset;
    if (this.frameIndex < 0 || this.frameIndex > this.numberOfFrames) {
          this.frameIndex = 0;
        }
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;
          if (this.frameIndex < this.numberOfFrames - 1) {
            this.frameIndex += 1;
          }
          else {
            this.frameIndex = 0;
          }
        }
  }
  
  draw() {
    this.context.drawImage(
      this.image,
      this.frameIndex * this.imageWidth / this.numberOfFrames,
      0,
      this.imageWidth / this.numberOfFrames,
      this.imageHeight,
      this.x + this.windowOffset,
      this.y,
      this.imageWidth / this.numberOfFrames,
      this.imageHeight
    );
  }
  
}