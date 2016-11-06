import lvl1 from './level1'


export default class Bug {

  constructor(context, image, stageWidth, stageHeight, x, y, width, height, edges) {
    this.context = context;
    this.image = image;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.edges = edges;
  }

  windowOffset = 0;
  currentSpeedX = 4;
  currentSpeedY = 0;
  isBugJumping = false;
  bugMoveAmount = 0;
  
  
  getTileAt(row, col) {
    return lvl1[row][col];
  }

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
    

    var turn = false;
    this.edges.forEach((tile) => {
      console.log(tile.y, this.y);
      if (tile.y > this.y) {
        const diff = Math.abs(tile.x - this.x);
        
        
        
        if (diff < 10) {
          
          if (this.x < tile.x && this.currentSpeedX > 0 || this.x > tile.x && this.currentSpeedX < 0) {
            turn = true;
          }
          
          
        }
      }
    });
    
    if(turn) {
      this.currentSpeedX = -this.currentSpeedX;
    }
    
  
    
    /*const tileRow1 = Math.floor(this.y / this.height) + 1;
    const tileRow2 = tileRow1 + 1;
    var tileCol = Math.round(this.x / this.width);
    
    if (this.currentSpeedX > 0) {
      tileCol += 1;
    }
    else if (this.currentSpeedX < 0) {
      tileCol -= 1;
    }
    
    const tile = this.getTileAt(tileRow1, tileCol);
    var tile2 = 'x';
    if (tileRow2 < lvl1.length) {
      const tile2 = this.getTileAt(tileRow2, tileCol);
    }
    
    if (tile == '<' || tile == '>' || tile2 == '<' || tile2 == '>') {
      this.currentSpeedX = -this.currentSpeedX;
    }
    
    console.log(tile, tile2);
    */
    

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
