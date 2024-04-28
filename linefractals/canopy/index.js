"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elSliderAngle;
let elLines;
let elThePath;
let elAngleInDegrees;
let elSliderLineLengthDivider;
let elSliderRandomness;
let elUseColoring;
let elFadeColors;

let elLineLengthValue;
let elRandomnessValue;

let nrOfIterationsRequested;
let angleRequested;
let lengthDividerRequested = 30;
let randomnessRange = 0;
let useColoring = true;
let fadeColors = true;

let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;

let refInterval = undefined;

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
    draw(1);
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = svgWidth / 2;
    ORIGIN_Y = svgHeight;

    elLines = document.getElementById("lines");
    elThePath = document.getElementById("thePath");
    elAngleInDegrees = document.getElementById("angleInDegrees");
    elLineLengthValue = document.getElementById("lineLengthValue");
    elRandomnessValue = document.getElementById("randomnessValue");

    elInputIterationNr = document.querySelector("input[name='iteration']");
    elSliderAngle = document.querySelector("input[name='iterationAngle']");
    elSliderLineLengthDivider = document.querySelector("input[name='lineLength']");
    elSliderRandomness = document.querySelector("input[name='randomness']");
    elUseColoring = document.querySelector("input[name='useColoring']");
    elFadeColors = document.querySelector("input[name='fadeColors']");

    document.getElementById("inputs").addEventListener("input", handleInputChanges);

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}

function draw(nrOfIterationsToDraw) {
    let x1 = ORIGIN_X;
    let x2 = x1;
    let y1 = ORIGIN_Y;
    let y2 = y1 - 250;

    if (refInterval !== undefined) {
        return;
    }

    /**
     *
     * @type {Line[]}
     */
    let listOfLines = [new Line(x1, y1, x2, y2, 0)];
    let lastCreatedItems = [...listOfLines];

    for (let i = 0; i < nrOfIterationsToDraw; i++) {
        // create an empty list to keep track of newly created items; it is not allowed to add to an array in the for-each
        const newlyCreatedItems = [];

        // loop through the list of the last iteration and create new lines
        lastCreatedItems.forEach(oneLine => {
            newlyCreatedItems.push(...createNewLines(oneLine, i));
        });

        // add the newly created items to the total list of items
        listOfLines.push(...newlyCreatedItems);

        // set the list for next iteration
        lastCreatedItems = newlyCreatedItems;
    }
    drawLines(listOfLines);
}
function getRandomNumber() {
    return (-randomnessRange / 2) + Math.floor(Math.random() * randomnessRange);
}

function createNewLines(line, iterationNr) {
    const diffX = line.x2 - line.x1;
    const diffY = line.y2 - line.y1;
    const lineLength = Math.sqrt(diffX * diffX + diffY * diffY);
    const lineSegmentLength = lineLength *  (1/lengthDividerRequested);

    const randomDevation1 = getRandomNumber();
    const newAngle1 = angleRequested - randomDevation1 / 2;
    const randomDevation2 = getRandomNumber();
    const newAngle2 = angleRequested - randomDevation2 / 2;

    const angle1 = (newAngle1 / 360) * (Math.PI * 2);
    const angle2 = (newAngle2 / 360) * (Math.PI * 2);

    const currentAngle = -Math.atan2(diffY, diffX);

    const angleLine1 = currentAngle + angle1;
    const angleLine2 = currentAngle - angle2;

    const line1 = new Line(line.x2, line.y2, line.x2 + Math.cos(angleLine1) * lineSegmentLength, line.y2 - Math.sin(angleLine1) * lineSegmentLength, iterationNr);
    const line2 = new Line(line.x2, line.y2, line.x2 + Math.cos(angleLine2) * lineSegmentLength, line.y2 - Math.sin(angleLine2) * lineSegmentLength, iterationNr);

    // return both the given line and the newly created lines
    return [line1, line2];
}

function updateParameterInfoOnScreen() {
    elAngleInDegrees.textContent = angleRequested.toString();
    elLineLengthValue.textContent = lengthDividerRequested.toString();
    elRandomnessValue.textContent = randomnessRange.toString();
}

function getParameterValueFromInputs() {

    if (elInputIterationNr.value === "") {
        nrOfIterationsRequested = 1;
        return;
    }
    nrOfIterationsRequested = parseInt(elInputIterationNr.value);

    if (isNaN(nrOfIterationsRequested)) {
        nrOfIterationsRequested = 1;
    }
    if (nrOfIterationsRequested < 1) {
        nrOfIterationsRequested = 1;
    }
    if (nrOfIterationsRequested > 30) {
        nrOfIterationsRequested = 30;
    }
    angleRequested = elSliderAngle.value;
    lengthDividerRequested = elSliderLineLengthDivider.value;
    randomnessRange = elSliderRandomness.value;
    useColoring = elUseColoring.checked;
    fadeColors = elFadeColors.checked;
}

function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
}

function drawLines(listOfLines) {
    elLines.innerHTML = '';
    const nrOfElements = listOfLines.length;
    let currentElementNr = 0;
    listOfLines.forEach(line => {
        const svgLine = document.createElementNS(SVG_NS, 'line');
        const hslColor = (line.iterationSetNr / nrOfIterationsRequested) * 360;
        const color = useColoring ? `hsl(${hslColor}deg 80% 40%)`  : 'black';

        svgLine.setAttribute('x1', line.x1);
        svgLine.setAttribute('y1', line.y1);
        svgLine.setAttribute('x2', line.x2);
        svgLine.setAttribute('y2', line.y2);
        svgLine.classList.add("segment");
        svgLine.setAttribute('stroke', color);
        if (fadeColors) {
            svgLine.setAttribute('stroke-opacity', (1 - line.iterationSetNr / nrOfIterationsRequested).toFixed(3));
        }
        elLines.appendChild(svgLine);
        currentElementNr++;
    });
}
