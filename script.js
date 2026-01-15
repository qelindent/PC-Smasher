// ====== Elements ======
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const gameScreen = document.getElementById("game-screen");

const computer = document.getElementById("computer");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const resultText = document.getElementById("result");
const restartBtn = document.getElementById("restart");

// ====== Images / Damage ======
const images = [
  "images/pc0.jpg",
  "images/pc1.jpg",
  "images/pc2.jpg",
  "images/pc3.jpg",
  "images/pc4.jpg",
  "images/pc5.jpg"
];
let damage = 0;
let score = 0;
let timer = 0;
let gameOver = false;
let timerInterval;
let timerStarted = false; // New: timer only starts on first click

// ====== Audio ======
const startMusic = new Audio("sounds/start.mp3");
startMusic.loop = true;

const gameplayMusic = new Audio("sounds/gameplay.mp3");
gameplayMusic.loop = true;

const winMusic = new Audio("sounds/win.mp3");
const loseMusic = new Audio("sounds/lose.mp3");

// Multiple smash sounds
const smashSounds = [
  new Audio("sounds/punch1.mp3"),
  new Audio("sounds/punch2.mp3"),
  new Audio("sounds/punch3.mp3"),
  new Audio("sounds/punch4.mp3"),
  new Audio("sounds/punch5.mp3")
];

// ====== Custom Cursor ======
document.body.style.cursor = "url('images/cursor.cur'), auto";

// ====== Best time ======
let bestTime = localStorage.getItem("bestTime") ? parseFloat(localStorage.getItem("bestTime")) : null;
bestDisplay.textContent = bestTime ? bestTime.toFixed(2) + "s" : "0s";

// ====== Start Screen Logic ======
startMusic.play();

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";

  startMusic.pause();
  gameplayMusic.currentTime = 0;
  gameplayMusic.play();

  // Reset stats
  damage = 0;
  score = 0;
  timer = 0;
  gameOver = false;
  timerStarted = false;
  computer.src = images[0];
  scoreDisplay.textContent = "0";
  timerDisplay.textContent = "0.0";
  resultText.textContent = "";
  restartBtn.style.display = "none";

  // Ensure instruction image is visible
  const instructionImg = document.getElementById("click-instruction");
  if (instructionImg) instructionImg.style.display = "block";
});

// ====== Click / Tap Logic ======
document.getElementById("game").addEventListener("click", () => {
  if (gameOver) return;

  // Start timer on first click
  if (!timerStarted) {
    timerStarted = true;
    startTimer();

    // Hide the instruction image
    const instructionImg = document.getElementById("click-instruction");
    if (instructionImg) instructionImg.style.display = "none";
  }

  damage++;
  score += 10;
  scoreDisplay.textContent = score;

  // Play random smash sound
  const randomIndex = Math.floor(Math.random() * smashSounds.length);
  const sound = smashSounds[randomIndex];
  sound.currentTime = 0;
  sound.play();

  // Update computer image
  let idx = Math.min(Math.floor(damage / 3), images.length - 1);
  computer.src = images[idx];

  // Screen shake
  shakeScreen();

  // Win check
  if (idx === images.length - 1) endGame(true);
});

// ====== Timer Function ======
function startTimer() {
  timerInterval = setInterval(() => {
    if (!gameOver) {
      timer += 0.1;
      timerDisplay.textContent = timer.toFixed(1);

      // End game automatically at 10 seconds
      if (timer >= 10) endGame(false);
    }
  }, 100);
}

// ====== End Game ======
function endGame(win) {
  gameOver = true;
  clearInterval(timerInterval);
  restartBtn.style.display = "inline-block";

  gameplayMusic.pause();

  if (win) {
    winMusic.currentTime = 0;
    winMusic.play();
    computer.src = "images/winscreen.jpg";

    // Update best time (lower is better)
    if (bestTime === null || timer < bestTime) {
      bestTime = timer;
      localStorage.setItem("bestTime", bestTime);
    }
    bestDisplay.textContent = bestTime.toFixed(2) + "s";
  } else {
    loseMusic.currentTime = 0;
    loseMusic.play();
    computer.src = "images/losescreen.jpg";
  }
}

// ====== Restart Button ======
restartBtn.addEventListener("click", () => {
  location.reload();
});

// ====== Screen Shake ======
function shakeScreen() {
  const gameDiv = document.getElementById("game");
  const intensity = 10;
  const duration = 100;

  let start = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    if (elapsed >= duration) {
      gameDiv.style.transform = "translate(0,0)";
      clearInterval(interval);
    } else {
      const x = (Math.random() - 0.5) * intensity;
      const y = (Math.random() - 0.5) * intensity;
      gameDiv.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, 16);
}
