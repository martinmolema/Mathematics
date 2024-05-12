"use strict";

import {Point} from "./point.js"

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let lastPosition;
let stack = [];

const MIN_NR_OF_ITERATIONS = 1;
const MAX_NR_OF_ITERATIONS = 10;
let nrOfIterationsRequested = MIN_NR_OF_ITERATIONS;
const rotationAngle = 22.5;
const startLength = 40;
const startAngle = 90;
const lengthDivider = 0.6;
let word = '';

let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;

class StackItem {
    angle;
    position;

    /**
     *
     * @param angle {number} in degrees
     * @param position {Point}
     */
    constructor(angle, position) {
        this.angle = angle;
        this.position = new Point(position.x, position.y);
    }
}


window.onload = () => {
    setup();
    draw(MIN_NR_OF_ITERATIONS);
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = 0;
    ORIGIN_Y = 0;

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
    word = '';
    lastPosition = new Point(ORIGIN_X,ORIGIN_Y);
    stack = [];
    angle = startAngle;
    axiom(nrOfIterations, startLength);
    console.log(nrOfIterations, word);
}

/**
 * @param iterationNr
 */
function axiom(iterationNr, length) {
    executeFormula("F", iterationNr, length);
}

/**
 *
 * @param iteration {number}
 * @param length {number}
 */
function curveF(iteration, length){

    if (iteration <= 0 ) {
        return ;
    }
    executeFormula("FF+[+F-F-F]-[-F+F+F]", iteration, length);
}

/**
 *
 * @param formula {string}
 * @param iterationNr {number}
 * @param length
 */
function executeFormula(formula, iterationNr, length) {
    for (let i = 0; i < formula.length; i++) {
        const letter = formula.substring(i, i + 1);
        word += letter;
        switch (letter) {
            case "F":
                drawLineWithAngle(angle, length, "F", iterationNr);
                curveF(iterationNr - 1, length / 2)
                break;
            case "[":
                stack.push(new StackItem(angle, lastPosition))
                break;
            case "]":
                const item = stack.pop();
                lastPosition.x = item.position.x;
                lastPosition.y = item.position.y;
                angle = item.angle;
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

function drawLineWithAngle(angle, length, letter, iterationNr) {
    const newx = lastPosition.x + Math.cos((angle / 180) * Math.PI) * length;
    const newy = lastPosition.y + Math.sin((angle / 180) * Math.PI) * length;

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", lastPosition.x);
    line.setAttribute("y1", lastPosition.y);
    line.setAttribute("x2", newx);
    line.setAttribute("y2", newy);
    line.setAttribute("stroke-opacity", (iterationNr / nrOfIterationsRequested).toString());

    line.classList.add("shape");
    line.classList.add(`letter-${letter}`);
    line.classList.add(`iteration-${iterationNr}`);

    elLines.appendChild(line);

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
/*

    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', 10);
    circle.setAttribute('fill', 'red');

    elLines.appendChild(circle);
*/

}
