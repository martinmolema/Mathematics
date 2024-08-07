"use strict";

window.onload = () => {
    setup();
    draw(0);
}
const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let elDivider;
let elDividerValue;
let elRatioValue;
let elRangeSliderRatio;
let elStartReversed;

let dividerValue;
let nrOfIterationsRequested;
let ratioValue;
let startReversed = false;

let svgWidth;
let svgHeight;

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

    swapBeginEnd(){
        const tx = this.x2;
        const ty = this.y2;
        this.x2 = this.x1;
        this.y2 = this.y1;
        this.x1 = tx;
        this.y1 = ty;
    }
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    document.getElementById("inputs").addEventListener("input", handleInputChanges);
    elInputIterationNr = document.querySelector("input[name='iteration']");
    elDivider = document.querySelector("input[name='angle']");
    elStartReversed = document.querySelector("input[name='startReversed']");

    elRangeSliderRatio = document.querySelector("input[name='baselineratio']");
    elRatioValue = document.getElementById("ratioValue");

    elLines = document.getElementById("lines");
    elDividerValue = document.getElementById("dividerValue");

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}

function draw(nrOfIterationsToDraw) {

    if (refInterval !== undefined) {
        return;
    }

    const margin = 150;

    // note that the direction of the line is important so the iterations all point outward!
    const line1 = new Line(svgWidth - margin, svgHeight - margin, margin , svgHeight - margin); // base
    const line2 = new Line(svgWidth / 2 , margin / 2, line1.x1, line1.y1); // left
    const line3 = new Line(line1.x2, line1.y2, line2.x1, line2.y1); // right


    if (startReversed) {
        line1.swapBeginEnd();
        line2.swapBeginEnd();
        line3.swapBeginEnd();
    }

    let listOfLines = [
        line1, line2, line3
    ];

    let currentIteration = 1;
    drawLines(listOfLines);

    if (nrOfIterationsToDraw >0){
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

    // calculate how the given line is oriented
    const currentAngle = Math.atan2(diffY, diffX);

    // calculate the angle requested by the user
    const angleRequested = (Math.PI / dividerValue);

    // calculate what is the angle of the peek relative to the current angle
    const peekAngle = angleRequested - currentAngle;

    // now create a right scalene triangle, with B having an angle of 90 degrees. Angle A is the requested angle
    // remains to calculate the other angle (C) . Now we have 3 angles and we can calculate the radius (c)
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
    startReversed = elStartReversed.checked;
}

function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
}

function drawLines(listOfLines) {
    elLines.innerHTML = '';
/*    listOfLines.forEach(line => {
        const svgLine = document.createElementNS(SVG_NS, 'line');

        svgLine.setAttribute('x1', line.x1);
        svgLine.setAttribute('y1', line.y1);
        svgLine.setAttribute('x2', line.x2);
        svgLine.setAttribute('y2', line.y2);
        svgLine.classList.add("segment");
        elLines.appendChild(svgLine);
    });*/

    const path = listOfLines.map(p => `M ${p.x1},${p.y1} L ${p.x2},${p.y2}`).join(' ');
    const svgPolyline = document.createElementNS(SVG_NS, 'path');
    svgPolyline.setAttribute('d', path);
    elLines.appendChild(svgPolyline);
    return path;

}