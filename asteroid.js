// asteroid.js
class Asteroid {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.rotation = Math.random() * 2 * Math.PI; // set initial rotation angle randomly
    this.acceleration = 0.01;
    this.thrustX = 0;
    this.thrustY = 0;
}


    update() {
      // Apply acceleration in a random direction
      const angle = Math.random() * 2 * Math.PI;
      this.thrustX += this.acceleration * Math.sin(angle);
      this.thrustY -= this.acceleration * Math.cos(angle);
  
      // Update position based on velocity and thrust
      this.x += this.speed * Math.sin(this.rotation) + this.thrustX;
      this.y -= this.speed * Math.cos(this.rotation) + this.thrustY;
  
      // Reduce thrust over time to avoid accelerating forever
      this.thrustX *= 0.99;
      this.thrustY *= 0.99;
  
      // Wrap around screen edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
  }
  
  
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white'; // Set the stroke color to white
    ctx.stroke(); // Stroke the outline of the asteroid
    ctx.restore();
      ctx.lineWidth = 2;

  }
  
  
  // In the Asteroid class:
checkCollisionWithBullet(bullet) {
  if (bullet.isPlayerBullet) {
    let distance = Math.sqrt((this.x - bullet.x) ** 2 + (this.y - bullet.y) ** 2);
    return distance < this.size / 2 + bullet.size / 2;
  }
  return false;
}

  
    breakIntoSmallerAsteroids() {
      if (this.size > 25) {
        return [
          new Asteroid(this.x, this.y, this.size / 2, this.speed * 1.5),
          new Asteroid(this.x, this.y, this.size / 2, this.speed * 1.5),
        ];
      }
      return [];
    }
  
    offscreen() {
      return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
    }
    isDestroyed() {
        return this.markForDeletion;
    }   
  }