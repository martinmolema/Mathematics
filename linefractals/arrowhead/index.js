"use strict";

import {Point} from "./point.js"

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let lastPosition;

const MIN_NR_OF_ITERATIONS = 1;
const MAX_NR_OF_ITERATIONS = 10;
let nrOfIterationsRequested = MIN_NR_OF_ITERATIONS;
const angle60Deg = 60;


let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;


window.onload = () => {
    setup();
    draw(1);

}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = -svgWidth / 2;
    ORIGIN_Y = -svgWidth / 2 + 10;

    elLines = document.getElementById("lines");

    elInputIterationNr = document.querySelector("input[name='iteration']");
    elInputIterationNr.max = MAX_NR_OF_ITERATIONS.toString();
    elInputIterationNr.min = MIN_NR_OF_ITERATIONS.toString();
    elInputIterationNr.value = MIN_NR_OF_ITERATIONS;

    elInputIterationNr.addEventListener("input", handleInputChanges);

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();

}


let angle = 0;

/**
 *
 * @param nrOfIterations {number}
 */
function draw(nrOfIterations) {
    clearCanvas();
    const isOdd = (nrOfIterations % 2 === 1);
    const isEven = (nrOfIterations % 2 === 0);
    const linelen = svgWidth ;
    const startAngle = isOdd ? angle60Deg : 0;

    lastPosition = new Point(ORIGIN_X, ORIGIN_Y);

    if (isOdd) {
        angle = angle60Deg;
        curveA(nrOfIterations, linelen);
    } else {
        angle = 0;
        curveA(nrOfIterations, linelen);
    }
}

function curveA(iterationNr, length, letter) {
    if (iterationNr === 0) {
        drawLineWithAngle(angle, length, "A");
    } else {
        const originalAngle = angle;
        curveB(iterationNr - 1, length / 2, angle);
        turn(-angle60Deg);
        curveA(iterationNr - 1, length / 2, angle);
        turn(-angle60Deg);
        curveB(iterationNr - 1, length / 2, angle);
    }
}


function curveB(iterationNr, length, letter) {
    if (iterationNr === 0) {
        drawLineWithAngle(angle, length, "B");
    } else {
        const originalAngle = angle;
        curveA(iterationNr - 1, length / 2, angle);
        turn(angle60Deg);
        curveB(iterationNr - 1, length / 2, angle);
        turn(angle60Deg);
        curveA(iterationNr - 1, length / 2, angle);
    }
}

function turn(rotation) {
    angle = angle + rotation;
}

function drawLineWithAngle(angle, length, letter) {
    const newx = lastPosition.x + Math.cos((angle / 180) * Math.PI) * length;
    const newy = lastPosition.y + Math.sin((angle / 180) * Math.PI) * length;
    const line = createLine(lastPosition.x, lastPosition.y, newx, newy);
    line.classList.add(`letter-${letter}`);
    elLines.appendChild(line);

    lastPosition.x = newx;
    lastPosition.y = newy;
}


function createLine(x1, y1, x2, y2, className = "shape") {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.classList.add(className);
    return line;
}


function updateParameterInfoOnScreen() {
}


function getParameterValueFromInputs() {

    if (elInputIterationNr.value === "") {
        nrOfIterationsRequested = MIN_NR_OF_ITERATIONS;
        return;
    }
    nrOfIterationsRequested = parseInt(elInputIterationNr.value);

    if (isNaN(nrOfIterationsRequested)) {
        nrOfIterationsRequested = MIN_NR_OF_ITERATIONS;
    }
    if (nrOfIterationsRequested < MIN_NR_OF_ITERATIONS) {
        nrOfIterationsRequested = MIN_NR_OF_ITERATIONS;
    }
    if (nrOfIterationsRequested > MAX_NR_OF_ITERATIONS) {
        nrOfIterationsRequested = MAX_NR_OF_ITERATIONS;
    }

}

function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
}

function clearCanvas() {
    elLines.innerHTML = '';
    /** code to check the (0,0) = Origin of the SVG coordianates **/

/*
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', 10);
    circle.setAttribute('fill', 'red');

    elLines.appendChild(circle);
*/
}
