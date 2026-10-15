"use strict";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const scoreLabel = document.querySelector("#score");
const cellSize = 20;
const columns = canvas.width / cellSize;
const rows = canvas.height / cellSize;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let timer = null;
let paused = false;

function draw() {
    context.fillStyle = "#0b1016";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ff687d";
    context.beginPath();
    context.arc((apple.x + 0.5) * cellSize, (apple.y + 0.5) * cellSize, cellSize * 0.36, 0, Math.PI * 2);
    context.fill();

    snake.forEach((part, index) => {
        context.fillStyle = index === snake.length - 1 ? "#b4ffd5" : "#75efb1";
        context.fillRect(part.x * cellSize + 2, part.y * cellSize + 2, cellSize - 4, cellSize - 4);
    });
}

function placeApple() {
    do {
        apple = {
            x: Math.floor(Math.random() * columns),
            y: Math.floor(Math.random() * rows)
        };
    } while (snake.some(part => part.x === apple.x && part.y === apple.y));
}

function finishGame() {
    clearInterval(timer);
    timer = null;
    paused = false;
    window.setTimeout(() => window.alert("Partie terminée ! Score : " + score), 20);
}

function update() {
    direction = nextDirection;
    const head = {
        x: snake[snake.length - 1].x + direction.x,
        y: snake[snake.length - 1].y + direction.y
    };

    const hitWall = head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
    const ateApple = head.x === apple.x && head.y === apple.y;
    const bodyToCheck = ateApple ? snake : snake.slice(1);
    const hitSelf = bodyToCheck.some(part => part.x === head.x && part.y === head.y);

    if (hitWall || hitSelf) {
        finishGame();
        return;
    }

    snake.push(head);
    if (ateApple) {
        score += 1;
        scoreLabel.textContent = score;
        placeApple();
    } else {
        snake.shift();
    }

    draw();
}

function startGame() {
    clearInterval(timer);
    snake = [{ x: 13, y: 12 }, { x: 14, y: 12 }, { x: 15, y: 12 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    scoreLabel.textContent = score;
    paused = false;
    placeApple();
    draw();
    timer = window.setInterval(update, 110);
}

function changeDirection(key) {
    const directions = {
        ArrowUp: { x: 0, y: -1 }, z: { x: 0, y: -1 }, Z: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, q: { x: -1, y: 0 }, Q: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 }
    };
    const requested = directions[key];

    if (requested && !(requested.x === -direction.x && requested.y === -direction.y)) {
        nextDirection = requested;
    }
}

document.addEventListener("keydown", event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault();
    }

    if (event.code === "Space" && (timer !== null || paused)) {
        if (paused) {
            paused = false;
            timer = window.setInterval(update, 110);
        } else {
            clearInterval(timer);
            timer = null;
            paused = true;
        }
        return;
    }

    changeDirection(event.key);
});

document.querySelector("#start").addEventListener("click", startGame);
placeApple();
snake = [{ x: 13, y: 12 }, { x: 14, y: 12 }, { x: 15, y: 12 }];
draw();
startGame();

