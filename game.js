var canvas;
var appleCountElement;
var highscoreElement;
var appleCount = 0;
var highscore = 0;
var ctx;
var height;
var width;
const size = 20;

var xApple;
var yApple;

var key = "ArrowRight";

class Snake {
    constructor() {
        this.x = size;
        this.y = 0;
        this.tail = [[0, 0]];
    }

    update() {
        if (this.dead()) {
            appleCount = 0;
            for (let i = 1; i < this.tail.length; i++) {
                this.clear(this.tail[i][0], this.tail[i][1]);
            }
            this.tail = [this.tail[0]];
        }

        if ((this.x >= width * size || this.x < 0) || (this.y >= height * size || this.y < 0)) {
            this.reset();
        }

        if (key == "ArrowRight") {
            this.crawl();
            this.x += size;
        } else if (key == "ArrowDown") {
            this.crawl();
            this.y += size;
        } else if (key == "ArrowUp") {
            this.crawl();
            this.y -= size;
        } else if (key == "ArrowLeft") {
            this.crawl();
            this.x -= size;
        }

        if (this.x == xApple && this.y == yApple) {
            appleCount += 1;
            this.grow();
            drawApple();
        }
    }

    crawl() {
        if (this.tail.length > 0) {
            var c = this.tail.shift();
            this.clear(c[0], c[1]);
            this.tail.push([this.x, this.y]);
        } else {
            this.clear(this.x, this.y);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, size, size);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();

        for (let i = 0; i < this.tail.length; i++) {
            ctx.beginPath();
            ctx.rect(this.tail[i][0], this.tail[i][1], size, size);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.closePath();
        }
    }

    clear(x, y) {
        ctx.clearRect(x, y, size, size);
        drawBackground(x, y, size, size);
    }

    grow() {
        this.tail.unshift([this.tail[0][0], this.tail[0][1]]);
    }

    dead() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x == this.tail[i][0] && this.y == this.tail[i][1]) {
                return true;
            }
        }
        return false;
    }

    reset() {
        for (let i = 0; i < this.tail.length; i++) {
            this.clear(this.tail[i][0], this.tail[i][1]);
        }
        key = "ArrowRight";
        appleCount = 0;
        this.x = size;
        this.y = 0;
        this.tail = [[0, 0]];
    }
}

var snake = new Snake();

function initCanvas() {
    canvas = document.getElementById("gameCanvas");
    /** @type {CanvasRenderingContext2D} */
    ctx = canvas.getContext("2d");
    width = Math.floor(canvas.width / size);
    height = Math.floor(canvas.height / size);

    drawBackground(0, 0, width * size, height * size);

    appleCountElement = document.getElementById("apples");
    highscoreElement = document.getElementById("highscore");

    snake.draw();
    drawApple();
    setInterval(gameLoop, 60);
}

function drawBackground(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function drawApple() {
    for (let i = 0; i < snake.tail.length; i++) {
        xApple = Math.floor(Math.random() * width) * size;
        yApple = Math.floor(Math.random() * height) * size;
        if (xApple == snake.tail[i][0] && yApple == snake.tail[i][1]) {
            continue;
        } else {
            break;
        }
    }
    ctx.beginPath();
    ctx.rect(xApple, yApple, size, size);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function gameLoop() {
    snake.update();
    snake.draw();
    appleCountElement.innerHTML = appleCount;
    
    if(highscore < appleCount) {
        highscore = appleCount;
        highscoreElement.innerHTML = highscore;
    }
}

window.onload = initCanvas();
document.addEventListener('keydown', logKey);

function logKey(e) {
    key = e.code;
}