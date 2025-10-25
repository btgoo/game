const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 250;

let scaleRatio = 1;
let bgX = 0;

// Background speed
const bgSpeed = 2;

// Car
const car = {
    x: 100,
    y: 0,
    width: 50,
    height: 30,
    lane: 2, // starts at lane 2 (middle)
};

// Lanes
const laneCount = 5;
const laneHeight = GAME_HEIGHT / laneCount;

// Set initial car position
car.y = car.lane * laneHeight + laneHeight / 2 - car.height / 2;

function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
}

setScreen();
window.addEventListener("resize", setScreen);

function getScaleRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    } else {
        return screenHeight / GAME_HEIGHT;
    }
}

// Handle key press
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && car.lane > 0) {
        car.lane--;
    } else if (e.key === "ArrowDown" && car.lane < laneCount - 1) {
        car.lane++;
    }
    car.y = car.lane * laneHeight + laneHeight / 2 - car.height / 2;
});

function drawBackground() {
    const patternWidth = 40; // width of a repeating stripe
    ctx.fillStyle = "#a0d8ef";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = "#7ec850";
    for (let i = -patternWidth; i < GAME_WIDTH; i += patternWidth * 2) {
        ctx.fillRect(i + (bgX % (patternWidth * 2)), 0, patternWidth, GAME_HEIGHT);
    }

    bgX -= bgSpeed;
}

function drawLanes() {
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    for (let i = 1; i < laneCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * laneHeight);
        ctx.lineTo(GAME_WIDTH, i * laneHeight);
        ctx.stroke();
    }
}

function drawCar() {
    ctx.fillStyle = "#ff4747";
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function gameLoop() {
    ctx.save();
    ctx.scale(scaleRatio, scaleRatio);

    drawBackground();
    drawLanes();
    drawCar();

    ctx.restore();
    requestAnimationFrame(gameLoop);
}

gameLoop();