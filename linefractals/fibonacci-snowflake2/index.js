"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let elTheWord;
let elNrOfElements;
let elNrOfSegments;

let nrOfIterationsRequested = 1;
let theWord = "";
let nrOfLineSegments = 0;

let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;
let segmentLength = 10;


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

class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
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

    ORIGIN_X = 30;
    ORIGIN_Y = svgHeight / 2;

    elLines = document.getElementById("lines");
    elTheWord = document.getElementById("theword");
    elNrOfElements = document.getElementById("nrOfElements");
    elNrOfSegments = document.getElementById("nrOfSegments");

    elInputIterationNr = document.querySelector("input[name='iteration']");
    elInputIterationNr.value = nrOfIterationsRequested;

    document.getElementById("inputs").addEventListener("input", handleInputChanges);

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}

function draw(iterations) {
    elLines.innerHTML = '';
    theWord = createFibonacciWord(iterations);
    updateParameterInfoOnScreen();

    const setOfLines = [];

    const angle90deg = (90 / 360) * (Math.PI * 2);

    let angle = angle90deg;
    // let x = ORIGIN_X;
    // let y = ORIGIN_Y;
    let x = 0;
    let y = 0;

    const nrOfBits = theWord.length;
    for (let i = 0; i < nrOfBits; i++) {
        let digit = theWord.substring(i, i + 1);

        const l1x1 = x;
        const l1y1 = y;
        const l1x2 = l1x1 + Math.cos(angle) * segmentLength;
        const l1y2 = l1y1 - Math.sin(angle) * segmentLength;
        x = l1x2;
        y = l1y2;

        setOfLines.push(new Line(l1x1, l1y1, l1x2, l1y2));

        if (digit === "0") {
            if (i % 2 === 1) { // turn right :
                angle += angle90deg;
            } else { // turn left
                angle -= angle90deg;
            }
            const l2x1 = l1x2;
            const l2y1 = l1y2;
            const l2x2 = l2x1 + Math.cos(angle) * segmentLength;
            const l2y2 = l2y1 - Math.sin(angle) * segmentLength;

            setOfLines.push(new Line(l2x1, l2y1, l2x2, l2y2));
            x = l2x2;
            y = l2y2;
        }
    }
    let points = [
        new Point(setOfLines[0].x1, setOfLines[0].y1)
    ];
    setOfLines.forEach(l => {
        points.push(new Point(l.x2, l.y2));
    });

    const polyline = document.createElementNS(SVG_NS, 'polyline');
    const pointsStr = points.map(l => `${l.x},${l.y}`).join(' ');
    polyline.setAttribute('points', pointsStr);

    nrOfLineSegments = setOfLines.length;
    updateParameterInfoOnScreen();

    elLines.appendChild(polyline);

    const rect = polyline.getBBox();

    const bx = (rect.x ).toFixed(2);
    const by = (rect.y ).toFixed(2);
    const width = (rect.width ).toFixed(2);
    const height = (rect.height).toFixed(2);

    elCanvas.setAttribute('viewBox', `${bx} ${by} ${width} ${height} `);

}

function createLine(x1, y1, x2, y2) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    return line;
}

function createFibonacciWord(iterations) {
    const S0 = "0";
    const S1 = "01";

    if (iterations === 1) {
        return S0;
    }
    if (iterations === 2) {
        return S1;
    }

    let sequence = "010";

    let previous = S1;

    for (let i = 2; i < iterations; i++) {
        const temp = sequence;
        sequence += previous;
        previous = temp;

    }

    return sequence;

}


function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
}


function updateParameterInfoOnScreen() {
    elTheWord.textContent = theWord;
    elNrOfElements.textContent = theWord.length.toLocaleString();
    elNrOfSegments.textContent = nrOfLineSegments.toLocaleString();
}

function getParameterValueFromInputs() {

    if (elInputIterationNr.value === "") {
        nrOfIterationsRequested = 0;
        return;
    }
    nrOfIterationsRequested = parseInt(elInputIterationNr.value);

    if (isNaN(nrOfIterationsRequested)) {
        nrOfIterationsRequested = 0;
    }
    if (nrOfIterationsRequested < 0) {
        nrOfIterationsRequested = 0;
    }
    if (nrOfIterationsRequested > 100) {
        nrOfIterationsRequested = 100;
    }

}

