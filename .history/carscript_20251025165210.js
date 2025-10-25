// let board;
// let boardWidth = 1200;
// let boardHeight = 600;
// let context;

// let carWidth = 150;
// let carHeight = 95;
// let carX = boardWidth/24;
// let carY = boardHeight/2.5;

// let car = {
//     x : carX,
//     y : carY,
//     width : carWidth,
//     height : carHeight
// }

// window.onload = function() {
//     board = document.getElementById("board");
//     board.width = boardWidth;
//     board.height = boardHeight;
//     context = board.getContext("2d");

//     planeImg = new Image();
//     planeImg.src = "/assets/car_images/Plane.png"
//     planeImg.onload = function() {
//         context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height)
//     }
// }
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;

let scaleRatio = null;
let prev

function setScreen(){
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
}

setScreen();

window.addEventListener("resize", () => setTimeout(setScreen, 10));

if(screen.orientation){
    screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio(){
    const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
    );

    const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
    );

    // window is wider than the game width
    if(screenWidth/screenHeight < GAME_WIDTH/GAME_HEIGHT){
        return screenWidth/GAME_WIDTH;
    }
    else{
        return screenHeight/GAME_HEIGHT;
    }
}

function clearScreen(){
    ctx.fillStyle = "#ffc470";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
    if(previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;
    console.log(frameTimeDelta);
    clearScreen();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);