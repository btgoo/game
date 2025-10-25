const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 183;
const PLAYER_HEIGHT = 90;
const NUM_LANES = 5;


let scaleRatio = null;
let backgroundX = 0; 
const backgroundSpeed = 2;
const obstacleSpeed = 3;
let speedIncreaseRate = 0.0005;

let gameRunning = false;
let gameOver = false;

let car = {
  x: GAME_WIDTH / 24,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  lane: 2,
};

let obstacles = [];
let obstacleTimer = 0;
let obstacleInterval = 120;
let lanes = [];

function setupLanes() {
  const laneHeight = GAME_HEIGHT / NUM_LANES;
  lanes = [];
  for (let i = 0; i < NUM_LANES; i++) {
    lanes.push(laneHeight * i + (laneHeight - car.height) / 2);
  }
  car.y = lanes[car.lane];
}

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  setupLanes();
}

setScreen();
window.addEventListener("resize", () => {
  setScreen();
});

const backgroundImg = new Image();
backgroundImg.src = "./assets/car_images/background.png";

const carImg = new Image();
carImg.src = "./assets/car_images/blue_car.png";

const obstacleImg = new Image();
obstacleImg.src = "./assets/car_images/red_car.png";

backgroundImg.onload = requestAnimationFrame(gameLoop);
carImg.onload = () => requestAnimationFrame(gameLoop);

backgroundImg.onload = drawStartScreen;
carImg.onload = drawStartScreen;


function drawStartScreen() {
    drawScene();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.fillStyle = "white";
    ctx.font = `${40 * scaleRatio}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Press any key to start", canvas.width / 2, canvas.height / 2);
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundImg.complete) {
    const bgWidth = canvas.width;
    const bgHeight = canvas.height;

    // Scroll effect
    let bgX = -backgroundX * scaleRatio;

    // Draw two images side-by-side for looping
    ctx.drawImage(backgroundImg, bgX, 0, bgWidth, bgHeight);
    ctx.drawImage(backgroundImg, bgX + bgWidth, 0, bgWidth, bgHeight);

    // Reset background position for seamless loop
    if (backgroundX * scaleRatio >= bgWidth) {
      backgroundX = 0;
    }
  }

  obstacles.forEach((ob) => {
    ctx.drawImage(
      obstacleImg,
      ob.x * scaleRatio,
      ob.y * scaleRatio,
      ob.width * scaleRatio,
      ob.height * scaleRatio
    );
});

  if (carImg.complete) {
    ctx.drawImage(
      carImg,
      car.x * scaleRatio,
      car.y * scaleRatio,
      car.width * scaleRatio,
      car.height * scaleRatio
    );
  }
}

function gameLoop() {
    if (gameRunning) {
      // Move background
        backgroundX += backgroundSpeed / scaleRatio;
  
      // Spawn new obstacles
        obstacleTimer++;
        if (obstacleTimer > obstacleInterval) {
            spawnObstacle();
            obstacleTimer = 0;
            // randomize interval slightly
            obstacleInterval = 100 + Math.random() * 100;
        }
    
        // Move obstacles left
        obstacles.forEach((ob) => (ob.x -= obstacleSpeed));
    
        // Remove obstacles off-screen
        obstacles = obstacles.filter((ob) => ob.x + ob.width > 0);
    
        drawScene();
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
  
function spawnObstacle() {
    const lane = Math.floor(Math.random() * NUM_LANES);
    const newObstacle = {
      x: GAME_WIDTH + 50, // start slightly off-screen
      y: lanes[lane],
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      lane: lane,
    };
    obstacles.push(newObstacle);
}

window.addEventListener("keydown", (e) => {
    if (!gameRunning) {
        gameRunning = true;
    } else {
        // Move between lanes only after game starts
        if (e.key === "ArrowUp" && car.lane > 0) {
          car.lane--;
        } else if (e.key === "ArrowDown" && car.lane < NUM_LANES - 1) {
          car.lane++;
        }
        car.y = lanes[car.lane];
    }
});