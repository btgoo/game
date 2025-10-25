let board;
let boardWidth = 1200;
let boardHeight = 600;
let context;

let planeWidth = 150;
let planeHeight = 95;
let PlaneX = boardWidth/24;
let PlaneY = boardHeight/2.5;

let plane = {
  x : PlaneX,
  y : PlaneY,
  width : planeWidth,
  height : planeHeight,
}

window.onload = function() {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

    planeImg = new Image();
    planeImg.src = "/assets/plane_images/Plane_Object.png"
    planeImg.onload = function() {
        context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height)
    }
}
