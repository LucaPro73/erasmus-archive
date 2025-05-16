/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let width = document.body.clientWidth, height = document.body.clientHeight
let requestID
let player = {
    width: 25,
    height: 25,
    x: Math.round(width / 2 - 12.5),
    y: Math.round(height / 2 - 12.5)
}
let score = 0
let hiscore = window.localStorage.getItem("hiscore") || "0"
let pressedKeys = {
    w: false,
    a: false,
    s: false,
    d: false
}
let speed = 5
let frame = 0
let lastSwing = 0
let lives = 3
let invFrames = 120
let currentRoom = [0, 0]

/**
 * @type {{
 * selfPosition: [number, number]
 * doorPostions: ("top"|"bottom"|"left"|"right")[],
 * doorBoxes: {x: number, y: number, height: number, width: number}[]
 * boxes: {x: number, y: number, height: number, width: number}[],
 * enemies: {
 * x: number,
 * y: number,
 * height: number,
 * width: number
 * tick: number,
 * direction: number
 * }[],
 * potions: {x: number, y: number, height: number, width: number}[]
 * }[]}
 */
let rooms = []

canvas.style.width = width + "px"
canvas.style.height = height + "px"
let scale = window.devicePixelRatio
canvas.width = width * scale
canvas.height = height * scale
ctx.scale(scale, scale)

requestID = requestAnimationFrame(update)

function rand(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from)
}

function spawnRoom(pos, from, door) {
    if (rooms.find(r => r.selfPosition[0] === pos[0] && r.selfPosition[1] === pos[1])) return
    /** @type {typeof rooms[0]} */
    const room = {}
    room.selfPosition = pos
    room.doorPostions = []
    room.doorBoxes = []
    room.boxes = []
    room.enemies = []
    room.potions = []
    if (from) {
        room.doorPostions.push(door)
        // im sorry
        if ((() => {
            const ajRoom = rooms.find(r => r.selfPosition[0] === pos[0] && r.selfPosition[1] === pos[1] + 1)
            if (!ajRoom || ajRoom.doorPostions.includes("bottom")) return true
            else return false
        })() && rand(1, 3) === 1)
            room.doorPostions.push("top")
        if ((() => {
            const ajRoom = rooms.find(r => r.selfPosition[0] === pos[0] && r.selfPosition[1] === pos[1] - 1)
            if (!ajRoom || ajRoom.doorPostions.includes("top")) return true
            else return false
        })() && rand(1, 3) === 1)
            room.doorPostions.push("bottom")
        if ((() => {
            const ajRoom = rooms.find(r => r.selfPosition[0] === pos[0] - 1 && r.selfPosition[1] === pos[1])
            if (!ajRoom || ajRoom.doorPostions.includes("right")) return true
            else return false
        })() && rand(1, 3) === 1)
            room.doorPostions.push("left")
        if ((() => {
            const ajRoom = rooms.find(r => r.selfPosition[0] === pos[0] + 1 && r.selfPosition[1] === pos[1])
            if (!ajRoom || ajRoom.doorPostions.includes("left")) return true
            else return false
        })() && rand(1, 3) === 1)
            room.doorPostions.push("right")
    }
    else room.doorPostions.push(["top", "bottom", "left", "right"][rand(0, 3)])
    if (room.doorPostions.includes("top"))
        room.doorBoxes.push({
            x: 0,
            y: 0,
            width: width / 2 - 50,
            height: 50
        }, {
            x: width / 2 + 50,
            y: 0,
            width: width / 2 - 50,
            height: 50
        })
    else room.doorBoxes.push({
        x: 0,
        y: 0,
        width: width,
        height: 50
    })
    if (room.doorPostions.includes("bottom"))
        room.doorBoxes.push({
            x: 0,
            y: height - 50,
            width: width / 2 - 50,
            height: 50
        }, {
            x: width / 2 + 50,
            y: height - 50,
            width: width / 2 - 50,
            height: 50
        })
    else room.doorBoxes.push({
        x: 0,
        y: height - 50,
        width: width,
        height: 50
    })
    if (room.doorPostions.includes("left"))
        room.doorBoxes.push({
            x: 0,
            y: 0,
            width: 50,
            height: height / 2 - 50
        }, {
            x: 0,
            y: height / 2 + 50,
            width: 50,
            height: height / 2 - 50
        })
    else room.doorBoxes.push({
        x: 0,
        y: 0,
        width: 50,
        height: height
    })
    if (room.doorPostions.includes("right"))
        room.doorBoxes.push({
            x: width - 50,
            y: 0,
            width: 50,
            height: height / 2 - 50
        }, {
            x: width - 50,
            y: height / 2 + 50,
            width: 50,
            height: height / 2 - 50
        })
    else room.doorBoxes.push({
        x: width - 50,
        y: 0,
        width: 50,
        height: height
    })

    let boxCount = rand(3, 7)
    for (let i = 0; i < boxCount; i++) {
        let bx = rand(100, width - 100), by = rand(100, height - 100)
        while (Math.abs(bx - width / 2) < 50 || Math.abs(by - height / 2) < 50) {
            bx = rand(100, width - 100)
            by = rand(100, height - 100)
        }
        room.boxes.push({ x: bx, y: by, height: 50, width: 50 })
    }
    let boxes = [...room.doorBoxes, ...room.boxes]
    let enemyCount = rand(3, 7)
    for (let i = 0; i < enemyCount; i++) {
        let ex = rand(100, width - 100), ey = rand(100, height - 100)
        while (wouldCollide(ex, ey, 25, 25, boxes)) {
            ex = rand(100, width - 100)
            ey = rand(100, height - 100)
        }
        room.enemies.push({ x: ex, y: ey, width: 25, height: 25, tick: rand(0, 60), direction: rand(0, 8) })
    }
    let potionCount = rand(0, 2)
    for (let i = 0; i < potionCount; i++) {
        let ex = rand(100, width - 100), ey = rand(100, height - 100)
        while (wouldCollide(ex, ey, 25, 25, boxes)) {
            ex = rand(100, width - 100)
            ey = rand(100, height - 100)
        }
        if (rand(1, 2) === 1) room.potions.push({ x: ex, y: ey, width: 25, height: 25 })
    }

    rooms.push(room)
}

spawnRoom([0, 0])
window.rooms = rooms
window.currentRoom = currentRoom
function update() {
    let room = rooms.find(r => r.selfPosition[0] === currentRoom[0] && r.selfPosition[1] === currentRoom[1])
    if (!room) {
        spawnRoom(currentRoom)
        room = rooms.find(r => r.selfPosition[0] === currentRoom[0] && r.selfPosition[1] === currentRoom[1])
    }
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "brown"
    ctx.beginPath()
    ctx.rect(0, 0, width, height)
    ctx.fill()

    ctx.fillStyle = "black"
    ctx.beginPath()
    room.doorBoxes.forEach(b => ctx.rect(b.x, b.y, b.width, b.height))
    room.boxes.forEach(b => ctx.rect(b.x, b.y, 50, 50))
    ctx.fill()

    ctx.fillStyle = "white"
    ctx.font = "32px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Score: " + score, 20, 40)
    if (score > parseInt(hiscore)) {
        hiscore = score.toString()
        window.localStorage.setItem("hiscore", hiscore)
    }
    ctx.textAlign = "right"
    ctx.fillText("High Score: " + hiscore, width - 20, 40)

    ctx.fillStyle = "red"
    ctx.beginPath()
    for (let i = 0; i < lives; i++) {
        ctx.fillRect(15, 50 + i * 30, 25, 25)
    }

    let boxes = [...room.doorBoxes, ...room.boxes]
    room.enemies.forEach(e => {
        if ((frame - e.tick) % 60 === 0)
            e.direction = rand(1, 8)
        let temp = { ...e }
        if (temp.direction === 1) { temp.y -= 2.5 }
        else if (temp.direction === 2) { temp.y -= 2.5; temp.x += 2.5 }
        else if (temp.direction === 3) { temp.x += 2.5 }
        else if (temp.direction === 4) { temp.y += 2.5; temp.x += 2.5 }
        else if (temp.direction === 5) { temp.y += 2.5; }
        else if (temp.direction === 6) { temp.y += 2.5; temp.x -= 2.5 }
        else if (temp.direction === 7) { temp.x -= 2.5 }
        else if (temp.direction === 8) { temp.y -= 2.5; temp.x -= 2.5 }
        if (wouldCollide(temp.x, temp.y, 25, 25, boxes)) e.direction = rand(1, 8)
        else { e.x = temp.x; e.y = temp.y }
    })
    ctx.fillStyle = "gold"
    ctx.beginPath()
    room.enemies.forEach(b => ctx.rect(b.x, b.y, 25, 25))
    ctx.fill()

    ctx.fillStyle = "green"
    ctx.beginPath()
    room.potions.forEach(b => ctx.rect(b.x, b.y, 25, 25))
    ctx.fill()

    let diff = { x: 0, y: 0 }
    swinging = false
    Object.entries(pressedKeys).forEach(([k, p]) => {
        if (!p) return;
        switch (k) {
            case "w": {
                diff.y -= speed
                break
            } case "a": {
                diff.x -= speed
                break
            } case "s": {
                diff.y += speed
                break
            } case "d": {
                diff.x += speed
                break
            }
        }
    })

    if (!wouldCollide(player.x + diff.x, player.y + diff.y, player.width, player.height, boxes)) {
        player.x += diff.x
        player.y += diff.y
    }
    ctx.beginPath()
    ctx.fillStyle = "blue"
    ctx.fillRect(player.x, player.y, player.width, player.height)

    if (player.x < 0) {
        spawnRoom([currentRoom[0] - 1, currentRoom[1]], currentRoom, "right")
        player.x = width
        currentRoom = [currentRoom[0] - 1, currentRoom[1]]
        console.log("exited through the left")
    }
    if (player.x > width) {
        spawnRoom([currentRoom[0] + 1, currentRoom[1]], currentRoom, "left")
        player.x = 0
        currentRoom = [currentRoom[0] + 1, currentRoom[1]]
        console.log("exited through the right")
    }
    if (player.y < 0) {
        spawnRoom([currentRoom[0], currentRoom[1] + 1], currentRoom, "bottom")
        player.y = height
        currentRoom = [currentRoom[0], currentRoom[1] + 1]
        console.log("exited through the top")
    }
    if (player.y > height) {
        spawnRoom([currentRoom[0], currentRoom[1] - 1], currentRoom, "top")
        player.y = 0
        currentRoom = [currentRoom[0], currentRoom[1] - 1]
        console.log("exited through the bottom")
    }

    if (lastSwing < 15) {
        ctx.beginPath()
        ctx.fillStyle = "red"
        let sx, sy, sw, sh
        if (pressedKeys.s) { sx = player.x + player.width / 2 - 7.25; sy = player.y + 25; sw = 12.5; sh = 50 }
        else if (pressedKeys.d) { sx = player.x + player.width; sy = player.y + 7.25; sw = 50; sh = 12.5 }
        else if (pressedKeys.a) { sx = player.x - player.width - 25; sy = player.y + 7.25; sw = 50; sh = 12.5 }
        else if (pressedKeys.w) { sx = player.x + 7.25; sy = player.y - 50; sw = 12.5; sh = 50 }
        ctx.fillRect(sx, sy, sw, sh)
        const enemy = wouldCollide(sx, sy, sw, sh, room.enemies)
        if (enemy) {
            room.enemies.splice(room.enemies.indexOf(enemy), 1)
            score++
        }
    }

    const potion = wouldCollide(player.x, player.y, player.width, player.height, room.potions)
    if (potion) {
        room.potions.splice(room.potions.indexOf(potion), 1)
        lives++
    }

    if (wouldCollide(player.x, player.y, player.width, player.height, room.enemies)) {
        if (invFrames == 0) {
            if (lives > 1) {
                lives--
                invFrames = 60
            }
            else {
                alert("Game over! Final score: " + score)
                resetGameState()
            }
        }
    }

    frame++
    lastSwing++
    if (invFrames > 0) invFrames--
    requestID = requestAnimationFrame(update)
}

function resetGameState() {
    player = {
        width: 25,
        height: 25,
        x: Math.round(width / 2 - 12.5),
        y: Math.round(height / 2 - 12.5)
    }
    pressedKeys = {}
    rooms = []
    score = 0
    lives = 3
    spawnRoom([0, 0])
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y
    )
}

function wouldCollide(x, y, width, height, objects) {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i]
        if (isColliding({ x, y, width, height }, obj))
            return obj
    }
    return false
}

document.body.addEventListener("keydown", e => {
    if (["w", "a", "s", "d"].includes(e.key.toLowerCase()))
        pressedKeys[e.key.toLowerCase()] = true
    else if (e.key === " ") lastSwing = 0;
})

document.body.addEventListener("keyup", e => {
    if (["w", "a", "s", "d"].includes(e.key.toLowerCase()))
        pressedKeys[e.key.toLowerCase()] = false
})