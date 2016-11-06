



export default class Rect {
  
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  
  
  isCollidingWith = function(rect) {
    
    let collision = {
      top: false,
      bottom: false,
      right: false,
      left: false,
    };
    
    if (this.x < rect.x + rect.width &&
        this.x + this.width > rect.x &&
        this.y < rect.y + rect.height &&
        this.height + this.y > rect.y) {
      if (this.x < rect.x && !(this.y + this.height < rect.y - 20)) collision.right = true;
      if (this.x > rect.x) collision.left = true;
      if (this.y < rect.y) collision.bottom = true;
      if (this.y > rect.y) collision.top = true;
    }
    return collision;
  };
  
}



