/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("whackCanvas")
const ctx = canvas.getContext("2d")
const scoreDisplay = document.getElementById("score")
const hiscoreDisplay = document.getElementById("hiscore")
const hit = new Audio("./assets/vine-boom.mp3")
const miss = new Audio("./assets/downer_noise.mp3")

let score = 0
let boxX, boxY
const boxSize = 50
let hiscore = window.localStorage.getItem("hiscore") || "0"
let clicked = false

function drawBox() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    boxX = Math.floor(Math.random() * (canvas.width - boxSize))
    boxY = Math.floor(Math.random() * (canvas.height - boxSize))

    ctx.fillStyle = "#" + Math.floor(Math.random() * 0xffffff).toString(16)
    ctx.fillRect(boxX, boxY, boxSize, boxSize)
}

canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    if (
        clickX >= boxX && clickX <= boxX + boxSize
        && clickY >= boxY && clickY <= boxY + boxSize
    ) {
        score++
        scoreDisplay.textContent = score
        if (score > parseInt(hiscore)) {
            hiscore = score.toString()
            hiscoreDisplay.textContent = score
            window.localStorage.setItem("hiscore", hiscore)
        }
        clicked = true
        hit.load()
        hit.play()
    } else {
        score = 0
        scoreDisplay.textContent = score
        miss.load()
        miss.play()
    }
    drawBox()
});

(async () => {
    while (1) {
        await new Promise(r => setTimeout(() => {
            if (!clicked) {
                drawBox()
                score = 0
                scoreDisplay.textContent = score
            }
            clicked = false
            r()
        }, Math.max(2500 - score * 20, 750)))
    }
})()

hiscoreDisplay.textContent = hiscore
drawBox()
