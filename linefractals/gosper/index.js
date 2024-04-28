"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let elNrOfSegments;
let elHexagons;
let elCbxShowHexagons;

let showHexagons = true;

let nrOfIterationsRequested;
let nrOfSegments = 0;
let baseLine;

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
    baseLine = drawHexagons();
    draw(1);
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = svgWidth / 2;
    ORIGIN_Y = svgHeight / 2 + 200;

    elLines = document.getElementById("lines");
    elNrOfSegments = document.getElementById("linecount");
    elHexagons = document.getElementById("hexagons");
    elCbxShowHexagons = document.querySelector("input[name='cbxShowHexagons']");

    elCbxShowHexagons.addEventListener("input", ()=>{
        elHexagons.querySelectorAll("polyline").forEach(el => {
            el.classList.toggle("visible");
        })
    });

    elInputIterationNr = document.querySelector("input[name='iteration']");
    elInputIterationNr.addEventListener("input", handleInputChanges);

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}

function draw(nrOfIterationsToDraw) {
    let x1 = baseLine.x1;
    let x2 = baseLine.x2;
    let y1 = baseLine.y1;
    let y2 = baseLine.y2;

    if (refInterval !== undefined) {
        return;
    }

    /**
     *
     * @type {Line[]}
     */
    let listOfLines = [new Line(x1, y1, x2, y2, 0)];
    let currentIteration = 1;

    refInterval = window.setInterval(() => {
        /**
         * @type {Line[]}
         */
        const newListOfItems = [];
        listOfLines.forEach(oneLine => {
            newListOfItems.push(...splitLine(oneLine, currentIteration));
        });
        nrOfSegments = newListOfItems.length;
        updateParameterInfoOnScreen();
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
 * See https://larryriddle.agnesscott.org/ifs/ksnow/flowsnake.htm and https://larryriddle.agnesscott.org/ifs/ksnow/IFSdetailsFlowsnake.htm
 * take aways:
 * 1) angle = 60 deg
 * 2) each line has a direction
 * 3) segment length can be calculated: r = 1 / SQRT(7) * original line length
 * 4) there is no point between P3 and P4. this can be easily determined.
 * @param line {Line} the line to split up
 * @param iteration {number} the iteration number of the current run.
 */
function splitLine(line, iteration) {
    const diffX = line.x2 - line.x1;
    const diffY = line.y2 - line.y1;

    const lineDividerFactor = 7;

    const lineLength = Math.sqrt(diffX * diffX + diffY * diffY);
    const segmentLength = lineLength * (1 / Math.sqrt(7));

    const currentAngle = -Math.atan2(diffY, diffX);

    const angle60deg = (60 / 360) * (Math.PI * 2); // base angles are 60 degrees
    const angle19deg = Math.asin(Math.sqrt(3) / (2 * Math.sqrt(7)));

    /* please note that Y-axis is reversed on the HTML SVG-element in relation to carthesian coordinates */
    const p0x = line.x1;
    const p0y = line.y1;

    const p1x = p0x + Math.cos(currentAngle + angle60deg + angle19deg) * segmentLength;
    const p1y = p0y - Math.sin(currentAngle + angle60deg + angle19deg) * segmentLength;

    const p2x = p1x + Math.cos(currentAngle + angle19deg) * segmentLength;
    const p2y = p1y - Math.sin(currentAngle + angle19deg) * segmentLength;

    const p3x = p2x + Math.cos(currentAngle + angle19deg) * segmentLength;
    const p3y = p2y - Math.sin(currentAngle + angle19deg) * segmentLength;

    const p4x = p0x + Math.cos(currentAngle + angle19deg) * segmentLength;
    const p4y = p0y - Math.sin(currentAngle + angle19deg) * segmentLength;

    // there is no point P6 in the diagram (see URL's). but we need it!
    const p6x = p4x + Math.cos(currentAngle + angle19deg) * segmentLength;
    const p6y = p4y - Math.sin(currentAngle + angle19deg) * segmentLength;

    const p5x = line.x2 - (Math.cos(currentAngle + angle19deg)) * segmentLength;
    const p5y = line.y2 + (Math.sin(currentAngle + angle19deg)) * segmentLength;

    const p7x = line.x2;
    const p7y = line.y2;

    const line1 = new Line(p1x, p1y, p0x, p0y, line.iterationSetNr === 0 ? 1 : line.iterationSetNr); // note direction !!
    const line2 = new Line(p1x, p1y, p2x, p2y, line.iterationSetNr === 0 ? 2 : line.iterationSetNr);
    const line3 = new Line(p2x, p2y, p3x, p3y, line.iterationSetNr === 0 ? 3 : line.iterationSetNr);
    const line4 = new Line(p3x, p3y, p6x, p6y, line.iterationSetNr === 0 ? 4 : line.iterationSetNr);
    const line5 = new Line(p4x, p4y, p6x, p6y, line.iterationSetNr === 0 ? 5 : line.iterationSetNr);
    const line6 = new Line(p5x, p5y, p4x, p4y, line.iterationSetNr === 0 ? 6 : line.iterationSetNr);
    const line7 = new Line(p5x, p5y, p7x, p7y, line.iterationSetNr === 0 ? 7 : line.iterationSetNr);

    return [line1, line2, line3, line4, line5, line6, line7];
}

function updateParameterInfoOnScreen() {
    elNrOfSegments.innerText = nrOfSegments.toLocaleString();
}

function getParameterValueFromInputs() {

    showHexagons = elCbxShowHexagons.checked;

    if (elInputIterationNr.value === "") {
        nrOfIterationsRequested = 1;
        return;
    }
    nrOfIterationsRequested = parseInt(elInputIterationNr.value);

    if (nrOfIterationsRequested === NaN) {
        nrOfIterationsRequested = 1;
    }
    if (nrOfIterationsRequested < 1) {
        nrOfIterationsRequested = 1;
    }
    if (nrOfIterationsRequested > 7) {
        nrOfIterationsRequested = 7;
    }

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
        svgLine.classList.add(`iteration${line.iterationSetNr}`);
        elLines.appendChild(svgLine);
    });

}

/**
 *
 * @returns {Point}
 */
function drawHexagons() {

    const h1 = drawHexagon(1,ORIGIN_X - svgWidth / 2 + 100, ORIGIN_Y, 0);
    const h7 = drawHexagon(7,h1[4].x, h1[4].y,0);

    const h2 = drawHexagon(2, h1[2].x, h1[2].y,0);
    const h3 = drawHexagon(3, h2[4].x, h2[4].y,0);
    const h4 = drawHexagon(4, h7[4].x, h7[4].y,0);

    const h5 = drawHexagon(5, h7[5].x, h7[5].y, 1);
    const h6 = drawHexagon(6, h1[5].x, h1[5].y, 1);

    return new Line(h1[0].x, h1[0].y, h5[3].x,h5[3].y);
}

function drawHexagon(hexagonNr, x, y, startAtPoint) {
    /**
     * @type {Point[]}
     */
    const points = [new Point(x, y)];
    const segmentLength = 120;
    const steps = 6;
    const segmentAngle = (Math.PI * 2) / steps;
    const startAngle = (120 / 360) * (Math.PI * 2) - startAtPoint * segmentAngle;

    x = x + Math.cos(startAngle) * segmentLength;
    y = y - Math.sin(startAngle) * segmentLength;
    points.push(new Point(x, y));

    let angle = startAngle - segmentAngle;
    for (let i = 0; i < steps; i++) {
        const sx = x + Math.cos(angle) * segmentLength;
        const sy = y - Math.sin(angle) * segmentLength;
        points.push(new Point(sx, sy));

        x = sx;
        y = sy;
        angle -= segmentAngle;
    }
    const path = points.map(p => `${p.x},${p.y}`).join(' ');
    const polygon = document.createElementNS(SVG_NS, 'polyline');
    polygon.setAttribute('points', path);
    polygon.classList.add("hexagon");
    polygon.classList.add("visible");

    polygon.classList.add(`iteration${hexagonNr}`);
    elHexagons.appendChild(polygon);

    return points;
}