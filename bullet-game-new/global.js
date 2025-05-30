/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
/** @type {HTMLCanvasElement} */
let bgCanvas = document.getElementById("bgCanvas")
let bgCtx = bgCanvas.getContext("2d")
let width = 1600, height = 800

function degToRad(deg) {
    return deg * Math.PI / 180
}

const context = new AudioContext()