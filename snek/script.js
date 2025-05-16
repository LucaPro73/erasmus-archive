/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const restartBtn = document.querySelector(".restart")
const gridSize = 20
const tileCount = canvas.width / gridSize
let snake = [{ x: 10, y: 10 }]
let food = { x: 5, y: 5, color: "#242" }
let dx = 1, dy = 0
let score = 0, gameOver = false
let highScore = window.localStorage.getItem("highScore") || 0
let movedX = true, movedY = false

function drawRect(x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1)
}
function drawCircle(x, y, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2)
    ctx.fill()
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "#242"
        ctx.font = "30px monospace"
        ctx.textAlign = "center"
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillText("its joever", tileCount * tileCount / 2, tileCount * tileCount / 2)
        ctx.font = "16px monospace"
        ctx.textAlign = "left"
        ctx.fillText("Score: " + score, 10, canvas.width - 10)
        ctx.textAlign = "right"
        ctx.fillText("High score: " + highScore, canvas.width - 10, canvas.width - 10)
        return
    }

    const head = { x: snake[0].x, y: snake[0].y }
    if (movedX) head.x += dx
    else dx = 0
    if (movedY) head.y += dy
    else dy = 0
    if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount
        || snake.some(p => p.x === head.x && p.y === head.y)
    ) {
        gameOver = true
        if (score > highScore) {
            localStorage.setItem("highScore", highScore)
        }
        restartBtn.style.display = "block"
        return
    }

    snake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
        score++
        if (score > highScore) {
            highScore = score
        }
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            color: "#22" + Math.floor(Math.random() * (120 - 17) + 17).toString(16) + "22"
        }
        while (snake.every(s => s.x !== food.x && s.y !== food.y)) {
            food.x = Math.floor(Math.random() * tileCount)
            food.y = Math.floor(Math.random() * tileCount)
        }
    } else {
        snake.pop()
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    snake.forEach((s, i) => {
        drawRect(s.x, s.y, i === 0 ? "#222" : "#242")
    })
    drawCircle(food.x, food.y, food.color)

    ctx.fillStyle = "#242"
    ctx.font = "16px monospace"
    ctx.textAlign = "left"
    ctx.fillText("Score: " + score, 10, canvas.width - 10)
    ctx.textAlign = "right"
    ctx.fillText("High score: " + highScore, canvas.width - 10, canvas.width - 10)
}

setInterval(gameLoop, 100)

function restart() {
    snake = [{ x: 10, y: 10 }]
    food = { x: 5, y: 5 }
    dx = 1, dy = 0
    score = 0, gameOver = false
    movedX = true, movedY = false
    restartBtn.style.display = "none"
}
restartBtn.addEventListener("click", restart)

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dy === 0) { dy = -1; movedX = false; movedY = true; }
    else if (e.key === "ArrowDown" && dy === 0) { dy = 1; movedX = false; movedY = true; }
    else if (e.key === "ArrowLeft" && dx === 0) { dx = -1; movedX = true; movedY = false; }
    else if (e.key === "ArrowRight" && dx === 0) { dx = 1; movedX = true; movedY = false; }
    if (e.key === " " && gameOver) restart()
})