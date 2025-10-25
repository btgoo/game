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
let HP = [];
let planeImg = new Image();
planeImg.src = "/assets/plane_images/Plane.png";
let enemyImg = new Image();
enemyImg.src = "/assets/plane_images/Enemy.png";
let hpImg = new Image();
hpImg.src = "/assets/plane_images/HP_heart.png";

let spawnInterval = 1500;
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
    setInterval(spawnHP, 40000);
    enemyTimerId = setInterval(spawnEnemy, spawnInterval);
    hpTimerId = setInterval(spawnHP, 40000);
}

function spawnEnemy() {
    const width = 100;
    const height = 70;
    const x = boardWidth;
    const y = Math.random() * (boardHeight - height);
    const speed = 2 + Math.random() * 3;
    enemies.push({ x, y, width, height, speed });
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

    for (let h of HP) {
        context.drawImage(hpImg, h.x, h.y, h.width, h.height);
    }

    if (statusEl) statusEl.innerText = `HP: ${hitPoint}`;
}

function circleFor(obj, shrink = 0.3) {
  const r = (Math.min(obj.width, obj.height) * (1 - shrink)) / 2;
  return {
    cx: obj.x + obj.width  / 2,
    cy: obj.y + obj.height / 2,
    r
  };
}

function circlesOverlap(a, b) {
  const dx = a.cx - b.cx;
  const dy = a.cy - b.cy;
  const rr = (a.r + b.r) * (a.r + b.r);
  return dx*dx + dy*dy <= rr;
}


function lose_hp() {
  const pc = circleFor(plane, 0.35);   // 35% shrink for plane

  for (let e of enemies) {
    const ec = circleFor(e, 0.25);     // 25% shrink for enemies
    if (circlesOverlap(pc, ec)) {
      hitPoint -= 20;
      enemies = enemies.filter(enemy => enemy !== e);
      if (hitPoint < 0) hitPoint = 0;
      if (hitPoint === 0) {
        alert("Game Over!");
        window.location.reload();
      }
    }
  }
}

function healHP() {
  const pc = circleFor(plane, 0.35);
  for (let h of HP) {
    const hc = circleFor(h, 0.25);
    if (circlesOverlap(pc, hc)) {
      hitPoint += 20;
      HP = HP.filter(x => x !== h);
    }
  }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(enemyTimerId);
        clearInterval(hpTimerId);
    } else {
        // small grace delay prevents an instant burst on return
        setTimeout(() => {
            enemyTimerId = setInterval(spawnEnemy, spawnInterval);
            hpTimerId = setInterval(spawnHP, 40000);
        }, 300);
    }
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}