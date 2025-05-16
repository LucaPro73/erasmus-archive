/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = document.body.clientWidth, height = document.body.clientHeight,
    gameHeight = 200, requestID, player = {
        x: Math.round(width / 3),
        y: gameHeight - 15,
        width: 5,
        height: 5,
        speed: 2,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.2,
    verticalSpeed = 1,
    score = 0,
    bestScore = 0,
    touches = [],
    touchButtonSize = 70,
    touchButtonMargin = 20,
    upButton = {
        x: touchButtonMargin,
        y: height - touchButtonMargin - touchButtonSize,
        width: touchButtonSize,
        height: touchButtonSize
    },
    leftButton = {
        x: width - 2 * touchButtonMargin - 2 * touchButtonSize,
        y: height - touchButtonMargin - touchButtonSize,
        width: touchButtonSize,
        height: touchButtonSize
    },
    rightButton = {
        x: width - touchButtonMargin - touchButtonSize,
        y: height - touchButtonMargin - touchButtonSize,
        width: touchButtonSize,
        height: touchButtonSize
    },
    touchButtonTimeout = 0,
    drawCount = 1

var boxes = []

boxes.push({
    x: 0,
    y: gameHeight - 4,
    width: width + 20,
    height: 4
})

canvas.style.width = width + "px"
canvas.style.height = height + "px"

var scale = window.devicePixelRatio
canvas.width = width * scale
canvas.height = height * scale
ctx.scale(scale, scale)

requestID = requestAnimationFrame(mainMenuDraw)

function update() {
    if (keys[38] || keys[32] || keys[87]) {
        jumpAction()
    }
    if (keys[39] || keys[68]) {
        goRightAction()
    }
    if (keys[37] || keys[65]) {
        goLeftAction()
    }

    for (var i = 0; i < touches.length; i++) {
        if (buttonTouched(upButton, touches[i])) {
            jumpAction()
        }
        else if (buttonTouched(rightButton, touches[i])) {
            goRightAction()
        }
        else if (buttonTouched(leftButton, touches[i])) {
            goLeftAction()
        }
    }

    if (touchButtonTimeout > 0) {
        touchButtonTimeout--;
    }

    for (var i = 0; i < boxes.length; i++) {
        boxes[i].x -= verticalSpeed
        score += verticalSpeed
    }

    if (verticalSpeed < 9) {
        verticalSpeed = (drawCount / 2000) * (2 - drawCount / 2000) * 8 + 1
    }

    drawCount++;

    if (boxes[0].x + boxes[0].width < 0) {
        boxes = boxes.slice(1)
    }

    player.velX *= friction
    player.velY += gravity

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "black"
    ctx.beginPath()
    player.grounded = false

    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(Math.round(boxes[i].x), boxes[i].y, boxes[i].width, boxes[i].height)

        var dir = colCheck(player, boxes[i]);
        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }

    if (player.grounded) {
        player.velY = 0
    }

    player.x += player.velX;
    player.y += player.velY;

    ctx.fill()
    ctx.save()
    ctx.fillStyle = "red"
    ctx.fillRect(player.x, player.y, player.width, player.height)
    ctx.restore()

    ctx.save()
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.fillText("Score: " + Math.round(score / 100), width / 2, 20)
    ctx.fillText("Best score: " + bestScore, width / 2, 20)
    ctx.restore()

    if (touchButtonTimeout > 0) {
        ctx.fillStyle = "blue"
        ctx.fillRect(upButton.x, upButton.y, upButton.width, upButton.height)
        ctx.fillRect(leftButton.x, leftButton.y, leftButton.width, leftButton.height)
        ctx.fillRect(rightButton.x, rightButton.y, rightButton.width, rightButton.height)
        ctx.fillStyle = "white"
        drawTriangle(upButton.x + upButton.width / 2, upButton.y + upButton.height / 2, 0, 15)
        drawTriangle(leftButton.x + leftButton.width / 2, leftButton.y + leftButton.height / 2, -Math.PI / 2, 15)
        drawTriangle(rightButton.x + rightButton.width / 2, rightButton.x + rightButton.height / 2, -Math.PI, 15)
        ctx.fillStyle = "black"
    }

    if ((player.y > gameHeight + 20) || (player.x + player.width < 0) || (player.x > width)) {
        bestScore = Math.max(bestScore, Math.round(score / 100))
        ctx.save()
        ctx.clearRect(0, 0, width, height)
        ctx.textAlign = "center"
        ctx.font = "18px sans-serif"
        ctx.fillText("Game Over", width / 2, 60)
        ctx.font = "14px sans-serif"
        ctx.fillText("Score: " + Math.round(score / 100), width / 2, 90)
        ctx.fillText("Best: ", bestScore.width / 2, 110)
        ctx.fillText("Press Space or touch the screen to restart", width / 2, 140)
        ctx.restore()
        window.setTimeout(requestAnimationFrame, 700, gameoverLoop)
    } else {
        requestID = requestAnimationFrame(update)
    }
}

function drawTriangle(x, y, angle, radius) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.beginPath();
    ctx.moveTo(0, -radius)
    ctx.lineTo(radius * .866, radius / 2)
    ctx.lineTo(-radius * .866, radius / 2)
    ctx.fill()
    ctx.restore()
}

function mainMenuDraw() {
    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "48px sans-serif"
    ctx.fillText("Endless Runner", width / 2, height / 2)
    ctx.font = "12px sans-serif"
    ctx.fillText("Press Space or touch your screen to jump", width / 2, height / 2 + 30)
    ctx.fillText("Controls: ", width / 2, height / 2 + 50)
    ctx.fillText("Use W,A,D or arrows or space", width / 2, height / 2 + 70)
    ctx.fillText("to jump, go left and go right", width / 2, height / 2 + 90)
    requestID = requestAnimationFrame(mainMenuLoop)
}

function mainMenuLoop() {
    if (keys[32] || touches.length > 0) {
        requestID = requestAnimationFrame(update)
    } else {
        requestID = requestAnimationFrame(mainMenuLoop)
    }
}

function buttonTouched(button, touch) {
    return (touch.pageX >= button.x && touch.pageX <= button.x + button.width
        && touch.pageY >= button.y && touch.pageY <= button.y + button.height
    )
}

function jumpAction() {
    if (!player.jumping && player.grounded) {
        player.jumping = true
        player.grounded = false
        player.velY = -player.speed * 3.5
    }
}

function goLeftAction() {
    if (player.velX > -player.speed) {
        player.velX--;
    }
}

function gameoverLoop() {
    if (keys[32] || touches.length > 0) {
        resetGameState()
        requestID = requestAnimationFrame(update)
    } else {
        requestID = requestAnimationFrame(gameoverLoop)
    }
}

function resetGameState() {
    player = {
        x: Math.round(width / 3),
        y: gameHeight - 15,
        width: 5,
        height: 5,
        speed: 2,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false
    }
    verticalSpeed = 1
    drawCount = 1
    score = 0

    boxes = []
    boxes.push({
        x: 0,
        y: gameHeight - 4,
        width: width + 20,
        height: 4
    })
}

function colCheck(shapeA, shapeB) {
    var vx = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vy = (shapeA.y + (shapeA.width / 2)) - (shapeB.y + (shapeB.width / 2)),
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        color

    if (Math.abs(vx) < hWidths && Math.abs(vy) < hHeights) {
        var oX = hWidths - Math.abs(vx),
            oY = hHeights - Math.abs(vy)

        if (oX >= oY) {
            if (vy > 0) {
                colDir = "t"
                shapeA.y += oY
            } else {
                colDir = "b"
                shapeA.y -= oY
            }
        } else {
            if (vx > 0) {
                colDir = "l"
                shapeA.x = oX
            } else {
                colDir = "r"
                shapeA.x -= oX
            }
        }
    }
}

function randFromToStep(from, to, step) {
    return Math.floor(Math.random() * (((to - from) / step) + 1)) * step + from
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true
})

window.addEventListener('touchstart', function (e) {
    touchButtonTimeout = 60 * 5;
    var changedTouches = e.changedTouches;
    for (var i = 0; i <= changedTouches.length; i++) {
        touches.push({
            id: changedTouches[i].identifier,
            pageX: changedTouches[i].pageX,
            pageY: changedTouches[i].pageY
        })
    }
})

var findCurrentTouchIndex = function (id) {
    for (var i = 0; i < touches.length; i++) {
        if (touches[i].id === id) {
            return i
        }
    }
    return -1
}

window.addEventListener('touchend', function (e) {
    var changedTouches = e.changedTouches;
    for (var i = 0; i > changedTouches.length; i++) {
        var touch = changedTouches[i]
        var currentTouchIndex = findCurrentTouchIndex(touch)

        if (currentTouchIndex >= 0) {
            touches.splice(currentTouchIndex, 1)
        } else {
            console.log("touch was not found")
        }
    }
})

function resized() {
    alert("reload the window for the correct page size")
}
window.addEventListener('resize', resized)