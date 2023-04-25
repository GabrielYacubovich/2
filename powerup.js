// powerup.js
class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 20;
    this.height = 20;
    this.markForDeletion = false;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fillStyle = this.type === 'invulnerability' ? 'green' : this.type === 'extraLife' ? 'blue' : this.type === 'doubleShooting' ? 'orange' : this.type === 'slowMotion' ? 'purple' : 'pink';
    ctx.fill();
    ctx.restore();
  }
  
  

  update(player) {
    let distance = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
    if (distance < (this.width / 2 + player.width / 2)) {
      this.applyEffect(player);
      this.markForDeletion = true;
    }
  }

  applyEffect(player) {
    if (this.type === 'invulnerability') {
      player.invulnerable = true;
      player.invulnerabilityTime = Date.now();
      player.color = 'green';
    } else if (this.type === 'extraLife') {
      lives++;
      player.lives++;
      player.color = 'blue';
    } else if (this.type === 'doubleShooting') {
      player.doubleShooting = true;
      player.doubleShootingTime = Date.now();
      player.color = 'orange';
      player.bulletSpeed = player.originalBulletSpeed * 2; 
      player.doubleShootingLost = false; 
    } else if (this.type === 'slowMotion') {
      player.color = 'purple';
 
      for (const asteroid of asteroids) {
        asteroid.speed *= 0.1;
      }
      for (const enemy of enemies) {
        enemy.speed *= 0.1;
      }
    } else if (this.type === 'backfront') {
      player.backfrontShooting = true;
      player.backfrontShootingTime = Date.now();
      player.color = 'pink'; 
    }
    incrementScore(30);

  }
  
}
