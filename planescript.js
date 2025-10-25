let board;
let boardWidth = 1200;
let boardHeight = 600;
let context;
let hitPoint = 100;
let gravity = true;

let planeWidth = 150;
let planeHeight = 95;
let PlaneX = boardWidth / 24;
let PlaneY = boardHeight / 2.5;

let plane = {
    x: PlaneX,
    y: PlaneY,
    width: planeWidth,
    height: planeHeight,
};

let enemies = [];
let planeImg = new Image();
planeImg.src = "/assets/plane_images/Plane.png";
let enemyImg = new Image();
enemyImg.src = "/assets/plane_images/Enemy.png";

let spawnInterval = 10;
let assetsLoaded = 0;
let statusEl = null;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    statusEl = document.getElementById('demo') || null;

    const moveSpeed = 30;
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp':
                if (plane.y > 0) {
                    plane.y -= moveSpeed;
                }
                break;
            case 'ArrowDown':
                if (plane.y < boardHeight - plane.height) {
                    plane.y += moveSpeed;
                }
                break;
        };
    }
    );

    requestAnimationFrame(gameLoop);
    setInterval(spawnEnemy, spawnInterval);
}

function spawnEnemy() {
    const width = 100;
    const height = 70;
    const x = boardWidth;
    const y = Math.random() * (boardHeight - height);
    const speed = 2 + Math.random() * 3;
    enemies.push({ x, y, width, height, speed });
}

function update() {
    for (let e of enemies) {
        e.x -= e.speed;
    }
    enemies = enemies.filter((e) => e.x + e.width > 0);
}

function draw() {
    context.clearRect(0, 0, boardWidth, boardHeight);
    context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
    for (let e of enemies) {
        context.drawImage(enemyImg, e.x, e.y, e.width, e.height);
    }
    if (statusEl) statusEl.innerText = `enemies: ${enemies.length}`;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
