"use strict";

window.onload = () => {
    setup();
    draw(1);
}
const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let elDivider;
let elDividerValue;
let elRatioValue;
let elRangeSliderRatio;

let dividerValue;
let nrOfIterationsRequested;
let ratioValue;

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

    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = svgWidth / 2;
    ORIGIN_Y = svgHeight / 2;

    document.getElementById("inputs").addEventListener("input", handleInputChanges);
    elInputIterationNr = document.querySelector("input[name='iteration']");
    elDivider = document.querySelector("input[name='angle']");

    elRangeSliderRatio = document.querySelector("input[name='baselineratio']");
    elRatioValue = document.getElementById("ratioValue");

    elLines = document.getElementById("lines");
    elDividerValue = document.getElementById("dividerValue");

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}

function draw(nrOfIterationsToDraw) {
    let x1 = ORIGIN_X - svgWidth / 2;
    let x2 = ORIGIN_X + svgWidth / 2;
    let y1 = ORIGIN_Y;
    let y2 = ORIGIN_Y;

    if (refInterval !== undefined) {
        return;
    }

    /**
     *
     * @type {Line[]}
     */
    let listOfLines = [new Line(x1, y1, x2, y2)];
    let currentIteration = 1;

    refInterval = window.setInterval(() => {
        /**
         * @type {Line[]}
         */
        const newListOfItems = [];
        listOfLines.forEach(oneLine => {
            newListOfItems.push(...splitLine(oneLine));
        });
        drawLines(newListOfItems);

        listOfLines = newListOfItems;
        currentIteration++;
        if (currentIteration > nrOfIterationsToDraw) {
            clearInterval(refInterval);
            refInterval = undefined;
        }
    }, 500);

}

/**
 *
 * @param line
 */
function splitLine(line) {
    const diffX = line.x2 - line.x1;
    const diffY = line.y2 - line.y1;

    const lineLength = Math.sqrt(diffX * diffX + diffY * diffY);

    const segmentBaseDivider = ratioValue;
    const segmentPeekDivider = 1 / (1 - 2 * ( 1 / segmentBaseDivider));

    const segmentPeekBaseLength = lineLength / segmentPeekDivider;

    const currentAngle = Math.atan2(diffY, diffX);

    const angleRequested = (Math.PI / dividerValue);

    const peekAngle = angleRequested - currentAngle;
    const rightAngle = (90 / 180) * Math.PI;
    const otherPeekAngle = Math.PI - rightAngle - angleRequested; // Right scalene triangle, angle B = 90 deg.
    let radius;

    if (Math.sin(otherPeekAngle) === 0) {
        radius = Math.abs(segmentPeekBaseLength / 2);
    } else {
        radius = Math.abs(Math.sin(rightAngle) / Math.sin(otherPeekAngle) * Math.abs(segmentPeekBaseLength / 2));
    }
    const line1 = new Line(line.x1, line.y1, line.x1 + diffX / segmentBaseDivider, line.y1 + diffY / segmentBaseDivider);
    const line4 = new Line(line.x2 - diffX / segmentBaseDivider, line.y2 - diffY / segmentBaseDivider, line.x2, line.y2);

    const peekX = line1.x2 + Math.cos(peekAngle) * radius;
    const peekY = line1.y2 - Math.sin(peekAngle) * radius;

    const line2 = new Line(line1.x2, line1.y2, peekX, peekY);
    const line3 = new Line(line2.x2, line2.y2, line4.x1, line4.y1);

    return [line1, line2, line3, line4];
}

function updateParameterInfoOnScreen(){
    elDividerValue.textContent = dividerValue.toString();
    elRatioValue.textContent = ratioValue.toString();
}

function getParameterValueFromInputs(){
    nrOfIterationsRequested = parseInt(elInputIterationNr.value);
    dividerValue = parseInt(elDivider.value) / 10;
    ratioValue = parseInt(elRangeSliderRatio.value) / 10;
}

function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
}

function drawLines(listOfLines) {
    elLines.innerHTML = '';
    listOfLines.forEach(line => {
        const svgLine = document.createElementNS(SVG_NS, 'line');

        svgLine.setAttribute('x1', line.x1);
        svgLine.setAttribute('y1', line.y1);
        svgLine.setAttribute('x2', line.x2);
        svgLine.setAttribute('y2', line.y2);
        svgLine.classList.add("segment");
        elLines.appendChild(svgLine);
    });

}