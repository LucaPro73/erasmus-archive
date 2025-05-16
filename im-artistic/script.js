const canvas = document.getElementById("canvas")
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d")
const size = document.getElementById("size")
const colors = document.querySelectorAll(".color")

let isDrawing = false
let isErasing = false
let color = "black"

canvas.addEventListener("mousedown", e => {
    isDrawing = true
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
})

canvas.addEventListener("mousemove", e => {
    if (isDrawing) {
        const brushSize = size.value
        ctx.strokeStyle = isErasing ? "#c0c0c0" : color
        ctx.lineWidth = brushSize
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
    }
})

canvas.addEventListener("mouseup", e => {
    isDrawing = false
})

document.getElementById("brush").addEventListener("click", () => isErasing = false)
document.getElementById("eraser").addEventListener("click", () => isErasing = true)
document.getElementById("clear").addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height))

colors.forEach(btn => btn.addEventListener("click", e => color = btn.id))