// js/game.js
import { draw, drawGameOver, drawPause } from './render.js';
import { saveHighScoreIfBeaten } from './score.js';
import { router, navigateTo } from './router.js';
import { getCurrentView } from './state.js';
import { Obstacle } from './Obstacles/Obstacle.js';
import { FastObstacle} from './Obstacles/FastObstacle.js';
import { SlowObstacle} from './Obstacles/SlowObstacle.js';

import {
  getCurrentUser,
  clearCurrentUser,
  loadCurrentUserFromSession
} from "./auth.js";
import { showModal } from './views.js';

const nav = document.querySelector("nav");

let player = null;
let isPaused = false;

let gameOver = false;
let obstacles = [];
let score = 0;
let animationId = null;

let gameSpeed = 1.0;
let obstacleProbability = 0.05;
let minSpacing = 200;

export function getPlayer() {
  return player;
}

export function isGamePaused() {
  return isPaused;
}

export function togglePause() {
  isPaused = !isPaused;
}

// Adding most of the event listeners here to keep the code organized
document.addEventListener("keydown", e => {
  if (getCurrentView() !== "game") return;

  if ((e.code === "Space" || e.code === "ArrowUp") && player && player.y > 150) {
    player.vy = player.jumpPower;
    player.grounded = false;
    console.log("Jump!");
  }

  // Pausing the game also decreases the volume.
  if (e.code === "Escape" || e.code === "KeyP") {
    const audio = document.getElementById("bg-audio");
    audio.volume = audio.volume === 0.25 ? 0.125 : 0.25;
    isPaused = !isPaused;
    console.log("Pause!");
  }

  if (e.code === "KeyR") {
    stopGame();
    startGame();
  }

  if (e.code === "KeyM") {
    const audio = document.getElementById("bg-audio");
  
    if (audio) {
      audio.muted = !audio.muted;
      console.log("Mute toggled!");
    }
  }
})



window.addEventListener("popstate", router);

nav.addEventListener("click", e => {

  if (e.target.matches("a[data-link]")) {

    e.preventDefault();
    const url = e.target.getAttribute("href");
    const isLogout = e.target.hasAttribute("data-logout");

    if (isLogout) {
      clearCurrentUser();
    }

    navigateTo(url);
  }
});

export function stopGame() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function startGame() {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // The player character initialization
  player = {
    x: 100,
    y: 250,
    width: 30,
    height: 30,
    vy: 0,
    gravity: 1.8,
    jumpPower: -26,
    grounded: true
  };

  // The game state reset - IMPROTANT! to do between runs,
  // otherwise the game will continue from the last state (in the background).
  isPaused = false;
  gameOver = false;
  score = 0;
  obstacles = [];
  gameSpeed = 3.5;
  obstacleProbability = 0.05;
  minSpacing = 200;

  function createObstacle() {
    const lastObstacle = obstacles.length > 0 ? obstacles[obstacles.length - 1] : null;

    if (lastObstacle && lastObstacle.x > canvas.width - minSpacing) return;

    const obstacleTypes = [Obstacle, FastObstacle, SlowObstacle];
    const ChosenObstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    const x = canvas.width;
    const y = canvas.height;

    const obstacle = new ChosenObstacle(x, y);
    obstacles.push(obstacle);
  }

  function update() {
    if (gameOver) return;

    // Increase the score and the difficulty with each iteratiuon.
    score += 2;
    if (score % 4 === 0) obstacleProbability += 0.01;
    if (score % 50 === 0) {
      gameSpeed += 0.05;
      minSpacing -= 0.5;
    }

    const scoreElement = document.getElementById("game-score");
    if (scoreElement) scoreElement.textContent = Math.floor(score / 10);

    // Player movement
    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y >= 250) {
      player.y = 250;
      player.vy = 0;
      player.grounded = true;
    }

    // Obsatcle movment
    obstacles.forEach(ob => {
      ob.x -= gameSpeed;
      ob.update();
    });

    // Clear the obstacles who already crossed boundaries of the screen (the canvas)
    obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

    // Collisuon checks
    const collisionPadding = 10;
    for (let ob of obstacles) {
      if (
        player.x + collisionPadding < ob.x + ob.width &&
        player.x + player.width - collisionPadding > ob.x &&
        player.y + collisionPadding < ob.y + ob.height &&
        player.y + player.height - collisionPadding > ob.y
      ) {
        gameOver = true;
        const finalScore = Math.floor(score / 10);
        saveHighScoreIfBeaten(getCurrentUser(), finalScore);
        return;
      }
    }

    // Adding new obstacles
    if (Math.random() < obstacleProbability) {
      createObstacle();
    }
  }

  function loop() {
    if (!gameOver) {
      if (!isPaused) {
        update();
        draw(ctx, canvas, player, obstacles);
      } else {
        drawPause(ctx, canvas);
      }
      animationId = requestAnimationFrame(loop);
    }else{
      drawGameOver(ctx, canvas);
    }
  }

  loop();

  // Restart button check
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.style.display = "block";
    restartBtn.addEventListener("click", () => {
      stopGame();
      startGame();
    });
  }
  
  // Mute button
  const audio = document.getElementById("bg-audio");
  const muteBtn = document.getElementById("muteBtn");
  if (audio && muteBtn) {
    muteBtn.addEventListener("click", () => {
      audio.muted = !audio.muted;
    });
  }
}





