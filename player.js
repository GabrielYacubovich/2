// player.js
class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.width = 30;
    this.height = 30;
    this.lives = 3;
    this.speed = 5;
    this.rotation = 0;
    this.bullets = [];
    this.shooting = false;
    this.invulnerable = false;
    this.invulnerabilityTime = 0;
    this.doubleShooting = false;
    this.doubleShootingTime = 0;
    this.acceleration = 0.1;
    this.thrustX = 0;
    this.thrustY = 0;
    this.collidedWithAsteroid = false;
    this.collisionDelay = 0;
    this.collidedWithEnemy = false;
    this.originalBulletSpeed = 10;
    this.bulletSpeed = this.originalBulletSpeed;
    this.doubleShootingLost = false; 
    this.backfrontShooting = false;
    this.backfrontShootingTime = 0;
    this.backfrontShootingDuration = 10000; 
  }
  resetPowerupEffects() {
    this.invulnerable = false;
    this.doubleShooting = false;
  }
  takeDamage(hits, source) {
    if (this.collisionDelay === 0 && !this.invulnerable) {
      this.lives -= hits;
      lives--;
      this.reset();
      this.resetPowerupEffects(); // Add this line
      this.collisionDelay = 30;
      if (this.lives <= 0) {
        gameOver();
      }
    }
  }
  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.rotation = 0;
    this.speed = 5;
    this.velocity = { x: 0, y: 0 };
    this.invulnerable = false;
    this.thrust = false;
    this.invulnerabilityTime = 1;
    this.doubleShooting = false;
    this.doubleShootingTime = 0;
    this.thrustX = 0;
    this.thrustY = 0;
    this.lives = 3;
    this.bulletSpeed = this.originalBulletSpeed;
    this.backfrontShooting = false;
  }
  update() {
    this.handleMovement();
    this.handleShooting();
    this.handleBullets();
    this.checkInvulnerability();
    this.checkDoubleShooting();
    if (this.doubleShooting && Date.now() - this.doubleShootingTime > 10000) {
      this.doubleShooting = false;
      this.doubleShootingTime = 0;
      this.bulletSpeed = this.originalBulletSpeed;
      this.doubleShootingLost = true;
    }
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
    if (player.collisionDelay > 0) {
      player.collisionDelay--;
    }
    if (this.backfrontShooting) {
      if (Date.now() - this.backfrontShootingTime > this.backfrontShootingDuration) {
        this.backfrontShooting = false;
      }
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.closePath();
  if (this.invulnerable) {
    ctx.strokeStyle = 'green';
  } else if (this.doubleShooting) {
    ctx.strokeStyle = 'orange';
  } else if (this.backfrontShooting) {
    ctx.strokeStyle = 'pink';
  }else {
    ctx.strokeStyle = 'white';
  }
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
  handleMovement() {
    const angle = this.rotation;
    if (keys['ArrowUp']) {
      this.thrustX += this.acceleration * Math.sin(angle);
      this.thrustY -= this.acceleration * Math.cos(angle);
    } else {
      this.thrustX *= 0.99;
      this.thrustY *= 0.99;
    }
    this.x += this.thrustX;
    this.y += this.thrustY;
    if (keys['ArrowRight']) {
      this.rotation += 0.05;
    }
    if (keys['ArrowLeft']) {
      this.rotation -= 0.05;
    }
  }
  handleShooting() {
    if (keys['Space'] && !this.shooting) {
      this.shooting = true;
      this.bullets.push(new Bullet(this.x, this.y, this.rotation, this.doubleShooting, true, "", this.bulletSpeed));
      if (this.backfrontShooting) {
        this.bullets.push(new Bullet(this.x, this.y, this.rotation + Math.PI, this.doubleShooting, true, "", this.bulletSpeed));
      }
      setTimeout(() => (this.shooting = false), 250);
    }
  }
  handleBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update();
      if (bullet.offscreen()) {
        this.bullets.splice(i, 1);
      }
    }
  }
  checkInvulnerability() {
    if (this.invulnerable && Date.now() - this.invulnerabilityTime > 10000) {
      this.invulnerable = false;
    }
  }
  checkDoubleShooting() {
    if (this.doubleShooting && Date.now() - this.doubleShootingTime > 10000) {
      this.doubleShooting = false;
      this.bulletSpeed = this.originalBulletSpeed;
    }
  }
  checkCollisionWithAsteroid(asteroid) {
    const dx = this.x - asteroid.x;
    const dy = this.y - asteroid.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (this.width / 2) + (asteroid.size / 2);
    return distance < minDistance;
  }
  checkCollisionWithPowerup(powerup) {
    const dx = this.x - powerup.x;
    const dy = this.y - powerup.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (this.width / 2) + (powerup.width / 2);
    return distance < minDistance;
  }
  checkCollisionWithBullet(bullet) {
    const dx = this.x - bullet.x;
    const dy = this.y - bullet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.width / 2 + bullet.size / 2;
  }
  checkCollisionWithEnemyBullet(enemyBullet) {
    const dx = this.x - enemyBullet.x;
    const dy = this.y - enemyBullet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (enemyBullet.size / 2) + (this.width / 2);
    if (distance < minDistance) {
      this.takeDamage(1, 'enemyBullet');
      return true;
    }
    return false;
  }
  }
  function isColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }
