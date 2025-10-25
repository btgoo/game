const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 183;
const PLAYER_HEIGHT = 90;
const NUM_LANES = 5;

const obstacleImages = [
    {src: "./assets/car_images/cactus_1.png", width:78, height:130},
    {src: "./assets/car_images/cactus_2.png", width:78, height:130},
    {src: "./assets/car_images/cactus_3.png", width:78, height:130},
    {src: "./assets/car_images/cactus_4.png", width:78, height:130},
    {src: "./assets/car_images/tumbleweed.png", width:78, height:130},
    {src: "./assets/car_images/red_car.png", width:78, height:130},
];

let obstacleImgs = [];
obstacleImages.forEach((src) => {
  const img = new Image();
  img.src = src;
  obstacleImgs.push(img);
});

let scaleRatio = null;
let backgroundX = 0; 
let backgroundSpeed = 2;
let obstacleSpeed = 3;
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
  drawScene();
});

const backgroundImg = new Image();
backgroundImg.src = "./assets/car_images/background.png";

const carImg = new Image();
carImg.src = "./assets/car_images/blue_car.png";

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
        let bgX = -backgroundX * scaleRatio;

        ctx.drawImage(backgroundImg, bgX, 0, bgWidth, bgHeight);
        ctx.drawImage(backgroundImg, bgX + bgWidth, 0, bgWidth, bgHeight);

        if (backgroundX * scaleRatio >= bgWidth) {
        backgroundX = 0;
        }
    }

    obstacles.forEach((ob) => {
        ctx.drawImage(
        ob.img,
        ob.x * scaleRatio,
        ob.y * scaleRatio,
        ob.width * scaleRatio,
        ob.height * scaleRatio
        );
    });

    ctx.drawImage(
        carImg,
        car.x * scaleRatio,
        car.y * scaleRatio,
        car.width * scaleRatio,
        car.height * scaleRatio
    );
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = `${60 * scaleRatio}px Arial Black`;
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = `${30 * scaleRatio}px Arial`;
        ctx.fillText("Press any key to restart", canvas.width / 2, canvas.height / 2 + 60 * scaleRatio);
    }
}

function gameLoop() {
    if (gameRunning && !gameOver) {
      // Move background
        backgroundX += backgroundSpeed / scaleRatio;
  
        obstacleTimer++;
        if (obstacleTimer > obstacleInterval) {
            spawnObstacle();
            obstacleTimer = 0;
            obstacleInterval = 100 + Math.random() * 100;
        }
    
        obstacles.forEach((ob) => (ob.x -= obstacleSpeed));
    
        obstacles = obstacles.filter((ob) => ob.x + ob.width > 0);
        
        checkCollisions();

        backgroundSpeed += speedIncreaseRate;
        obstacleSpeed += speedIncreaseRate;

        drawScene();
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
  
function checkCollisions() {
    obstacles.forEach((ob) => {
      const carLeft = car.x;
      const carRight = car.x + car.width;
      const carTop = car.y;
      const carBottom = car.y + car.height;
  
      const obLeft = ob.x;
      const obRight = ob.x + ob.width;
      const obTop = ob.y;
      const obBottom = ob.y + ob.height;
  
      const horizontalOverlap = carLeft < obRight && carRight > obLeft;
      const verticalOverlap = carTop < obBottom && carBottom > obTop;
  
      if (horizontalOverlap && verticalOverlap) {
        gameOver = true;
        gameRunning = false;
      }
    });
}

function spawnObstacle() {
    const lane = Math.floor(Math.random() * NUM_LANES);
    const imgIndex = Math.floor(Math.random() * obstacleImgs.length);
    const chosenImg = obstacleImgs[imgIndex];

    const newObstacle = {
        x: GAME_WIDTH + 50,
        y: lanes[lane],
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        lane: lane,
        img: chosenImg
    };
    obstacles.push(newObstacle);
}

window.addEventListener("keydown", (e) => {
    if (!gameRunning && !gameOver) {
      // Start game
      gameRunning = true;
      obstacles = [];
      backgroundX = 0;
      backgroundSpeed = 2;
      obstacleSpeed = 3;
      drawScene();
    } else if (gameOver) {
      // Restart
      gameOver = false;
      gameRunning = true;
      backgroundX = 0;
      obstacles = [];
      backgroundSpeed = 2;
      obstacleSpeed = 3;
    } else {
      // Move car if running
      if (e.key === "ArrowUp" && car.lane > 0) {
        car.lane--;
      } else if (e.key === "ArrowDown" && car.lane < NUM_LANES - 1) {
        car.lane++;
      }
      car.y = lanes[car.lane];
    }
});