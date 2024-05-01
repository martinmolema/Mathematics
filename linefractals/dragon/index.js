"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let elThePath;
let elSliderAngle;
let elAngleValue;

let nrOfIterationsRequested;
let angleValue;

let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;

let refInterval = undefined;

class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    x1;
    y1;
    x2;
    y2;
    iterationSetNr;

    constructor(x1, y1, x2, y2, iterationSetNr) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.iterationSetNr = iterationSetNr;
    }
}

window.onload = () => {
    setup();
    draw(nrOfIterationsRequested);
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = svgWidth / 2;
    ORIGIN_Y = svgHeight / 2;

    elLines = document.getElementById("lines");
    elThePath = document.getElementById("thePath");
    elAngleValue = document.getElementById("elAngleValue");

    elInputIterationNr = document.querySelector("input[name='iteration']");
    elSliderAngle = document.querySelector("input[name='angle']");

    document.getElementById("inputs").addEventListener("input", handleInputChanges);

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}

function draw(nrOfIterationsToDraw) {
    let x1 = ORIGIN_X - 275;
    let x2 = ORIGIN_X + 300;
    let y1 = ORIGIN_Y - 50;
    let y2 = y1;

    if (refInterval !== undefined) {
        return;
    }

    /**
     *
     * @type {Line[]}
     */
    let listOfLines = [new Line(x1, y1, x2, y2, 0)];
    drawLines(listOfLines);
    if (nrOfIterationsToDraw === 0) { return }

    for (let currentIteration=0; currentIteration<nrOfIterationsToDraw; currentIteration++) {
        const newListOfItems =  [];
        listOfLines.forEach(oneLine => {
            newListOfItems.push(...splitLine(oneLine, currentIteration));
        });
        listOfLines = newListOfItems;
    }
    drawLines(listOfLines);
}

function splitLine(line, iteration) {
    const diffX = line.x2 - line.x1;
    const diffY = line.y1 - line.y2;

    const lineLength = Math.sqrt(diffX * diffX + diffY * diffY);
    const angle90deg = (90 / 360) * (Math.PI * 2);

    // fixed angle to create the triangle
    const angleRequested = (angleValue / 360) * (Math.PI * 2);

    // calculate the angle of the given line.
    const currentAngle = Math.atan2(diffY, diffX);

    const halfLineLength = lineLength / 2;

    const peekAngle = currentAngle - angleRequested;

    const otherPeekAngle = Math.PI - angle90deg - angleRequested; // Right scalene triangle, angle B = 90 deg.
    let radius;

    if (Math.sin(otherPeekAngle) === 0) {
        radius = Math.abs(halfLineLength);
    } else {
        radius = Math.abs(Math.sin(angle90deg) / Math.sin(otherPeekAngle) * Math.abs(halfLineLength ));
    }
    const peekX = line.x1 + Math.cos(peekAngle) * radius;
    const peekY = line.y1 - Math.sin(peekAngle) * radius;

    const line2 = new Line(line.x2, line.y2, peekX, peekY);
    const line1 = new Line(line.x1, line.y1, peekX, peekY);

    return [line1,line2];
}

function updateParameterInfoOnScreen() {
    elAngleValue.textContent = angleValue.toLocaleString();
}

function getParameterValueFromInputs() {

    if (elInputIterationNr.value === "") {
        nrOfIterationsRequested = 1;
        return;
    }
    nrOfIterationsRequested = parseInt(elInputIterationNr.value);

    if (isNaN(nrOfIterationsRequested)) {
        nrOfIterationsRequested = 0;
    }
    if (nrOfIterationsRequested < 0) {
        nrOfIterationsRequested = 0;
    }
    if (nrOfIterationsRequested > 30) {
        nrOfIterationsRequested = 30;
    }

    angleValue = parseInt(elSliderAngle.value);
}

function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
}

function drawLines(listOfLines, previousPath) {
    elLines.innerHTML = '';
/*
        listOfLines.forEach(line => {
            const svgLine = document.createElementNS(SVG_NS, 'line');

            svgLine.setAttribute('x1', line.x1);
            svgLine.setAttribute('y1', line.y1);
            svgLine.setAttribute('x2', line.x2);
            svgLine.setAttribute('y2', line.y2);
            svgLine.classList.add("segment");
            svgLine.classList.add(`iteration${line.iterationSetNr}`);
            elLines.appendChild(svgLine);
        });
*/


    const path = listOfLines.map(p => `M ${p.x1},${p.y1} L ${p.x2},${p.y2}`).join(' ');
    const svgPolyline = document.createElementNS(SVG_NS, 'path');
    svgPolyline.setAttribute('d', path);
    elLines.appendChild(svgPolyline);
    return path;

}
