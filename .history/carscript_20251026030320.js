const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 160;
const PLAYER_HEIGHT = 90;
const CACTI_WIDTH = 78;
const CACTI_Height = 90;

const NUM_LANES = 5;

const obstacleData = [
    {src: "./assets/car_images/cactus_1.png", width:CACTI_WIDTH, height:CACTI_WIDTH},
    {src: "./assets/car_images/cactus_2.png", width:CACTI_WIDTH, height:CACTI_Height},
    {src: "./assets/car_images/cactus_3.png", width:CACTI_WIDTH, height:CACTI_Height},
    {src: "./assets/car_images/cactus_1.png", width:CACTI_WIDTH, height:CACTI_WIDTH},
    {src: "./assets/car_images/cactus_2.png", width:CACTI_WIDTH, height:CACTI_Height},
    {src: "./assets/car_images/cactus_3.png", width:CACTI_WIDTH, height:CACTI_Height},
    {src: "./assets/car_images/tumbleweed.png", width:CACTI_WIDTH, height:CACTI_WIDTH},
    {src: "./assets/car_images/red_car.png", width:PLAYER_WIDTH, height:PLAYER_HEIGHT},
    {src: "./assets/car_images/green_car.png", width:PLAYER_WIDTH, height:PLAYER_HEIGHT},
];

let obstacleImgs = [];
obstacleData.forEach(data => {
    const img = new Image();
    img.src = data.src;
    img.width = data.width;
    img.height = data.height;
    obstacleImgs.push(img);
});

const explosionImg = new Image();
explosionImg.src = "./assets/car_images/explosion_sprite.png";

let explosions = [];

let scaleRatio = null;
let backgroundX = 0; 
let gameSpeed = 3;
let speedIncreaseRate = 0.0001;

let gameRunning = false;
let gameOver = false;

let score = 0;
let maxScore = 0;

let car = {
    x: GAME_WIDTH / 24,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    lane: 2,
};

let obstacles = [];
let obstacleTimer = 0;
let obstacleInterval = 80;
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
    if (GAME_WIDTH * scaleRatio < GAME_WIDTH && GAME_HEIGHT * scaleRatio < GAME_HEIGHT){
        canvas.width = GAME_WIDTH * scaleRatio;
        canvas.height = GAME_HEIGHT * scaleRatio;
        } else {
        canvas.width = GAME_WIDTH;
        canvas.height = GAME_HEIGHT;
    }
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

    const bgWidth = canvas.width;
    const bgHeight = canvas.height;
    let bgX = -backgroundX * scaleRatio;

    ctx.drawImage(backgroundImg, bgX, 0, bgWidth, bgHeight);
    ctx.drawImage(backgroundImg, bgX + bgWidth, 0, bgWidth, bgHeight);

    ctx.fillStyle = "white";
    ctx.font = `bold ${20}px Verdana`;
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}    Max: ${maxScore}`, 20 * scaleRatio, 40 * scaleRatio);

    if (backgroundX * scaleRatio >= bgWidth) backgroundX = 0;

    obstacles.forEach((ob) => {
        ctx.drawImage(
        ob.img,
        ob.x * scaleRatio,
        ob.y * scaleRatio,
        ob.width * scaleRatio,
        ob.height * scaleRatio
        );
    });

    if (!gameOver) {
        ctx.drawImage(
            carImg,
            car.x * scaleRatio,
            car.y * scaleRatio,
            car.width * scaleRatio,
            car.height * scaleRatio
        );
    }
    explosions.forEach((ex, i) => {
        const frameWidth = explosionImg.width / ex.maxFrames;
        const frameHeight = explosionImg.height;

        ctx.drawImage(
            explosionImg,
            frameWidth * ex.frame,
            0,
            frameWidth,
            frameHeight,
            ex.x * scaleRatio,
            ex.y * scaleRatio,
            ex.width * scaleRatio,
            ex.height * scaleRatio
        );

        ex.tick++;
        if (ex.tick % ex.frameSpeed === 0) {
            ex.frame++;
        }
        if (ex.frame >= ex.maxFrames) {
            explosions.splice(i, 1);
        }
    });
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
        backgroundX += gameSpeed;
  
        obstacleTimer++;
        if (obstacleTimer > obstacleInterval) {
            spawnObstacle();
            obstacleTimer = 0;
            obstacleInterval = 100 + Math.random() * 10;
        }
    
        obstacles.forEach((ob) => {
            ob.x -= gameSpeed;
        
            if (!ob.counted && ob.x + ob.width < car.x) {
                score++;
                ob.counted = true;
        
                if (score > maxScore) {
                    maxScore = score;
                }
            }
        });
    
        obstacles = obstacles.filter((ob) => ob.x + ob.width > 0);
        
        checkCollisions();

        gameSpeed += speedIncreaseRate;

        drawScene();
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
  
function checkCollisions() {
    obstacles.forEach((ob, index) => {
      const carLeft = car.x;
      const carRight = car.x + car.width;
      const carTop = car.y;
      const carBottom = car.y + car.height;
  
      const obLeft = ob.x;
      const obRight = ob.x + ob.width-10;
      const obTop = ob.y;
      const obBottom = ob.y + ob.height;
  
      const horizontalOverlap = carLeft < obRight && carRight > obLeft;
      const verticalOverlap = carTop < obBottom && carBottom > obTop;
  
      if (horizontalOverlap && verticalOverlap) {
        spawnExplosion(car.x, car.y, car.width, car.height);
        setTimeout(setGameOver, 100);
      }
    });
}

function setGameOver(){
    gameRunning = false;
    gameOver = true
    drawScene();
}

function spawnObstacle() {
    const lane = Math.floor(Math.random() * NUM_LANES);
    const imgIndex = Math.floor(Math.random() * obstacleImgs.length);
    const chosenImg = obstacleImgs[imgIndex];

    const newObstacle = {
        x: GAME_WIDTH + 50,
        y: lanes[lane],
        width: chosenImg.width,
        height: chosenImg.height,
        lane: lane,
        img: chosenImg
    };
    obstacles.push(newObstacle);
}

function spawnExplosion(x, y, width, height) {
    explosions.push({
        x: x,
        y: y,
        width: width,
        height: height,
        frame: 0,
        maxFrames: 15,
        frameSpeed: 3,
        tick: 0
    });
}

window.addEventListener("keydown", (e) => {
    if (!gameRunning && !gameOver) {
      // start
      gameRunning = true;
        obstacles = [];
        explosions = [];
        backgroundX = 0;
        gameSpeed = 3;
        score = 0; 
        drawScene();
    } else if (gameOver) {
      // restart
        gameOver = false;
        gameRunning = true;
        backgroundX = 0;
        obstacles = [];
        explosions = [];
        gameSpeed = 3;
        score = 0; 
    } else {
      // move car if running
      if (e.key === "ArrowUp" && car.lane > 0) {
        car.lane--;
      } else if (e.key === "ArrowDown" && car.lane < NUM_LANES - 1) {
        car.lane++;
      }
      car.y = lanes[car.lane];
    }
});