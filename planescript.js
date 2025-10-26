let board;
let boardWidth = 1200;
let boardHeight = 600;
let context;
let hitPoint = 100;

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
let bigEnemies = [];
let HP = [];

let planeImg = new Image();
planeImg.src = "assets/plane_images/Plane.png";
let enemyImg = new Image();
enemyImg.src = "assets/plane_images/Enemy.png";
let hpImg = new Image();
hpImg.src = "assets/plane_images/HP_heart.png";

let spawnInterval = 1800;
let status_HP = null;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    status_HP = document.getElementById('demo') || null;

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
    setInterval(spawnBigEnemy, spawnInterval * 4);
    setInterval(spawnHP, 30000);

    enemyTimerId = setInterval(spawnEnemy, spawnInterval);
    benemyTimerId = setInterval(spawnBigEnemy, spawnInterval);
    hpTimerId = setInterval(spawnHP, 30000);
}

function spawnEnemy() {
    const width = 100;
    const height = 50;
    const x = boardWidth;
    const y = Math.random() * (boardHeight - height);
    const speed = 2 + Math.random() * 3;
    enemies.push({ x, y, width, height, speed });
}

function spawnBigEnemy() {
    const width = 170;
    const height = 85;
    const x = boardWidth;
    const y = Math.random() * (boardHeight - height);
    const speed = 1 + Math.random() * 2;
    bigEnemies.push({ x, y, width, height, speed });
}

function spawnHP() {
    const width = 100;
    const height = 70;
    const x = boardWidth;
    const y = Math.random() * (boardHeight - height);
    const speed = 1 + Math.random() * 3;
    HP.push({ x, y, width, height, speed });
}

function update() {
    for (let e of enemies) {
        e.x -= e.speed;
    }
    enemies = enemies.filter((e) => e.x + e.width > 0);

    for (let b of bigEnemies) {
        b.x -= b.speed;
    }
    bigEnemies = bigEnemies.filter((b) => b.x + b.width > 0);

    for (let h of HP) {
        h.x -= h.speed;
    }
    HP = HP.filter((h) => h.x + h.width > 0);

    lose_hp();
    healHP();
}

function draw() {
    context.clearRect(0, 0, boardWidth, boardHeight);
    context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);

    for (let e of enemies) {
        context.drawImage(enemyImg, e.x, e.y, e.width, e.height);
    }

    for (let b of bigEnemies) {
        context.drawImage(enemyImg, b.x, b.y, b.width, b.height);
    }

    for (let h of HP) {
        context.drawImage(hpImg, h.x, h.y, h.width, h.height);
    }

    if (status_HP) status_HP.innerText = `HP: ${hitPoint}`;
}

function circleFor(obj, shrink = 0.3) {
    const r = (Math.min(obj.width, obj.height) * (1 - shrink)) / 2;
    return {
        cx: obj.x + obj.width / 2,
        cy: obj.y + obj.height / 2,
        r
    };
}

function circlesOverlap(a, b) {
    const dx = a.cx - b.cx;
    const dy = a.cy - b.cy;
    const rr = (a.r + b.r) * (a.r + b.r);
    return dx * dx + dy * dy <= rr;
}


function lose_hp() {
    const pc = circleFor(plane, 0.35);

    for (let e of enemies) {
        const ec = circleFor(e, 0.25);
        if (circlesOverlap(pc, ec)) {
            hitPoint -= 10;
            enemies = enemies.filter(enemy => enemy !== e);
            if (hitPoint < 0) hitPoint = 0;
            if (hitPoint === 0) {
                alert("Game Over!");
                window.location.reload();
            }
        }
    }
    for (let b of bigEnemies) {
        const bc = circleFor(b, 0.35);
        if (circlesOverlap(pc, bc)) {
            hitPoint -= 30;
            bigEnemies = bigEnemies.filter(benemy => benemy !== b);
            if (hitPoint < 0) hitPoint = 0;
            if (hitPoint === 0) {
                alert("Game Over!");
                window.location.reload();
            }
        }
    }
}

function healHP() {
    for (let h of HP) {
        const collected =
            plane.x < h.x + h.width &&
            plane.x + plane.width > h.x &&
            plane.y < h.y + h.height &&
            plane.y + plane.height > h.y;
        if (collected) {
            hitPoint += 50; // heal the plane
            HP = HP.filter(x => x !== h);
        }
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(enemyTimerId);
        clearInterval(hpTimerId);
        clearInterval(BenemyTimerId);
    } else {
        setTimeout(() => {
            enemyTimerId = setInterval(spawnEnemy, spawnInterval);
            BenemyTimerId = setInterval(spawnBigEnemy, spawnInterval * 3);
            hpTimerId = setInterval(spawnHP, 40000);
        }, 300);
    }
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}