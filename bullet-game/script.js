/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
/** @type {HTMLCanvasElement} */
let bgCanvas = document.getElementById("bgCanvas")
let bgCtx = bgCanvas.getContext("2d")
let width = 1600, height = 800
let requestID, lastTime = 0

const click = new Audio("./assets/click.ogg")
click.load()
const no = new Audio("./assets/no.ogg")
no.load()
const dash = new Audio("./assets/dash.ogg")
dash.load()
dash.volume = 0.75
const hit = new Audio("./assets/hit.ogg")
hit.load()
const explode = new Audio("./assets/no.ogg")
explode.load()

const context = new AudioContext()
let mainMenuLoopBuffer, node
fetch("./assets/menuloop.mp3").then(r => r.arrayBuffer().then(b => {
    context.decodeAudioData(b).then(n => mainMenuLoopBuffer = n)
}))

function playLoop() {
    if (node) node.stop()
    node = context.createBufferSource()
    node.buffer = mainMenuLoopBuffer
    node.loop = true
    node.connect(context.destination)
    node.start(0)
}

function resize() {
    const scale = window.devicePixelRatio || 1

    canvas.style.width = window.innerWidth + "px"
    canvas.style.height = window.innerHeight + "px"
    canvas.width = window.innerWidth * scale
    canvas.height = window.innerHeight * scale
    ctx.scale(
        (window.innerWidth / width) * scale,
        (window.innerHeight / height) * scale
    )

    bgCanvas.style.width = window.innerWidth + "px"
    bgCanvas.style.height = window.innerHeight + "px"
    bgCanvas.width = window.innerWidth * scale
    bgCanvas.height = window.innerHeight * scale
    bgCtx.scale(
        (window.innerWidth / width) * scale,
        (window.innerHeight / height) * scale
    )
}
resize()
window.addEventListener("resize", resize)

const playerSpeed = 4
const dashCooldown = 500
const initPlayer = {
    width: 20,
    height: 20,
    x: Math.round(width / 3),
    y: Math.round(height / 2 - 10),
    angle: 0,
    vx: 0,
    vy: 0,
    isDashing: false,
    dashSpeed: 0,
    hp: 3,
    invUntil: 0
}
let player = { ...initPlayer }

let dashCount = 0
let lastDash = 0

const levels = [{
    name: "More coming soon!",
    artist: "(probably never)"
}]
import("./levels/AuroraBorealis.js").then(i => {
    levels.unshift(i.level)
})

let selectedLevel = {}
let startTime = 0
let levelEnd = false
/** @type {{ x: number, y: number, height: number, width: number, angle?: number, 
 * moveSpeed?: number, moveSideways?: boolean, windup?: number, lifespan?: number,
 * repeatCount?: number, repeatDirection?: "x" | "y", repeatDistance?: number }} */
const defaultObstacle = {
    x: undefined,
    y: undefined,
    height: undefined,
    width: undefined,
    angle: 0,
    moveSpeed: 0,
    moveSideways: false,
    windup: 2,
    lifespan: 8,
    repeatCount: 1,
    repeatDirection: "x",
    repeatDistance: 0
}
/** @type {[number, typeof defaultObstacle][]} */
let obstacleState = []

let mouseX, mouseY, mouse1click = false, mouse2click = false

function fillAngledRect(x, y, w, h, a, radians = false) {
    ctx.save()
    ctx.translate(x + w / 2, y + h / 2)
    ctx.rotate(radians ? a : a * Math.PI / 180)
    ctx.rect(-w / 2, -h / 2, w, h)
    ctx.restore()
}

function fillAngledImage(img, x, y, w, h, a, radians = false) {
    ctx.save()
    ctx.translate(x + w / 2, y + h / 2)
    ctx.rotate(radians ? a : a * Math.PI / 180)
    ctx.drawImage(img, -w / 2, -h / 2, w, h)
    ctx.restore()
}

function scaleRect(obj, scaleX, scaleY) {
    scaleY ??= scaleX
    const { x, y, width, height, angle = 0 } = obj
    const newWidth = width * scaleX
    const newHeight = height * scaleY
    return {
        x: x + width / 2 - newWidth / 2,
        y: y + height / 2 - newHeight / 2,
        width: newWidth,
        height: newHeight,
        angle
    }
}

function clickedCircle(x, y, radius) {
    const dx = mouseX - x
    const dy = mouseY - y
    return dx * dx + dy * dy <= radius * radius
}

let bgScrollSpeed = 0.5
let bgScrollOffset = 0
const trigFnValues = {}
function drawBackground(angle, speed, deltaTime) {
    const framerateMultiplier = (60 / 1000) * deltaTime
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
    bgCtx.fillStyle = "black"
    bgCtx.fillRect(0, 0, width, height)
    bgCtx.fillStyle = "#181818"
    bgCtx.font = "24px monospace"
    const radBgAngle = degToRad(angle)
    trigFnValues[radBgAngle] ??= {
        cos: Math.cos(radBgAngle),
        sin: Math.sin(radBgAngle)
    }
    const { sin, cos } = trigFnValues[radBgAngle]
    bgScrollOffset = (bgScrollOffset + speed * framerateMultiplier) % 300
    bgCtx.save()
    for (let y = -height / 2; y < height * 1.5; y += 40) {
        const yOffset = y + 20 + (bgScrollOffset * sin)
        for (let x = -width / 2; x < width * 1.5; x += 40) {
            const xOffset = x + 20 + (bgScrollOffset * cos)
            bgCtx.setTransform(cos, sin, -sin, cos, xOffset, yOffset)
            bgCtx.fillText(">", 0, 0)
        }
    }
    bgCtx.restore()
}

let shakeStrengh = 6
function triggerScreenShake() {
    let offx = 0, offy = 0
    let i = setInterval(() => {
        let dx = (Math.random() - 0.5) * 2 * shakeStrengh
        let dy = (Math.random() - 0.5) * 2 * shakeStrengh
        offx += dx
        offy += dy
        ctx.translate(dx, dy)
    }, 40)
    setTimeout(() => {
        clearInterval(i)
        ctx.translate(-offx, -offy)
    }, 300)
}

function lerpColor(color1, color2, t) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    const r1 = (c1 >> 16) & 0xFF, g1 = (c1 >> 8) & 0xFF, b1 = c1 & 0xFF;
    const r2 = (c2 >> 16) & 0xFF, g2 = (c2 >> 8) & 0xFF, b2 = c2 & 0xFF;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `rgb(${r}, ${g}, ${b})`;
}

function degToRad(deg) {
    return deg * Math.PI / 180
}
function getRotatedCorners(x, y, width, height, rad) {
    const cx = x + width / 2
    const cy = y + height / 2
    const dx = width / 2
    const dy = height / 2
    const corners = [
        { x: -dx, y: -dy },
        { x: dx, y: -dy },
        { x: dx, y: dy },
        { x: -dx, y: dy },
    ]
    return corners.map(p => {
        const rx = p.x * Math.cos(rad) - p.y * Math.sin(rad)
        const ry = p.x * Math.sin(rad) + p.y * Math.cos(rad)
        return { x: rx + cx, y: ry + cy }
    })
}
function projectPolygon(axis, points) {
    const dots = points.map(p => (p.x * axis.x + p.y * axis.y))
    return { min: Math.min(...dots), max: Math.max(...dots) }
}
function getAxes(corners) {
    const axes = []
    for (let i = 0; i < corners.length; i++) {
        const p1 = corners[i]
        const p2 = corners[(i + 1) % corners.length]
        const edge = { x: p2.x - p1.x, y: p2.y - p1.y }
        const axis = { x: -edge.y, y: edge.x }
        const length = Math.hypot(axis.x, axis.y)
        axes.push({ x: axis.x / length, y: axis.y / length })
    }
    return axes
}
function polygonsCollide(polyA, polyB) {
    const axes = [...getAxes(polyA), ...getAxes(polyB)]
    for (const axis of axes) {
        const projA = projectPolygon(axis, polyA)
        const projB = projectPolygon(axis, polyB)
        if (projA.max < projB.min || projB.max < projA.min) {
            return false
        }
    }
    return true
}
function wouldCollide(player, obj) {
    const { x, y, width, height, angle = 0 } = player
    const playerCorners = getRotatedCorners(x, y, width, height, angle)
    const objCorners = getRotatedCorners(obj.x, obj.y, obj.width, obj.height, obj.angle || 0)
    return polygonsCollide(playerCorners, objCorners)
}

function playSelectedAudio(seek = 0) {
    stopSelectedAudio()
    const audio = selectedLevel.audio
    const source = context.createBufferSource()
    source.buffer = audio.buffer
    if (!audio.gainNode) {
        audio.gainNode = context.createGain()
        audio.gainNode.gain.value = 1
    }
    source.connect(audio.gainNode).connect(context.destination)
    source.start(0, seek)
    audio.source = source
    audio.startTime = seek
    audio.playing = true
}
function stopSelectedAudio() {
    const audio = selectedLevel.audio
    if (audio.source) {
        try { audio.source.stop() } catch { }
        audio.source.disconnect()
        audio.source = null
    }
    audio.playing = false
}

function clearLevel() {
    transitionFrom = 0
    startTime = 0
    levelEnd = false
    clearTimeout(levelEndTimeout)
    mouse1click = false
    stopSelectedAudio()
    selectedLevel.audio.pausedAt = 0
    selectedLevel.audio.gainNode.gain.value = 1
    obstacleState = []
    player = { ...initPlayer }
}

const transitionDuration = 3500
function drawTransitionStart(title, description, since) {
    const arrowHeight = height * 0.75
    const elapsed = lastTime - since
    const progress = elapsed / (transitionDuration / 2)
    const arrowY = -(arrowHeight / 2) + (arrowHeight * Math.min(progress, 1) * 2)
    ctx.fillStyle = "#181818"
    ctx.beginPath()
    ctx.moveTo(0, arrowY)
    ctx.lineTo(width / 2, arrowY + arrowHeight / 2)
    ctx.lineTo(width, arrowY)
    ctx.lineTo(width, 0)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = "#808080"
    ctx.textAlign = "center"
    if (title) {
        ctx.font = "bold 50px monospace"
        ctx.fillText(title, width / 2, arrowY - arrowHeight - 30)
    }
    if (description) {
        ctx.font = "30px monospace"
        ctx.fillText(description, width / 2, arrowY - arrowHeight + 20)
    }
    if (progress >= 1) return true
}
function drawTransitionEnd(title, description, since) {
    const arrowHeight = height * 0.75
    const elapsed = lastTime - since
    const progress = elapsed / (transitionDuration / 2)
    const arrowY = (arrowHeight / 2) + (arrowHeight * progress * 2) - height / 2

    ctx.fillStyle = "#181818"
    ctx.beginPath()
    ctx.moveTo(0, arrowY - arrowHeight / 2)
    ctx.lineTo(width / 2, arrowY)
    ctx.lineTo(width, arrowY - arrowHeight / 2)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "#808080"
    ctx.textAlign = "center"
    if (title) {
        ctx.font = "bold 50px monospace"
        ctx.fillText(title, width / 2, arrowY + arrowHeight - 230)
    }
    if (description) {
        ctx.font = "30px monospace"
        ctx.fillText(description, width / 2, arrowY + arrowHeight - 180)
    }

    return progress >= 1
}

const initDelay = 1
const dbgForwardSeek = 0
let levelEndTimeout
let dbgShowHitboxes = false
function songUpdate(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time
    const framerateMultiplier = (60 / 1000) * deltaTime

    if (!startTime) {
        obstacleState = structuredClone(selectedLevel.stage)
        startTime = time
        dashCount += localStorage.getItem("dashCount") || 0

        stopSelectedAudio()
        const seek = dbgForwardSeek * (60 / selectedLevel.bpm)
        if (dbgForwardSeek) {
            playSelectedAudio(seek)
        } else {
            setTimeout(playSelectedAudio, initDelay * (selectedLevel.bpm / 60 * 1000))
        }

        levelEndTimeout = setTimeout(() => levelEnd = true, selectedLevel.length + 750)
    }

    const beat = ((time - startTime) / 1000) * (selectedLevel.bpm / 60) + (dbgForwardSeek || -initDelay)
    const easeDuration = 4
    if (beat <= easeDuration)
        selectedLevel.audio.gainNode.gain.value = Math.max(beat / easeDuration, 0)

    ctx.clearRect(0, 0, width, height)
    drawBackground(-20, bgScrollSpeed, deltaTime)

    let tutorialOpacity = Math.min(Math.max((startTime - time + 8000) / 1500, 0), 1)
    ctx.fillStyle = `rgba(64, 64, 64, ${tutorialOpacity})`
    ctx.font = "32px monospace"
    ctx.textAlign = "center"
    ctx.fillText("[LEFT CLICK] to MOVE", width / 2, height / 4)
    ctx.fillText("[RIGHT CLICK] to DASH", width / 2, height / 4 * 2)
    ctx.fillText("You can DASH through obstacles!", width / 2, height / 4 * 3)

    const color = "rgba(65, 105, 225"
    obstacleState.forEach(o => {
        const launchBeat = o[0]
        const obstacle = { ...defaultObstacle, ...o[1] }
        if (beat - launchBeat >= -obstacle.windup && beat - launchBeat <= obstacle.lifespan) {
            let canCollide = time >= player.invUntil
            if (beat - launchBeat < 0) {
                ctx.fillStyle = color + ", 0.4)"
                canCollide = false
            } else {
                let t = Math.min(1, (obstacle.lifespan / 4) / (Math.max(0, beat - launchBeat)))
                ctx.fillStyle = color + ", 1)"
                if (obstacle.moveSpeed && player.hp > 0) {
                    let ease = 1 - Math.pow(1 - t, 3)
                    const vx = Math.cos(obstacle.angle) * obstacle.moveSpeed * ease
                    const vy = Math.sin(obstacle.angle) * obstacle.moveSpeed * ease
                    if (obstacle.moveSideways) {
                        o[1].x += vy * framerateMultiplier
                        o[1].y += vx * framerateMultiplier
                    } else {
                        o[1].x += vx * framerateMultiplier
                        o[1].y += vy * framerateMultiplier
                    }
                }
            }

            for (let i = 0; i < obstacle.repeatCount; i++) {
                let obj = {
                    ...obstacle,
                    x: obstacle.x + (obstacle.repeatDirection === "x" ? i * obstacle.repeatDistance : 0),
                    y: obstacle.y + (obstacle.repeatDirection === "y" ? i * obstacle.repeatDistance : 0)
                }
                ctx.beginPath()
                if (dbgShowHitboxes) {
                    ctx.save()
                    ctx.fillStyle = "rgba(255,0,0,0.6)"
                    ctx.beginPath()
                    getRotatedCorners(obj.x, obj.y, obj.width, obj.height, obj.angle).forEach(p => {
                        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
                        ctx.stroke()
                    })
                    ctx.fill()
                    ctx.beginPath()
                    ctx.fillStyle = "rgba(0,255,0,0.6)"
                    fillAngledRect(obj.x, obj.y, obj.width, obj.height, 0, true)
                    fillAngledRect(obj.x, obj.y, obj.width, obj.height, obj.angle + Math.PI / 2, true)
                    ctx.fill()
                    ctx.restore()
                }
                let scaledObj = scaleRect(obj, beat - launchBeat > 0 ? Math.max(1.25 - (beat - launchBeat) / 2, 1) : 1)
                fillAngledRect(scaledObj.x, scaledObj.y, scaledObj.width, scaledObj.height, obj.angle, true)
                ctx.fill()

                if (canCollide && wouldCollide(scaleRect(player, 0.9), obj)) {
                    hit.load()
                    hit.play()
                    player.hp--
                    triggerScreenShake()
                    if (player.hp === 0) {
                        stopSelectedAudio()
                        explode.play()
                        bgScrollSpeed = 0
                        localStorage.setItem("dashCount", dashCount)
                        updateAchievements()
                        setTimeout(clearLevel, 1000)
                    }
                    player.invUntil = time + 1250
                }
            }
        }
    })

    if (player.hp != 0) {
        const dx = mouseX - (player.x + player.width / 2)
        const dy = mouseY - (player.y + player.height / 2)
        const distance = Math.hypot(dx, dy)

        if (mouse1click && distance > 20) {
            const angle = Math.atan2(dy, dx)
            player.vx = Math.cos(angle) * playerSpeed
            player.vy = Math.sin(angle) * playerSpeed
            if (Math.abs(angle - player.angle).toFixed(3) !== "3.141") player.angle = angle
        } else if (!player.isDashing) {
            player.vx *= Math.pow(0.75, framerateMultiplier)
            player.vy *= Math.pow(0.75, framerateMultiplier)
        }

        if (mouse2click) {
            if (time - lastDash > dashCooldown) {
                player.isDashing = true
                lastDash = time
                player.dashSpeed = 20
                bgScrollSpeed = 8
                player.invUntil = time + 450
                dash.load()
                // dash.playbackRate = 1 + (dashCount % 4) * 0.15
                dash.play()
                dashCount++
                if (dashCount < 100) {
                    currentAchievements[
                        currentAchievements.indexOf(currentAchievements.find(a => a.name === "Speedster"))
                    ].progress = dashCount
                }
                else if (dashCount === 100) {
                    claimAchievement("Speedster")
                    updateAchievements()
                }
            }
        }

        if (player.isDashing || player.dashSpeed > 4) {
            player.isDashing = false
            player.vx = Math.cos(player.angle) * player.dashSpeed
            player.vy = Math.sin(player.angle) * player.dashSpeed
            if (distance < 25) player.dashSpeed *= Math.pow(0.6, framerateMultiplier)
            else player.dashSpeed *= Math.pow(0.9, framerateMultiplier)
        }

        player.x += player.vx * framerateMultiplier
        player.y += player.vy * framerateMultiplier
        player.x = Math.max(0, Math.min(width - player.width, player.x))
        player.y = Math.max(0, Math.min(height - player.height, player.y))
        bgScrollSpeed = Math.max(bgScrollSpeed * Math.pow(0.935, framerateMultiplier),  0.5)
    }

    let playerColor = `hsl(${player.hp * 20}, 100%, ${Math.max(player.dashSpeed * 10, 50)}%)`
    ctx.fillStyle = playerColor
    ctx.beginPath()
    const t = Math.max(0, Math.min(1, (player.dashSpeed - 5) / (16 - 5)))
    const scaleX = 1 + 0.25 * t
    const scaleY = 1 - 0.25 * t
    const scaledPlayer = scaleRect(player, scaleX, scaleY)
    fillAngledRect(scaledPlayer.x, scaledPlayer.y, scaledPlayer.width, scaledPlayer.height, player.angle, true)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = "rgba(64, 64, 64, 0.4)"
    ctx.rect(30, 20, width - 60, 32)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = "#808080"
    ctx.rect(60, 20 + 16 - 1, width - 160, 2)
    ctx.fill()
    const progressIndicatorX = 60 + Math.min((time - startTime) / selectedLevel.length, 1) * (width - 160)
    ctx.beginPath()
    ctx.fillStyle = `hsl(${player.hp * 20}, 100%, 50%)`
    ctx.rect(progressIndicatorX, 32, 8, 8)
    ctx.fill()
    ctx.fillStyle = "#404040"
    if (player.hp === 1) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.005);
        ctx.fillStyle = lerpColor("#404040", "#808080", pulse);
    }
    ctx.font = "16px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${player.hp}/3`, width - 70, 36)

    if (levelEnd && !transitionFrom && !inTransitionEnd) {
        transitionFrom = time
        drawTransitionStart("LEVEL CLEAR", "Congratulations!", transitionFrom)

        claimAchievement("And So It Beings")
        if (player.hp === 3) claimAchievement("Not Even Close")
        updateAchievements()
        localStorage.setItem("dashCount", dashCount)
    } else if (transitionFrom && !inTransitionEnd) {
        const fade = Math.max((transitionFrom - time + 1500) / 1500, 0)
        selectedLevel.audio.gainNode.gain.value = Math.min(selectedLevel.audio.gainNode.gain.value, fade)
        if (drawTransitionStart("LEVEL CLEAR", "Congratulations!", transitionFrom)) {
            clearLevel()
            transitionEndStart = time
            inTransitionEnd = true
            return requestID = requestAnimationFrame(mainMenuUpdate)
        }
    }

    if (inTransitionEnd) {
        if (drawTransitionEnd(selectedLevel.name, selectedLevel.artist, transitionEndStart) || dbgForwardSeek) {
            inTransitionEnd = false
            transitionFrom = 0
        }
    }

    requestID = requestAnimationFrame(songUpdate)
}

const about = document.getElementById("info")
let aboutVisible = false
document.querySelector("#info .close").addEventListener("click", () => {
    about.style.display = "none"
    aboutVisible = false
})
document.addEventListener("keydown", e => {
    if (e.key == "Escape" && aboutVisible) {
        about.style.display = "none"
        aboutVisible = false
    }
})

const achievementsButtonX = width - 120, achievementsButtonY = height - 70, achievementsButtonSize = 60
const trophy = document.createElement("img")
trophy.src = "./assets/trophy.png"
const achievements = [{
    name: "And So It Beings",
    description: "Clear any level",
    obtained: false
}, {
    name: "Not Even A Scratch",
    description: "Clear a level without taking damage",
    obtained: false
}, {
    name: "Speedster",
    description: "Dash 100 times",
    obtained: false,
    progress: 0,
    goal: 100
}]
/** @type {typeof achievements} */
let currentAchievements, hasNewAchievements
try {
    currentAchievements = JSON.parse(localStorage.getItem("achievements"))
    if (!currentAchievements) throw "banana"
} catch {
    localStorage.setItem("achievements", JSON.stringify(achievements))
    currentAchievements = JSON.parse(localStorage.getItem("achievements"))
}
hasNewAchievements = JSON.parse(localStorage.getItem("hasNewAchievements")) || false

function claimAchievement(name) {
    const ach = currentAchievements.find(a => a.name === name)
    if (ach && !ach.obtained) {
        hasNewAchievements = true
        localStorage.setItem("hasNewAchievements", true)
        currentAchievements[currentAchievements.indexOf(ach)].obtained = true
    }
}
function updateAchievements() {
    localStorage.setItem("achievements", JSON.stringify(currentAchievements))
}

const logo = document.createElement("img")
logo.src = "./assets/logo.png"
const infoBtnX = width - 50, infoBtnY = height - 50, infoBtnSize = 30

let transitionFrom = 0
let transitionEndStart = 0
let inTransitionEnd = false
function mainMenuUpdate(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time

    ctx.clearRect(0, 0, width, height)
    drawBackground(-160, 0.5, deltaTime)

    fillAngledImage(logo, width / 2 - 150, 100, 300, 150, Math.sin(time / 1000 * 1.5) * 10, false)

    ctx.textAlign = "center"
    ctx.font = "40px monospace"
    ctx.fillStyle = "#404040"
    ctx.fillText("Press [LEFT CLICK] to launch!", width / 2, height - 150)

    ctx.beginPath()
    ctx.arc(infoBtnX, infoBtnY, infoBtnSize / 2, 0, Math.PI * 2)
    ctx.strokeStyle = "#404040"
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.closePath()
    ctx.font = "bold 16px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("i", infoBtnX, infoBtnY)

    if (hasNewAchievements) {
        ctx.fillStyle = "#181818"
        ctx.beginPath()
        ctx.moveTo(width, height / 3 + 100)
        ctx.lineTo(width / 2 + 200, height / 3 + 100)
        ctx.lineTo(width / 2 + 120, height / 3)
        ctx.lineTo(width, height / 3)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.textAlign = "left"
        ctx.font = "32px monospace"
        ctx.fillStyle = "#808080"
        ctx.fillText("You have new achievements", width / 2 + 180, height / 3 + 40)
        ctx.font = "20px monospace"
        ctx.fillStyle = "#404040"
        ctx.fillText("Check them out in the Trohpy Room below!", width / 2 + 200, height / 3 + 70)
        ctx.fill()
    }

    ctx.beginPath()
    ctx.arc(achievementsButtonX, achievementsButtonY, achievementsButtonSize / 2, 0, Math.PI * 2)
    ctx.strokeStyle = "#404040"
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.closePath()
    ctx.drawImage(trophy, achievementsButtonX - achievementsButtonSize / 4, achievementsButtonY - achievementsButtonSize / 4,
        achievementsButtonSize / 2, achievementsButtonSize / 2
    )

    if (mouse1click && clickedCircle(achievementsButtonX, achievementsButtonY, achievementsButtonSize / 2)) {
        click.play()
        return requestID = requestAnimationFrame(trophyHallUpdate)
    }

    if (inTransitionEnd) {
        if (drawTransitionEnd("LEVEL CLEAR", "Congratulations!", transitionEndStart)) {
            inTransitionEnd = false
            transitionFrom = 0
            mouse1click = false
        }
    }

    if (mouse1click && clickedCircle(infoBtnX, infoBtnY, infoBtnSize / 2)) {
        about.style.display = "block"
        aboutVisible = true
        mouse1click = false
        click.play()
    }
    if (mouse1click && !aboutVisible && !transitionFrom && !inTransitionEnd) {
        transitionFrom = time
        click.play()
    } else if (transitionFrom && !aboutVisible && !inTransitionEnd) {
        if (drawTransitionStart("LEVEL SELECT", null, transitionFrom)) {
            transitionEndStart = time
            inTransitionEnd = true
            playLoop()
            return requestID = requestAnimationFrame(levelSelectUpdate)
        }
    }
    requestID = requestAnimationFrame(mainMenuUpdate)
}

function levelSelectUpdate(time) {
    const deltaTime = time - lastTime
    lastTime = time

    ctx.clearRect(0, 0, width, height)
    drawBackground(160, 0.75, deltaTime)

    ctx.fillStyle = "#181818"
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(width, 0)
    ctx.lineTo(width - 60, 100)
    ctx.lineTo(0, 100)
    ctx.closePath()
    ctx.fill()
    ctx.drawImage(logo, 20, 20, 150, 75)
    ctx.textAlign = "center"
    ctx.font = "40px monospace"
    ctx.fillStyle = "#808080"
    ctx.fillText("CHOOSE YOUR CHALLENGE", width / 2, 55)

    let levelBoxes = []
    levels.forEach((l, i) => {
        ctx.fillStyle = "#181818"
        ctx.beginPath()
        ctx.moveTo(width, height / 3 + i * 120)
        ctx.lineTo(width / 2, height / 3 + i * 120)
        ctx.lineTo(width / 2 - 80, height / 3 + i * 120 - 100)
        ctx.lineTo(width, height / 3 + i * 120 - 100)
        ctx.closePath()
        ctx.fill()
        levelBoxes.push({ ...l, x: width / 2 - 80, y: height / 3 + i * 120 - 100, width: width / 2 + 80, height: 100 })
        ctx.beginPath()
        ctx.textAlign = "left"
        ctx.font = "32px monospace"
        ctx.fillStyle = "#808080"
        ctx.fillText(l.name, width / 2 - 20, height / 3 + i * 120 - 60)
        ctx.font = "20px monospace"
        ctx.fillStyle = "#404040"
        ctx.fillText(l.artist, width / 2, height / 3 + i * 120 - 30)
        ctx.fill()
    })

    if (levels.length === 1) {
        ctx.fillText("(don't run the HTML file directly to load levels properly)", width / 2, height / 2)
    }

    if (inTransitionEnd) {
        if (drawTransitionEnd("LEVEL SELECT", null, transitionEndStart)) {
            inTransitionEnd = false
            transitionFrom = 0
            mouse1click = false
        }
    }

    if (mouse1click && !transitionFrom && !inTransitionEnd) {
        const rect = canvas.getBoundingClientRect()
        const clickX = mouseX - rect.left
        const clickY = mouseY - rect.top
        levelBoxes.forEach(b => {
            if (
                clickX >= b.x && clickX <= b.x + b.width
                && clickY >= b.y && clickY <= b.y + b.height
            ) {
                if (!b.stage) {
                    no.play()
                } else {
                    selectedLevel = b
                    transitionFrom = time
                    click.play()
                    drawTransitionStart(b.name, b.artist, transitionFrom)
                }
            }
        })
    } else if (transitionFrom && !inTransitionEnd) {
        if (drawTransitionStart(selectedLevel.name, selectedLevel.artist, transitionFrom)) {
            transitionEndStart = time
            inTransitionEnd = true
            node.stop()
            return requestID = requestAnimationFrame(songUpdate)
        }
    }

    requestID = requestAnimationFrame(levelSelectUpdate)
}

function trophyHallUpdate(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time

    ctx.clearRect(0, 0, width, height)
    drawBackground(-160, 0.5, deltaTime)

    ctx.fillStyle = "#181818"
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(width, 0)
    ctx.lineTo(width - 60, 100)
    ctx.lineTo(0, 100)
    ctx.closePath()
    ctx.fill()
    ctx.drawImage(logo, 20, 20, 150, 75)
    ctx.textAlign = "center"
    ctx.font = "40px monospace"
    ctx.fillStyle = "#808080"
    ctx.fillText("TROPHY ROOM", width / 2, 55)
    ctx.textAlign = "left"
    for (let i = 0; i < currentAchievements.length; i++) {
        const ach = currentAchievements[i]
        const y = height / 3 + i * 120
        ctx.fillStyle = "#181818"
        ctx.globalAlpha = ach.obtained ? 1 : 0.6
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width / 2, y)
        ctx.lineTo(width / 2 + 80, y - 100)
        ctx.lineTo(0, y - 100)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.drawImage(trophy, 40, y - 70, 40, 40)
        ctx.font = "24px monospace"
        ctx.fillStyle = "#808080"
        ctx.textAlign = "left"
        const titleX = 100
        const titleY = y - 60
        ctx.fillText(ach.name, titleX, titleY)
        const textWidth = ctx.measureText(ach.name).width
        if (!ach.obtained) {
            ctx.strokeStyle = "#808080"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(titleX, titleY)
            ctx.lineTo(titleX + textWidth, titleY)
            ctx.stroke()
        }
        ctx.font = "18px monospace"
        ctx.fillStyle = "#404040"
        ctx.fillText(ach.description, titleX, titleY + 25)
        if (ach.goal && !ach.obtained) {
            const barX = titleX + textWidth + 50
            const barY = titleY + 12
            const barWidth = 300
            const barHeight = 10
            const progress = Math.min(ach.progress || 0, ach.goal)
            ctx.fillStyle = "#404040"
            ctx.fillRect(barX, barY, barWidth, barHeight)
            ctx.fillStyle = "#808080"
            ctx.fillRect(barX, barY, barWidth * (progress / ach.goal), barHeight)
            ctx.font = "14px monospace"
            ctx.fillStyle = "#404040"
            ctx.fillText(`${progress} / ${ach.goal}`, barX + barWidth + 10, barY + barHeight / 2)
        }
    }
    ctx.font = "20px monospace"
    ctx.fillStyle = "#404040"
    ctx.textAlign = "center"
    ctx.fillText("Press [ESC] to return", width / 2, height - 40)

    if (hasNewAchievements) {
        hasNewAchievements = false
        localStorage.setItem("hasNewAchievements", false)
    }

    function exit(e) {
        document.removeEventListener("keydown", exit)
        if (e.key === "Escape") {
            cancelAnimationFrame(requestID)
            requestID = requestAnimationFrame(mainMenuUpdate)
        }
    }
    document.addEventListener("keydown", exit)

    requestID = requestAnimationFrame(trophyHallUpdate)
}

requestID = mainMenuUpdate()

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect()
    mouseX = ((e.clientX - rect.left) / rect.width) * width
    mouseY = ((e.clientY - rect.top) / rect.height) * height
})
canvas.addEventListener("mousedown", e => {
    e.preventDefault()
    if (e.button === 0) mouse1click = true
    else if (e.button === 2) mouse2click = true
})
canvas.addEventListener("mouseup", e => {
    if (e.button === 0) mouse1click = false
    else if (e.button === 2) mouse2click = false
})
canvas.addEventListener('contextmenu', e => e.preventDefault())
document.addEventListener("mouseleave", () => {
    mouse1click = false
    mouse2click = false
})
document.addEventListener("focusout", () => {
    mouse1click = false
    mouse2click = false
})
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === "k" && e.shiftKey) {
        click.play()
        dbgShowHitboxes = !dbgShowHitboxes
    } else if (e.key.toLowerCase() === ")" && e.shiftKey) {
        localStorage.removeItem("achievements");
        localStorage.setItem("dashCount", 0);
        localStorage.removeItem("hasNewAchievements")
        location.reload()
    }
})    
