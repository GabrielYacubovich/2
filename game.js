// game.js
import { Player } from './player.js';
import { Asteroid } from './asteroid.js';
import { Powerup } from './powerup.js';
import { Enemy } from './enemy.js';
import { randomSpaceFact } from './spacefacts.js';
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let spaceFactText = `Space Fact: ${randomSpaceFact()}`;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let onWelcomeScreen = true; // Step 1
const player = new Player(gameOver, 3);
const enemy = new Enemy(100, 100, 2, 30);
// Resize canvas on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const keys = {};
canvas.addEventListener('click', (event) => {
  const buttonWidth = 150;
  const buttonHeight = 40;
  const buttonX = canvas.width - buttonWidth - 10;
  const buttonY = 10;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
    playerName = getPlayerName();
    restartGame();
  }
});
canvas.addEventListener('click', (event) => {
  const buttonWidth = 150;
  const buttonHeight = 40;
  const buttonX = canvas.width - buttonWidth - 10;
  const buttonY = 10;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
    playerName = getPlayerName();
    restartGame();
  }
  if (onWelcomeScreen && keys['Space']) { // check if spacebar is pressed and the game is on the welcome page
    onWelcomeScreen = false;
  }
});
window.addEventListener('keydown', (event) => {
  keys[event.code] = true;
  if (event.code === 'KeyP') {
    togglePause();
  }
  if (event.code === 'KeyN' && gameOverScreen) {
    restartGame();
  }
});
window.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});
let playerName = getPlayerName();
let paused = false;
let lives = player.lives;

let asteroids = [];
let enemies = [];
let powerups = [];
let enemyBullets = [];
let asteroidTimer = 100;
let enemyTimer = 400;
let powerupTimer = 0;
let score = 0;
let level = 1;
let textFlashInterval = null;
let flashText = false;
let flashTextCount = 0;
const flashTextDuration = 1000; // Change this value to adjust the flashing speed
function getPlayerName() {
  let name = prompt("Please enter your name:");
  if (name === null || name.trim() === "") {
    name = "ANON";
  }
  return name.slice(0, 4).toUpperCase();
}
function togglePause() {
  paused = !paused;
}
function incrementScore(points) {
  const oldScoreMultiple = Math.floor(score / 1000);
  score += points;
  const newScoreMultiple = Math.floor(score / 1000);
  if (newScoreMultiple > oldScoreMultiple) {
    lives++;
  }
}
function handleTextFlash() {
  if (!textFlashInterval) {
    textFlashInterval = setInterval(() => {
      flashText = !flashText;
      flashTextCount++;

      if (flashTextCount >= flashTextDuration / 100) {
        clearInterval(textFlashInterval);
        textFlashInterval = null;
        flashTextCount = 0;
      }
    }, 500);
  }
}
function drawRestartButton(ctx) {
  const buttonWidth = 150;
  const buttonHeight = 40;
  const buttonX = canvas.width - buttonWidth - 10;
  const buttonY = 10;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.font = '20px Joystix';
  ctx.fillStyle = 'white';
  const buttonText = 'Change Player';
  const buttonTextWidth = ctx.measureText(buttonText).width;
  ctx.fillText(buttonText, buttonX + buttonWidth / 2 - buttonTextWidth / 2, buttonY + buttonHeight / 2 + 6);
}
function drawWelcomeScreen() { // Step 3
  ctx.font = '80px Joystix';
  ctx.fillStyle = 'white';
  let gameNameText = 'AsteroidsGPT';
  let gameNameTextWidth = ctx.measureText(gameNameText).width;
  ctx.fillText(gameNameText, canvas.width / 2 - gameNameTextWidth / 2, canvas.height / 2 - 70);
  ctx.font = '40px Joystix';
  ctx.fillStyle = 'white';
  let gameWhatText = 'a JS challenge with ChatGPT';
  let gameWhatTextWidth = ctx.measureText(gameWhatText).width;
  ctx.fillText(gameWhatText, canvas.width / 2 - gameWhatTextWidth / 2, canvas.height / 2);
  ctx.font = '24px Joystix';
  let pressSpacebarText = 'Press Spacebar to Play';
  let pressSpacebarTextWidth = ctx.measureText(pressSpacebarText).width;
  ctx.fillText(pressSpacebarText, canvas.width / 2 - pressSpacebarTextWidth / 2, canvas.height / 2 + 180);
  ctx.font = '20px Joystix';
  ctx.fillStyle = 'blue';
  let blueText = 'Life Up';
  let blueTextWidth = ctx.measureText(blueText).width;
  ctx.fillText(blueText, canvas.width / 2 - blueTextWidth / 2 - 100, canvas.height / 2 + 100);
  ctx.font = '20px Joystix';
  ctx.fillStyle = 'green';
  let greenText = 'Invulnerable';
  let greenTextWidth = ctx.measureText(greenText).width;
  ctx.fillText(greenText, canvas.width / 2 - greenTextWidth / 2 - 200, canvas.height / 2 + 100);
  ctx.font = '20px Joystix';
  ctx.fillStyle = 'orange';
  let orangeText = 'Fast Bullets';
  let orangeTextWidth = ctx.measureText(orangeText).width;
  ctx.fillText(orangeText, canvas.width / 2 - orangeTextWidth / 2, canvas.height / 2 + 100);
  ctx.font = '20px Joystix';
  ctx.fillStyle = 'purple';
  let purpleText = 'Slow Mo';
  let purpleTextWidth = ctx.measureText(purpleText).width;
  ctx.fillText(purpleText, canvas.width / 2 - purpleTextWidth / 2 + 200, canvas.height / 2 + 100);
  ctx.font = '20px Joystix';
  ctx.fillStyle = 'pink';
  let pinkText = '2x Bullets';
  let pinkTextWidth = ctx.measureText(pinkText).width;
  ctx.fillText(pinkText, canvas.width / 2 - pinkTextWidth / 2 + 100, canvas.height / 2 + 100);
}
function updatePowerups() {
  
  for (let i = powerups.length - 1; i >= 0; i--) {
    const powerup = powerups[i];
    powerup.update(lives, asteroids, enemies);
    if (powerup.markForDeletion) {
      powerups.splice(i, 1);
    }
  }
}

function spawnAsteroids() {
  if (asteroidTimer <= 0) {
    const size = 60;
    let x, y;
    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    } while (Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2) < 300);
    const speed = 1 + Math.random() * 2;
    const rotation = Math.random() * Math.PI * 2;
    asteroids.push(new Asteroid(x, y, size, speed, rotation));
    asteroidTimer = 600;
  } else {
    asteroidTimer--;
  }
}
function spawnEnemy() {
  if (enemyTimer <= 0) {
    const size = 30;
    let x, y;
    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    } while (Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2) < 300);
    const speed = 1 + Math.random() * 2;
    const enemyInstance = new Enemy(x, y, speed, size);
    const bullet = enemyInstance.shootAtPlayer(player);
    if (bullet) {
      bullet.isPlayerBullet = false;
      enemyBullets.push(bullet);
    }
    enemies.push(enemyInstance);
    enemyTimer = 2000;
  } else {
    enemyTimer--;
  }
}
function shootEnemyBullets() {
  for (const enemy of enemies) {
    const bullet = enemy.shootAtPlayer(player);
    if (bullet) {
      // enemyBullets.push(bullet);
      enemyBullets.push(bullet);
    }
  }
}
function spawnPowerups() {
  if (powerupTimer <= 0) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const powerupTypes = ['invulnerability', 'extraLife', 'doubleShooting', 'slowMotion', 'backfront'];
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    powerups.push(new Powerup(x, y, type));
    powerupTimer = 800;
  } else {
    powerupTimer--;
  }
}
let gameOverScreen = false;
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (onWelcomeScreen) { // Step 4
    drawWelcomeScreen();
    if (keys['Space']) {
      onWelcomeScreen = false;
    }
  } else if (!gameOverScreen) {
    player.update();
    player.draw(ctx);
    spawnAsteroids();
    spawnEnemy();
    shootEnemyBullets();
    spawnPowerups();
    // Update and draw asteroids
    for (const asteroid of asteroids) {
      asteroid.update();
      asteroid.draw(ctx);
    }
    // Update and draw enemies
    for (const enemy of enemies) {
      enemy.update(asteroids, player);
      enemy.draw(ctx);
    }
    // Update and draw powerups
    for (const powerup of powerups) {
      powerup.update(player);
      powerup.draw(ctx);
    }
    // Update and draw player bullets
    for (const bullet of player.bullets) {
      bullet.update();
      bullet.draw(ctx);
    }
    // Update and draw enemy bullets
    for (const bullet of enemyBullets) {
      if (player.checkCollisionWithBullet(bullet)) {
        bullet.markForDeletion = true;
        if (!player.invulnerable && player.collisionDelay === 0) {
          lives--; // Decrement lives here
          respawnPlayer(); // Call respawnPlayer() here
          if (player.doubleShooting && !player.doubleShootingLost) {
            player.doubleShootingLost = true;
            player.bulletSpeed = player.originalBulletSpeed;
            player.doubleShootingTime = 0;
            player.doubleShooting = false;
          }
          break; // Exit the loop after the first collision is detected
        }
      }
    }
    // Draw score and lives
    ctx.font = '24px Joystix';
    ctx.fillStyle = 'white';
    ctx.fillText(`${playerName}`, 10, 30);
    ctx.fillText(`Score: ${score}`, 10, 65);
    ctx.fillText(`Lives: ${player.lives}`, 10, 100);
    // Check collisions between enemy bullets and player
    if (enemyBullets?.length > 0) {
    }
    for (const bullet of enemyBullets) {
      if (player.checkCollisionWithBullet(bullet)) {
        bullet.markForDeletion = true;
        player.takeDamage();
        player.resetPosition();
      }
    }
    // Check collisions between player bullets and enemies
    for (const bullet of player.bullets) {
      for (const enemy of enemies) {
        if (enemy.checkCollisionWithBullet(bullet)) {
          bullet.markForDeletion = true;
          enemy.markForDeletion = true;
          incrementScore(100);
        }
      }
    }
    // Remove marked for deletion objects
    player.bullets = player.bullets.filter(bullet => !bullet.markForDeletion);
    enemies = enemies.filter(enemy => !enemy.markForDeletion);
    asteroids = asteroids.filter(asteroid => !asteroid.isDestroyed());
    powerups = powerups.filter(powerup => !powerup.markForDeletion);
    // Check collisions between bullets and asteroids
    for (const asteroid of asteroids) {
      for (const bullet of player.bullets) {
        if (asteroid.checkCollisionWithBullet(bullet)) {
          bullet.markForDeletion = true;
          asteroid.markForDeletion = true;
          incrementScore(10);
          const smallerAsteroids = asteroid.breakIntoSmallerAsteroids();
          asteroids.push(...smallerAsteroids);
          break;
        }
      }
    }
    drawRestartButton(ctx);
    checkCollisions();
    if (lives <= 0) {
      gameOver();
    }
  } else {
    ctx.font = '80px Joystix';
    ctx.fillStyle = 'white';
    let gameOverText = 'Game Over';
    let gameOverTextWidth = ctx.measureText(gameOverText).width;
    ctx.fillText(gameOverText, canvas.width / 2 - gameOverTextWidth / 2, canvas.height / 2 - 160);
    ctx.font = "40px Joystix";
    const highScoreText = `High Score: ${getHighScore()}`;
    const highScoreTextWidth = ctx.measureText(highScoreText).width;
    ctx.fillText(highScoreText, canvas.width / 2 - highScoreTextWidth / 2, canvas.height / 2);
    ctx.font = '40px Joystix';
    let scoreText = `Last Score: ${playerName} ${score}`;
    let scoreTextWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, canvas.width / 2 - scoreTextWidth / 2, canvas.height / 2 + 60);
    ctx.font = '18px Joystix';
    ctx.fillStyle = 'white';

    //Put here 
    if (Boolean(spaceFactText) && gameOverScreen) {
      let spaceFactTextWidth = ctx.measureText(spaceFactText).width;
      ctx.fillText(spaceFactText, canvas.width / 2 - spaceFactTextWidth / 2, canvas.height / 2 + 280);
    }
    

    //


    // Display one random space fact when the player ends the game

    drawRestartButton(ctx); // Add this line to show the button on the game over screen
    handleTextFlash(); // Add this line
        let playAgainTextVisible = !flashText;
    if (playAgainTextVisible) {
      ctx.font = '18px Joystix';
      ctx.fillStyle = 'white';
      let playAgainText = 'Press "N" to play again';
      let playAgainTextWidth = ctx.measureText(playAgainText).width;
      let playAgainX = canvas.width / 2 - playAgainTextWidth / 2;
      let playAgainY = canvas.height / 2 + 180;
      ctx.fillText(playAgainText, playAgainX, playAgainY);
    }
    if (keys['KeyN']) {
      restartGame();
    }
  }
}
function gameLoop() {
  if (!paused) {
    update();
  }
  requestAnimationFrame(gameLoop);
  
}
function respawnPlayer() {
  player.takeDamage(1, "asteroid");
  if (!player.invulnerable) {
    lives--; // Decrement lives
  }
  player.resetPowerupEffects();
  
}
function checkCollisions() {
  // Check collisions between player and asteroids
  for (const asteroid of asteroids) {
    if (player.checkCollisionWithAsteroid(asteroid) && !player.invulnerable && player.collisionDelay === 0) {
      respawnPlayer('enemy, asteroid');
      player.collisionDelay = 80; // Set delay after losing a life
      if (player.doubleShooting && !player.doubleShootingLost) {
        player.doubleShootingLost = true;
        player.bulletSpeed = player.originalBulletSpeed;
        player.doubleShootingTime = 0;
        player.doubleShooting = false;
      }
      break; // Exit the loop after the first collision is detected
    }
  }
  for (const bullet of enemyBullets) {
    if (player.checkCollisionWithBullet(bullet)) {
      bullet.markForDeletion = true;
      if (!player.invulnerable && player.collisionDelay === 0) {
        lives--; // Decrement lives here
        respawnPlayer(); // Call respawnPlayer() here
        if (player.doubleShooting && !player.doubleShootingLost) {
          player.doubleShootingLost = true;
          player.bulletSpeed = player.originalBulletSpeed;
          player.doubleShootingTime = 0;
          player.doubleShooting = false;
        }
      } else {
        player.takeDamage();
        player.resetPosition();
      }
      break; // Exit the loop after the first collision is detected
    }
  }
  // Check collisions between player and powerups

}
function flashGameOverText() {
  if (flashText) {
    ctx.font = '18px Joystix';
    ctx.fillStyle = 'white';
    let playAgainText = 'Press "N" to play again';
    let playAgainTextWidth = ctx.measureText(playAgainText).width;
    let playAgainX = canvas.width / 2 - playAgainTextWidth / 2;
    let playAgainY = canvas.height / 2 + 180;
    ctx.fillText(playAgainText, playAgainX, playAgainY);
  }
}
function saveHighScore(playerName, score) {
  const highScoreKey = "highScore";
  const currentHighScore = localStorage.getItem(highScoreKey);
  const newHighScore = `${playerName.slice(0, 4)} ${score}`;
  if (!currentHighScore || parseInt(currentHighScore.split(" ")[1]) < score) {
    localStorage.setItem(highScoreKey, newHighScore);
  }
}
function getHighScore() {
  const highScoreKey = "highScore";
  return localStorage.getItem(highScoreKey) || "N/A";
}
function gameOver() {
  gameOverScreen = true;
  saveHighScore(playerName, score);


}

function restartGame() {
  gameOverScreen = false;
  asteroids = [];
  enemies = [];
  powerups = [];
  score = 0;
  level = 1;
  lives = 3;
  player.resetlives();
  player.reset();
  player.resetPowerupEffects();
  asteroidTimer = 100;
  enemyTimer = 400;
  powerupTimer = 0;
  

}
gameLoop();
export { canvas };
export { keys };
export { incrementScore };
export { player };
export { ctx };
// export { lives };
