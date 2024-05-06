"use strict";

import {Rectangle, SVG_NS} from "./rectangle.js";
import {Point} from "./point.js";

const MIN_NR_OF_ITERATIONS = 0;
const MAX_NR_OF_ITERATIONS = 10;

let elCanvas;
let elLines;
let elInputIterationNr;
let elNrOfSegments;
let elCbxUseAnimatedPath;
let elCbxUseColoring;

let nrOfIterationsRequested;
let useAnimatedPath = false;
let useColoring = false;

let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;


window.onload = () => {
    setup();
    draw(nrOfIterationsRequested);
}


function setup() {
    elCanvas = document.getElementById('canvas');
    elNrOfSegments = document.getElementById('nrOfSegments');
    elCbxUseAnimatedPath = document.getElementById('cbxUseAnimatedPath');
    elCbxUseColoring = document.getElementById('cbxUseColoring');

    elInputIterationNr = document.querySelector("input[name='iteration']");
    elInputIterationNr.max = MAX_NR_OF_ITERATIONS.toString();
    elInputIterationNr.min = MIN_NR_OF_ITERATIONS.toString();

    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = 0;
    ORIGIN_Y = svgHeight - 10;

    elLines = document.getElementById("lines");
    document.getElementById("inputs").addEventListener("input", handleInputChanges);

    elCbxUseAnimatedPath.checked = useAnimatedPath;
    elCbxUseColoring.checked = useColoring;

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}

function draw(nrOfIterationsRequested) {
    elLines.innerHTML = '';
    const rect = new Rectangle(10, 10, svgWidth - 20, "A", 0);

    if (nrOfIterationsRequested === 0) {
        rect.draw(elLines, useColoring);
        return;
    }
    let rects = [rect];
    for (let i = 0; i < nrOfIterationsRequested; i++) {
        const newRects = [];
        rects.forEach(r => {
            newRects.push(...r.createSubSquaresForNextIteration(i));
        });
        rects = newRects;
    }
    let nrOfConnectors = 0;
    let prev = undefined;
    let points = [];

    rects.forEach((rect, i) => {
        if (!useAnimatedPath) {
            rect.draw(elLines, useColoring);
        } else {
            rect.determinePointsOfShape();
            points.push(...rect.points);
        }
        if (prev !== undefined) {
            const p1x = prev.endPoint.x;
            const p1y = prev.endPoint.y;
            const p2x = rect.startPoint.x;
            const p2y = rect.startPoint.y;

            /**
             * If the path must be animated DO NOTHING! The points of the shapes will automatically be connected
             * because the polyline will just see a list of consecutive points.
             */
            if (!useAnimatedPath) {
                const line = createLine(p1x, p1y, p2x, p2y, `connector`);
                if (useColoring) {
                    line.classList.add(`${rect.typeIndicator}-${prev.typeIndicator}`);
                }
                elLines.appendChild(line);
                nrOfConnectors++;
            }
        }

        prev = rect;
    });
    elNrOfSegments.textContent = (rects.length * 3 + nrOfConnectors).toLocaleString();
    if (useAnimatedPath) {
        elLines.appendChild(createPolyline(points));
    }
}

function createPolyline(points) {
    const polyline = document.createElementNS(SVG_NS, "polyline");
    const strPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    // determine length of the polyline using Pythagoras's algorithm so the connectors are also taken in to account
    let prev = points[0];
    const segmentLength = points.reduce((acc, cur) => {
        const diffx = cur.x - prev.x;
        const diffy = cur.y - prev.y;
        acc += Math.sqrt(diffx * diffx + diffy * diffy);
        prev = cur;
        return acc;
    }, 0);


    polyline.setAttribute('points', strPoints);
    polyline.setAttribute('stroke-dasharray', segmentLength.toString());
    polyline.setAttribute('stroke-dashoffset', segmentLength.toString());
    polyline.classList.add("shape");
    polyline.classList.add("animated");
    polyline.addEventListener("animationend", () => {
        console.log(` animation done`);
    })
    return polyline;
}

function createLine(x1, y1, x2, y2, className) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.classList.add(className);
    return line;
}


function updateParameterInfoOnScreen() {
}

function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
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
}