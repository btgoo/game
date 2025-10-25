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

const GAME_WIDTH = 800;
const GAME_HEIGHT = 250;

let car = {
x : GAME_WIDTH/24,
y : GAME_HEIGHT/2.5,
width: 150,
height: 95,
}

let scaleRatio = null

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
        return screenWidth/GAME_WIDTH
    }
    else{
        return screenHeight/GAME_HEIGHT
    }
}
function setScreen(){
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio
    canvas.height = GAME_HEIGHT * scaleRatio
}


setScreen();

window.addEventListener('resize', () => {
    setScreen();
    drawCar();
});



const backgroundImg = new Image();
backgroundImg.src = "./assets/car_images/background.png"

const carImg = new Image();
carImg.src = "./assets/car_images/blue_car.png"

backgroundImg.onload = drawScene;
carImg.onload = drawScene;

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