



export default class Rect {

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }



  isCollidingWith = function(player) {

    const collision = {
      top: false,
      bottom: false,
      right: false,
      left: false,
    };

    if (this.x < player.x + player.hitboxWidth &&
        this.x + this.width > player.x &&
        this.y < player.y + player.hitboxHeight &&
        this.y + this.height > player.y) {
          // The rectangle is colliding with the player
          console.log('Collision!')
      if (this.x < player.x + player.hitBoxwidth) collision.right = true;
      if (this.x + this.height > player.x) collision.left = true;
      if (this.y < player.y + player.hitBoxHeight) collision.bottom = true;
      if (this.y + this.height > player.y) collision.top = true;
    }
    return collision;
  };

}
