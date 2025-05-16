/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
ctx.scale(20, 20)
/** @type {HTMLCanvasElement} */
const preview = document.getElementById("preview")
const pctx = preview.getContext("2d")
pctx.scale(20, 20)

const info = document.getElementById("info")
const scoreDisplay = document.getElementById("score")
let score = 0
function updateScore() {
    scoreDisplay.textContent = score
}

const arena = createMatrix(12, 20)
const player = {
    pos: { x: 0, y: 0 },
    matrix: undefined,
    nextMatrix: undefined
}

const colors = [
    null,
    "rgba(198, 160, 246",  // #c6a0f6
    "rgba(238, 212, 159",  // #eed49f
    "rgba(138, 173, 244",  // #8aadf4
    "rgba(245, 169, 127",  // #f5a97f
    "rgba(145, 215, 227",  // #91d7e3
    "rgba(166, 218, 149",  // #a6da95
    "rgba(237, 135, 150",  // #ed8796
];
const pieces = "TJLOSZI"

let started = false
const mainTheme = new Audio("./assets/Tetris 99 - Main Theme [63hoSNvS6Z4].m4a")
const fastTheme = new Audio("./assets/50 Players Remaining! - Tetris 99 [OST] [eD8ds9NEWBc].m4a")
const gameOverSfx = new Audio("./assets/Pac-Man Death - Sound Effect (HD) [NxSj2T2vx7M].m4a")
mainTheme.load(); gameOverSfx.load(); fastTheme.load()

function createMatrix(w, h) {
    const matrix = []
    while (h--) matrix.push(new Array(w).fill(0))
    return matrix
}

function createPieces(type) {
    switch (type) {
        case "T": return [[0, 1, 0], [1, 1, 1], [0, 0, 0]]
        case "O": return [[2, 2], [2, 2]]
        case "L": return [[0, 0, 3], [3, 3, 3], [0, 0, 0]]
        case "J": return [[4, 0, 0], [4, 4, 4], [0, 0, 0]]
        case "I": return [[0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0]]
        case "S": return [[0, 6, 6], [6, 6, 0], [0, 0, 0]]
        case "Z": return [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
    }
}

function drawMatrix(matrix, offset, ctx, opacity) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillStyle = opacity ? `${colors[value]}, ${opacity})` : colors[value]
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1)
            }
        })
    })
}

let ghostMatrix
function generateGhostMatrix(arena, player) {
    const p = structuredClone(player), a = structuredClone(arena)
    while (!collide(a, p)) {
        p.pos.y++
    }
    p.pos.y--
    merge(a, p)
    ghostMatrix = a
}

function draw() {
    ctx.fillStyle = "#24273a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawMatrix(arena, { x: 0, y: 0 }, ctx)
    drawMatrix(ghostMatrix, { x: 0, y: 0 }, ctx, 0.4)
    drawMatrix(player.matrix, player.pos, ctx)
}

function drawNext() {
    pctx.fillStyle = "#24273a"
    pctx.fillRect(0, 0, preview.width, preview.height)
    drawMatrix(player.nextMatrix, { x: 0, y: 0 }, pctx)
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => row.forEach((value, x) => {
        if (value) arena[y + player.pos.y][x + player.pos.x] = value
    }))
}

function collide(arena, player) {
    const m = player.matrix
    const o = player.pos
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true
            }
        }
    }
    return false
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]
        }
    }
    if (dir > 0) matrix.forEach(row => row.reverse())
    else matrix.reverse()
}

function playerDrop() {
    player.pos.y++
    if (collide(arena, player)) {
        player.pos.y--
        merge(arena, player)
        playerReset()
        arenaSweep()
        updateScore()
        dropCounter = 0
        generateGhostMatrix(arena, player)
        return true
    }
    dropCounter = 0
    return false
}

function playerSlamDrop() {
    while (!playerDrop()) { }
}

function playerMove(dir) {
    player.pos.x += dir
    if (collide(arena, player)) player.pos.x -= dir
    generateGhostMatrix(arena, player)
}

function playerRotate(dir) {
    const pos = player.pos.x
    let offset = 1
    rotate(player.matrix, dir)
    while (collide(arena, player)) {
        player.pos.x += offset
        offset = -(offset + (offset > 0 ? 1 : -1))
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir)
            player.pos.x = pos
            return
        }
    }
    generateGhostMatrix(arena, player)
}

function playerReset() {
    player.matrix = player.nextMatrix || createPieces(pieces[(Math.random() * pieces.length) | 0])
    player.nextMatrix = createPieces(pieces[(Math.random() * pieces.length) | 0])
    player.pos.y = 0
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0)
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0))
        mainTheme.pause()
        gameOverSfx.play()
        alert("Game over! Final score: " + score)
        window.location.reload()
    }
    generateGhostMatrix(arena, player)
}

function arenaSweep() {
    let linesCleared = 0
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] === 0) continue outer
        }
        const row = arena.splice(y, 1)[0].fill(0)
        arena.unshift(row)
        ++y
        linesCleared++
    }
    score += linesCleared ** 2 * 10
}

let dropCounter = 0
let dropInterval = 1000
let lastTime = 0

function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time
    dropCounter += deltaTime
    dropInterval = 1000 - time / 1000
    if (dropCounter > dropInterval) playerDrop()
    draw()
    drawNext()
    requestAnimationFrame(update)
}

function start() {
    if (started) return
    started = true
    document.getElementById("container").style.display = "none"
    canvas.style.display = "block"
    info.style.display = "block"
    preview.style.display = "block"
    playerReset()
    updateScore()
    mainTheme.play()
    setTimeout(() => {
        mainTheme.pause()
        fastTheme.play()
        fastTheme.loop = true
    }, 233200)
    update()
}

document.addEventListener("keydown", e => {
    if (!started) start()
    else {
        if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") playerMove(-1)
        else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") playerMove(1)
        else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") playerDrop()
        else if (e.key.toLowerCase() === "q") playerRotate(-1)
        else if (e.key.toLowerCase() === "e") playerRotate(1)
        else if (e.key === " ") playerSlamDrop()
        else if (e.key.toLowerCase() === "b") window.location.reload() 
    }
})

