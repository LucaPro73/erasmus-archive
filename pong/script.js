/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

const paddleHeight = 100
const paddleWidth = 10
const ballSize = 10
let leftPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, score: 0 }
let rightPaddle = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, score: 0 }

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 3 * (Math.random() > 0.5 ? 1 : -1),
    dy: 2.7 * (Math.random() > 0.5 ? 1 : -1)
}

let target = {
    x: Math.floor(Math.random() * canvas.width - 80) + 40,
    y: Math.floor(Math.random() * canvas.height - 20) + 10
}

const keys = {}
document.addEventListener("keydown", e => keys[e.key] = true)
document.addEventListener("keyup", e => keys[e.key] = false)

function resetBall() {
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2
    ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1)
    ball.dy = 2.7 * (Math.random() > 0.5 ? 1 : -1)
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
}

function drawBall() {
    drawRect(ball.x, ball.y, ballSize, ballSize, "white")
}

function drawScores() {
    ctx.font = "20px Arial"
    ctx.textAlign = "left"
    ctx.fillText(leftPaddle.score, 10, 30)
    ctx.textAlign = "right"
    ctx.fillText(rightPaddle.score, canvas.width - 10, 30)
}

const targetWidth = 30, targetHeight = 30, targetPointCount = 3
function drawTarget() {
    const { x, y } = target
    drawRect(x - targetWidth / 2, y - targetHeight / 2, targetWidth, targetHeight, "red")
    drawRect(x - (targetWidth / 4 * 3) / 2, y - (targetHeight / 4 * 3) / 2, targetWidth / 4 * 3, targetHeight / 4 * 3, "white")
    drawRect(x - targetWidth / 2 / 2, y - targetHeight / 2 / 2, targetWidth / 2, targetHeight / 2, "red")
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white"
    ctx.fillText(targetPointCount, x, y)
}

function isColliding(a, b) {
    // drawRect(b.x, b.y, b.width, b.height, "green")
    return (
        a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y
    )
}

function update() {
    if (keys["w"] && leftPaddle.y > 0) leftPaddle.y -= 6
    if (keys["s"] && leftPaddle.y + paddleHeight < canvas.height) leftPaddle.y += 6
    if (keys["ArrowUp"] && rightPaddle.y > 0) rightPaddle.y -= 6
    if (keys["ArrowDown"] && rightPaddle.y + paddleHeight < canvas.height) rightPaddle.y += 6

    ball.x += ball.dx
    ball.y += ball.dy

    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) ball.dy *= -1

    if (isColliding(
        { ...ball, width: ballSize, height: ballSize },
        { ...leftPaddle, width: paddleWidth, height: paddleHeight }
    )) {
        let parity = ball.dx > 0 ? -1 : 1
        ball.dx = Math.abs(ball.dx) * 1.03 * parity
        ball.dy *= 1.017
        ball.x = leftPaddle.x + paddleWidth
    }
    else if (isColliding(
        { ...ball, width: ballSize, height: ballSize },
        { ...rightPaddle, width: paddleWidth, height: paddleHeight }
    )) {
        let parity = ball.dx > 0 ? -1 : 1
        ball.dx = Math.abs(ball.dx) * 1.03 * parity
        ball.dy *= 1.017
        ball.x = rightPaddle.x - paddleWidth
    }

    if (isColliding(
        { ...ball, width: ballSize, height: ballSize },
        { x: target.x - targetWidth / 2, y: target.y - targetHeight / 2, width: targetWidth, height: targetHeight }
    )) {
        if (ball.dx > 0) leftPaddle.score += targetPointCount
        else rightPaddle.score += targetPointCount
        target.x = Math.floor(Math.random() * canvas.width - 80) + 40
        target.y = Math.floor(Math.random() * canvas.height - 20) + 10
    }

    if (ball.x < 0) {
        rightPaddle.score++
        resetBall()
    } else if (ball.x > canvas.width) {
        leftPaddle.score++
        resetBall()
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight, "#AAAAAA")
    drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight, "#AAAAAA")
}

function gameLoop() {
    draw()
    drawBall()
    drawScores()
    drawTarget()
    update()
    requestAnimationFrame(gameLoop)
}
gameLoop()