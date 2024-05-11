"use strict";

import {Point} from "./point.js"

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let elCbxUseColoring;
let elCbxUseAnimatedPath;

let useAnimatedPath = false;
let useColoring = false;

let lastPosition;
let points = [];


const MIN_NR_OF_ITERATIONS = 1;
const MAX_NR_OF_ITERATIONS = 10;
let nrOfIterationsRequested = MIN_NR_OF_ITERATIONS;
const rotationAngle = 120;
let startLength = 0;
let totalLength = 0;

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

    elCbxUseAnimatedPath = document.getElementById('cbxUseAnimatedPath');
    elCbxUseColoring = document.getElementById('cbxUseColoring');

    elCbxUseAnimatedPath.addEventListener("input", handleInputChanges);
    elInputIterationNr.addEventListener("input", handleInputChanges);
    elCbxUseColoring.addEventListener("input", handleInputChanges);

    elCbxUseColoring.checked = useColoring;

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();

}


let angle = 0;

/**
 *
 * @param nrOfIterations {number}
 */
function draw(nrOfIterations) {
    lastPosition = new Point(ORIGIN_X, ORIGIN_Y);
    points = [];
    points.push(lastPosition);
    angle = 0;
    totalLength = 0;
    startLength = svgWidth * 2 - 20;
    axiom(nrOfIterations, startLength);
    plot();
}

function plot() {
    clearCanvas();

    if (useAnimatedPath) {
        const polyline = document.createElementNS(SVG_NS, "polyline");
        const pointsAsString = points.map(p => `${p.x},${p.y}`).join(' ');
        polyline.setAttribute("points", pointsAsString);
        polyline.classList.add('shape');

        if (useAnimatedPath) {
            polyline.classList.add('animated');
            polyline.setAttribute('stroke-dasharray', totalLength.toString());
            polyline.setAttribute('stroke-dashoffset', totalLength.toString());
        }
        elLines.appendChild(polyline);
    } else {
        let prevPoint = undefined;
        points.forEach(p => {
            if (prevPoint) {
                const line = createLine(prevPoint.x, prevPoint.y, p.x, p.y, "shape");
                if (useColoring) {
                    line.classList.add(`iteration-${nrOfIterationsRequested - p.iterationNr}`);
                }
                elLines.appendChild(line);
            }
            prevPoint = p;
        });
    }
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


/**
 * @param iterationNr {number}
 * @param length {number}
 */
function axiom(iterationNr, length) {
    const formula = "F-G-G";
    executeFormula(formula, iterationNr, length);
}

/**
 * @param iterationNr
 * @param length
 */
function curveF(iterationNr, length) {
    if (iterationNr === 0) {
        lineF(iterationNr, length);
        return;
    }
    const formula = "F-G+F+G-F";
    executeFormula(formula, iterationNr, length);
}

/**
 * @param iterationNr
 * @param length
 */
function curveG(iterationNr, length) {
    lineG(iterationNr, length)
    lineG(iterationNr, length)
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
 * @param length {number}
 */
function executeFormula(formula, iterationNr, length) {
    for (let i = 0; i < formula.length; i++) {
        const letter = formula.substring(i, i + 1);
        switch (letter) {
            case "F":
                curveF(iterationNr - 1, length / 2);
                break;
            case "G":
                lineG(iterationNr, length / 2);
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
    const newy = lastPosition.y - Math.sin((angle / 180) * Math.PI) * length;

    points.push(new Point(newx, newy, iterationNr));

    const diffX = lastPosition.x - newx;
    const diffY = lastPosition.y - newy;

    totalLength += Math.sqrt(diffX * diffX + diffY * diffY);

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
    useAnimatedPath = elCbxUseAnimatedPath.checked;
    useColoring = elCbxUseColoring.checked;

    elCbxUseColoring.disabled = useAnimatedPath;
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
