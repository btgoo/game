let board;
let boardWidth = 1200;
let boardHeight = 600;
let context;

let planeWidth = 150;
let planeHeight = 95;
let carX = boardWidth/24;
let carY = boardHeight/2.5;

let car = {
    x : carX,
    y : carY,
    width : caridth,
    height : planeHeight
}

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    planeImg = new Image();
    planeImg.src = "/assets/plane_images/Plane.png"
    planeImg.onload = function() {
        context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height)
    }
}
