export default class Bug {

  constructor(context, image, stageWidth, stageHeight, x, y, width, height) {
    this.context = context;
    this.image = image;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  windowOffset = 0;
  currentSpeedX = 4;
  currentSpeedY = 0;
  isBugJumping = false;
  bugMoveAmount = 0;

  update(windowOffset, maxWindowOffset) {
    this.windowOffset = windowOffset;
    this.x += this.currentSpeedX;

    if(this.x < 0 || this.x > this.stageWidth - this.width){
      this.currentSpeedX = -this.currentSpeedX;
    }

    if(!this.isBugJumping) {
        this.isBugJumping = true;
        this.currentSpeedY = -10;
      }
      if(this.isBugJumping) {
        if (this.currentSpeedY >= 0) {
          this.currentSpeedY += 1;
        }
        else {
          this.currentSpeedY += 1;
        }
        this.y += this.currentSpeedY;
        if (this.y + this.height > this.stageHeight - 40) {
          this.isBugJumping = false;
          this.currentSpeedY = 0;
        }
      }

  }

  draw() {
    this.context.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
      this.x + this.windowOffset,
      this.y,
      this.width,
      this.height
    );
  }

}
