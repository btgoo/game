const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 183;
const PLAYER_HEIGHT = 90;
const NUM_LANES = 5;

let backgroundX = 0; // <--- background scroll position
const backgroundSpeed = 2; // pixels per frame

let scaleRatio = null;

let car = {
  x: GAME_WIDTH / 24,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  lane: 2,
};

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
carImg.onload = () => ;


function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundImg.complete) {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  }

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

// Move car up/down between lanes
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && car.lane > 0) {
    car.lane--;
  } else if (e.key === "ArrowDown" && car.lane < NUM_LANES - 1) {
    car.lane++;
  }
  car.y = lanes[car.lane];
  drawScene();
});