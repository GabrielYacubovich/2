// enemy.js
class Enemy {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 0.5 + 0.1; // Random speed between 0.1 and 0.6
    this.rotation = Math.random() * Math.PI * 2; // Random direction
    this.velocity = {
      x: Math.cos(this.rotation) * this.speed,
      y: Math.sin(this.rotation) * this.speed,
    };
    this.size = size;
    
    this.bullets = [];
    this.shooting = false;
    this.health = 2;
    this.target = null; // new property to store the player's spaceship
  }

  update(asteroids, player) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
     this.handleMovement(asteroids, player);
    this.handleShooting(player);
    this.handleBullets();
    for (const bullet of this.bullets) {
      bullet.draw(ctx);
    }
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
    for (const asteroid of asteroids) {
      if (this.checkCollisionWithAsteroid(asteroid)) {
        const angle = Math.atan2(this.y - asteroid.y, this.x - asteroid.x);
        this.x += Math.cos(angle) * this.size / 2;
        this.y += Math.sin(angle) * this.size / 2;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.moveTo(0, -this.size / 2);
    ctx.lineTo(this.size / 2, this.size / 2);
    ctx.lineTo(-this.size / 2, this.size / 2);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
  }
  handleMovement(player) {
    // Calculate the angle between the enemy and the player
    let angle = Math.atan2(this.y - player.y, this.x - player.x);
  
    // Move the enemy towards the player
    let dx = Math.cos(angle) * this.speed;
    let dy = Math.sin(angle) * this.speed;
    this.x -= dx;
    this.y -= dy;
    this.rotation = angle + Math.PI / 2;
  
    // Move this block outside the if statement
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  
  handleMovement(asteroids) {
    let targetAsteroid = null;
    let minDistance = Infinity;
    for (let asteroid of asteroids) {
      let distance = Math.sqrt((this.x - asteroid.x) ** 2 + (this.y - asteroid.y) ** 2);
      if (distance < minDistance && distance < this.size * 5) {
        minDistance = distance;
        targetAsteroid = asteroid;
      }
    }
  
    if (targetAsteroid) {
      let angle = Math.atan2(this.y - targetAsteroid.y, this.x - targetAsteroid.x);
      let dx = Math.cos(angle) * this.speed;
      let dy = Math.sin(angle) * this.speed;
      this.x += dx;
      this.y += dy;
      this.rotation = angle;
    }
      // Move this block outside the if statement
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
      
  }
  handleShooting(player) {
    // Calculate the angle between the enemy and the player
    const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
  
    // Rotate the enemy towards the player
    this.rotation = angleToPlayer - Math.PI / -2;
  
    // If the enemy is facing the player, shoot a bullet
    if (Math.abs(angleToPlayer - this.rotation) < Math.PI / 1) {
      if (!this.shooting) {
        this.shooting = true;
        this.bullets.push(new Bullet(this.x, this.y, this.rotation, false, false)); // Set isPlayerBullet to false
        setTimeout(() => this.shooting = false, 1500);
      }
    }
  }
  
  handleBullets() {
    if (!player) {
      return;
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];
      bullet.update();
      if (bullet.offscreen()) {
        this.bullets.splice(i, 1);
      } else {
        // check for collisions with player ship
        if (!bullet.isPlayerBullet && player.checkCollisionWithBullet(bullet)) {
          player.takeDamage(1, 'enemy');
          this.bullets.splice(i, 1);
        }
      }
    }
  }
    checkCollisionWithAsteroid(asteroid) {
    const dx = this.x - asteroid.x;
    const dy = this.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (this.size / 2) + (asteroid.size / 2);
    return distance < minDistance;
  }
  
  checkCollisionWithBullet(bullet) {
    let distance = Math.sqrt((this.x - bullet.x) ** 2 + (this.y - bullet.y) ** 2);
    return distance < this.size / 2 + bullet.size / 2;
  }

  takeDamage() {
    this.health--;
  }

  isDestroyed() {
    return this.health <= 0;
  }
  shoot() {
    this.bullets.push(new Bullet(this.x, this.y, this.angle, "enemy"));
  }
  shootAtPlayer(player) {
    if (this.shootTimer <= 0) {
      const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
      const bullet = new Bullet(this.x, this.y, angleToPlayer, false, false, "enemyBullet");
      this.shootTimer = this.baseShootTimer;
      return bullet;
    }
    this.shootTimer--;
    return null;
  }
  
}