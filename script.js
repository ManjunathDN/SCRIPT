// Simple 2D Pac-Man-like Game using JavaScript, HTML, and Canvas with Scoring and Ghosts

const canvas = document.createElement("canvas");
canvas.width = 448;
canvas.height = 496;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const tileSize = 16;
let score = 0;
const map = [
  "############################",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o####.#####.##.#####.####o#",
  "#.####.#####.##.#####.####.#",
  "#..........................#",
  "#.####.##.########.##.####.#",
  "#.####.##.########.##.####.#",
  "#......##....##....##......#",
  "######.##### ## #####.######",
  "     #.##### ## #####.#     ",
  "     #.##          ##.#     ",
  "     #.## ###--### ##.#     ",
  "######.## #      # ##.######",
  "      .   #      #   .      ",
  "######.## #      # ##.######",
  "     #.## ######## ##.#     ",
  "     #.##          ##.#     ",
  "     #.## ######## ##.#     ",
  "######.## ######## ##.######",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#.####.#####.##.#####.####.#",
  "#o..##................##..o#",
  "###.##.##.########.##.##.###",
  "###.##.##.########.##.##.###",
  "#......##....##....##......#",
  "#.##########.##.##########.#",
  "#..........P.....G.........#",
  "############################"
];

let player = {
  x: 14,
  y: 27,
  dx: 0,
  dy: 0,
};

let ghosts = [
  { x: 20, y: 27, dx: 0, dy: 0, color: "red", changeCounter: 0 },
  { x: 13, y: 13, dx: 0, dy: 0, color: "pink", changeCounter: 0 },
  { x: 14, y: 13, dx: 0, dy: 0, color: "cyan", changeCounter: 0 }
];

function drawCircle(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x * tileSize + 8, y * tileSize + 8, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let tile = map[y][x];
      if (tile === "#") {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else if (tile === ".") {
        drawCircle(x, y, 2, "white");
      } else if (tile === "o") {
        drawCircle(x, y, 5, "white");
      }
    }
  }
}

function drawPlayer() {
  drawCircle(player.x, player.y, 8, "yellow");
}

function drawGhosts() {
  ghosts.forEach(g => drawCircle(g.x, g.y, 8, g.color));
}

function updatePlayer() {
  let newX = player.x + player.dx;
  let newY = player.y + player.dy;
  if (map[newY][newX] !== "#") {
    if (map[newY][newX] === ".") {
      score += 10;
      map[newY] = map[newY].substring(0, newX) + " " + map[newY].substring(newX + 1);
    } else if (map[newY][newX] === "o") {
      score += 50;
      map[newY] = map[newY].substring(0, newX) + " " + map[newY].substring(newX + 1);
    }
    player.x = newX;
    player.y = newY;
  }
}

function updateGhosts() {
  ghosts.forEach(g => {
    if (g.changeCounter <= 0) {
      let dirs = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
      ];
      dirs = dirs.filter(d => map[g.y + d.dy][g.x + d.dx] !== "#");
      const choice = dirs[Math.floor(Math.random() * dirs.length)];
      g.dx = choice.dx;
      g.dy = choice.dy;
      g.changeCounter = 20 + Math.floor(Math.random() * 30);
    } else {
      g.changeCounter--;
    }
    let newX = g.x + g.dx;
    let newY = g.y + g.dy;
    if (map[newY][newX] !== "#") {
      g.x = newX;
      g.y = newY;
    }
  });
}

function resetGame() {
  player = { x: 14, y: 27, dx: 0, dy: 0 };
  ghosts = [
    { x: 20, y: 27, dx: 0, dy: 0, color: "red", changeCounter: 0 },
    { x: 13, y: 13, dx: 0, dy: 0, color: "pink", changeCounter: 0 },
    { x: 14, y: 13, dx: 0, dy: 0, color: "cyan", changeCounter: 0 }
  ];
  score = 0;
}

function checkCollision() {
  for (let g of ghosts) {
    if (player.x === g.x && player.y === g.y) {
      alert("Game Over! Your score: " + score);
      resetGame();
    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  updatePlayer();
  updateGhosts();
  checkCollision();
  drawPlayer();
  drawGhosts();
  drawScore();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      player.dx = 0; player.dy = -1;
      break;
    case "ArrowDown":
      player.dx = 0; player.dy = 1;
      break;
    case "ArrowLeft":
      player.dx = -1; player.dy = 0;
      break;
    case "ArrowRight":
      player.dx = 1; player.dy = 0;
      break;
  }
});

gameLoop();
