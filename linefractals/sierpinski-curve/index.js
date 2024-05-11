"use strict";

import {Point} from "./point.js"

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let lastPosition;
let points = [];

const MIN_NR_OF_ITERATIONS = 2;
const MAX_NR_OF_ITERATIONS = 10;
let nrOfIterationsRequested = MIN_NR_OF_ITERATIONS;
const rotationAngle = 45;
const startLengthF = 300;
const startLengthG = 500;


let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;


window.onload = () => {
    setup();
    draw(MIN_NR_OF_ITERATIONS);
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = 10;
    ORIGIN_Y = 10;

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
    lastPosition = new Point(ORIGIN_X,ORIGIN_Y + 50);
    points = [];
    points.push(lastPosition);
    angle = rotationAngle;
    const divider = Math.pow(nrOfIterations, 2.5);
    axiom(nrOfIterations, startLengthF / divider, startLengthG / divider);
    plot();
}

function plot(){
    clearCanvas();
    const polyline = document.createElementNS(SVG_NS,"polyline");
    const pointsAsString = points.map(p => `${p.x},${p.y}`).join(' ');
    polyline.setAttribute("points", pointsAsString);
    polyline.classList.add('shape');
    elLines.appendChild(polyline);
}

/**
 *     Alphabet: F, G, X
 *     Constants: F, G, +, −
 *     Axiom: F−−XF−−F−−XF
 *     Production rules:
 *         X → XF+G+XF−−F−−XF+G+X
 *             XF+F+XF--F--XF+F+X
 *     Angle: 45
 * @param iterationNr
 * @param lengthF
 * @param lengthG
 */
function axiom(iterationNr, lengthF, lengthG) {
    const formula = "F--XF--F--XF";
    executeFormula(formula, iterationNr, lengthF, lengthG);
}

/**
 *     Alphabet: F, G, X
 *     Constants: F, G, +, −
 *     Axiom: F−−XF−−F−−XF
 *     Production rules:
 *         X → XF+G+XF−−F−−XF+G+X
 *             XF+F+XF--F--XF+F+X
 *     Angle: 45
 * @param iterationNr
 * @param lengthF
 * @param lengthG
 */
function curveX(iterationNr, lengthF, lengthG) {
    if (iterationNr === 0) {
        return;
    }
    const formula = "XF+G+XF--F--XF+G+X";
    //const formula = "XF+F+XF--F--XF+F+X";
    executeFormula(formula, iterationNr, lengthF, lengthG);
}

/**
 *
 * @param iterationNr {number}
 * @param length {number}
 */
function lineF(iterationNr, length) {
    drawLineWithAngle(angle, length, "F", iterationNr);
}

/**
 *
 * @param iterationNr {number}
 * @param length {number}
 */
function lineG(iterationNr, length) {
    drawLineWithAngle(angle, length, "G", iterationNr);
}


/**
 *
 * @param formula {string}
 * @param iterationNr {number}
 * @param lengthF {number}
 * @param lengthG {number}
 */
function executeFormula(formula, iterationNr, lengthF, lengthG) {
    for (let i = 0; i < formula.length; i++) {
        const letter = formula.substring(i, i + 1);
        switch (letter) {
            case "X":
                curveX(iterationNr - 1, lengthF , lengthG );
                break;
            case "F":
                lineF(iterationNr, lengthF );
                break;
            case "G":
                lineG(iterationNr, lengthG);
                break;
            case "+":
                turn(rotationAngle);
                break;
            case "-":
                turn(-rotationAngle);
                break;
            default:
                console.error(`Letter '${letter}' not found in formula`);
        }
    }
}

function turn(rotation) {
    angle = angle + rotation;
}

// TO-DO: only create a new point so the line can be drawn using a <polyline>
function drawLineWithAngle(angle, length, letter, iterationNr) {
    const newx = lastPosition.x + Math.cos((angle / 180) * Math.PI) * length;
    const newy = lastPosition.y - Math.sin((angle / 180) * Math.PI) * length;

    points.push(new Point(newx,newy));

    lastPosition.x = newx;
    lastPosition.y = newy;
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

/*    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', 10);
    circle.setAttribute('fill', 'red');

    elLines.appendChild(circle);*/
}
