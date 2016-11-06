



export default class Rect {

  constructor(x, y, width, height, row, tile) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.row = row;
    this.tile = tile;
  }



  isCollidingWith = function(player, offset) {

    const collision = {
      top: false,
      bottom: false,
      right: false,
      left: false,
    };
    //console.log('Player position: x:' + (player.x + - offset) + ' to ' + (player.x + - offset + player.hitBoxWidth) + ', y:' + player.y + ' to ' + (player.y + player.hitBoxHeight))
    if (this.x <= player.x + player.hitBoxWidth - offset &&
        player.x - offset <= this.x + this.width &&
        this.y <= player.y + player.hitBoxHeight &&
        player.y <= this.y + this.height) {
          // The rectangle is colliding with the player
          //console.log('Colliding!')
      if (this.x < player.x + player.hitBoxWidth - offset &&
          this.x + this.width > player.x + player.hitBoxWidth - offset) {
        //console.log('Collision on the right!')
        collision.right = {
          x: this.x,
          y: this.y
        };
      }
      if (player.x - offset < this.x + this.width &&
          player.x - offset > this.x) {
        //console.log('Collision on the left!')
        collision.left = {
          x: this.x,
          y: this.y
        };
      }
      if (this.y < player.y + player.hitBoxHeight &&
          this.y + this.height > player.y + player.hitBoxHeight) {
        //console.log('Collision on the bottom')
        collision.bottom = {
          x: this.x,
          y: this.y,
        };
      }
      if (this.y + this.height < player.y &&
          this.y < player.y) {
        //console.log('Collision on the top')
        collision.top = {
          x: this.x,
          y: this.y
        };
      }
    }
    return collision;
  };

}
