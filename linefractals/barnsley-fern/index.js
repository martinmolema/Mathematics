"use strict";

/**
 * HTMLCanvasElement
 */
let elCanvas;
let elInputIterationNr;


/**
 * CanvasRenderingContext2D
 */
let canvas2dContext;
let nrOfIterations = 300000;

window.onload = function () {
    setup();
    draw();
}

function setup() {
    elInputIterationNr = document.querySelector("input[name='iterations']");

    elCanvas = document.getElementById("canvas");
    canvas2dContext = canvas.getContext("2d");

    document.getElementById("inputs").addEventListener("input", handleInputChanges);
}

/**
 *
 */
function handleInputChanges() {
    nrOfIterations = elInputIterationNr.value;
    draw();
}

/**
 *
 */
function draw() {
    canvas2dContext.resetTransform();
    canvas2dContext.clearRect(0, 0, elCanvas.width, elCanvas.height);

    canvas2dContext.translate(elCanvas.width / 2, elCanvas.height);
    canvas2dContext.scale(1, -1);

    let x = 0;
    let y = 0;
    let t = 0
    let xn = 0;
    let yn = 0;
    for (let it = 0; it < nrOfIterations; it++) {
        const rnd = getRandom();
        if (rnd < 1) {
            xn = 0;
            yn = 0.16 * y;
        } else if (rnd < 86) {
            xn = 0.85 * x + 0.04 * y;
            yn = -0.04 * x + 0.85 * y + 1.6;
        } else if (rnd < 93) {
            xn = 0.2 * x - 0.26 * y;
            yn = 0.23 * x + 0.22 * y + 1.6
        } else {
            xn = -0.15 * x + 0.28 * y;
            yn = 0.26 * x + 0.24 * y + 0.44;
        }
        drawPixel(xn, yn)
        x = xn;
        y = yn;
    }
}

/**
 *
 * @returns {number}
 */
function getRandom() {
    return (Math.random() * 100);
}

/**
 *
 * @param x {number}
 * @param y {number}
 */
function drawPixel(x, y) {
    canvas2dContext.fillStyle = "green";
    canvas2dContext.fillRect(x * 75, y * 75, 1, 1);
}