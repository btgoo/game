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

const boardWidth = 1200;
const boardHeight = 600;

let scaleRatio = null;
function setScreen(){
    scaleRatio = getScaleRatio();
}

function getScaleRatio(){
    const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.cl
    )
}