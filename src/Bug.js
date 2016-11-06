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

    this.bugMoveAmount += 1;
    if(this.bugMoveAmount % 3 == 0 ) {
      if(!this.isBugJumping) {
        this.isBugJumping = true;
      }
      if(this.isBugJumping) {
        this.y += this.currentSpeedY;
        this.currentSpeedY += 16;
        if(this.y > this.stageHeight - 80){
          this.isBugJumping = false;
          this.y = this.stageHeight - 80;
          this.currentSpeedY = -40;
        }
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
