"use strict";

window.onload = () => {
    setup();
    draw(1);
}
const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let nrOfIterationsRequested;

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

    const lineDividerFactor = 7;

    const lineLength = Math.sqrt(diffX * diffX + diffY * diffY);
    const segmentLength = lineLength / 7;

    const currentAngle = Math.atan2(diffY, diffX);

    const angleForSegment = (60 / 360) * (Math.PI * 2); // angles are 60 degrees


    const line1 = new Line(line.x1,line.y1,line.x1 + diffX / lineDividerFactor,line.y2 + diffY / lineDividerFactor);
    const line2 = new Line(0,0,0,0);
    const line3 = new Line(0,0,0,0);
    const line4 = new Line(0,0,0,0);
    const line5 = new Line(0,0,0,0);
    const line6 = new Line(0,0,0,0);
    const line7 = new Line(0,0,0,0);

    return [line1, line2, line3, line4, line5, line6, line7];
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