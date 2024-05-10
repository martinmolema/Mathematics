"use strict";

import {Rectangle, SVG_NS} from "./rectangle.js";

const MIN_NR_OF_ITERATIONS = 0;
const MAX_NR_OF_ITERATIONS = 10;

let elCanvas;
let elLines;
let elLetters;
let elFills;
let elConnectors;

let elInputIterationNr;
let elNrOfSegments;
let elCbxUseAnimatedPath;
let elCbxUseColoring;
let elCbxAddTypeIndicator;
let elCbxShowConnectors;
let elCbxFillRectangles;
let elCbxShowShapes;

let nrOfIterationsRequested;
let useAnimatedPath = false;
let useColoring = false;
let addTypeIndicator = false;
let showConnectors = true;
let fillRectangles = false;
let showShapes = true;

let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;


window.onload = () => {
    setup();
    draw(nrOfIterationsRequested);
}


function setup() {
    // elements in the SVG
    elCanvas = document.getElementById('canvas');
    elLines = document.getElementById("lines");
    elLetters = document.getElementById("letters");
    elFills = document.getElementById("fills");
    elConnectors = document.getElementById("connectors");

    // <input> and <SPAN> elements for input and display of information
    elNrOfSegments = document.getElementById('nrOfSegments');

    // check boxes
    elCbxUseAnimatedPath = document.getElementById('cbxUseAnimatedPath');
    elCbxAddTypeIndicator = document.getElementById('cbxAddTypeIndicators');
    elCbxUseColoring = document.getElementById('cbxUseColoring');
    elCbxShowConnectors = document.getElementById('cbxShowConnectors');
    elCbxFillRectangles = document.getElementById('cbxFillRectangles');
    elCbxShowShapes = document.getElementById('cbxShowShapes');


    // number of iterations input.
    elInputIterationNr = document.querySelector("input[name='iteration']");
    elInputIterationNr.max = MAX_NR_OF_ITERATIONS.toString();
    elInputIterationNr.min = MIN_NR_OF_ITERATIONS.toString();


    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = 0;
    ORIGIN_Y = svgHeight - 10;


    // react to changes that need redrawing
    elInputIterationNr.addEventListener("input", handleInputChanges);
    elCbxUseAnimatedPath.addEventListener("input", handleInputChanges);

    // react to changes that only need CSS-changes and no redraw.
    elCbxShowConnectors.addEventListener("input", updateDrawingStyling);
    elCbxUseColoring.addEventListener("input", updateDrawingStyling);
    elCbxFillRectangles.addEventListener("input", updateDrawingStyling);
    elCbxAddTypeIndicator.addEventListener("input", updateDrawingStyling);
    elCbxShowShapes.addEventListener("input", updateDrawingStyling);


    // put default values from globals in the <INPUT> elements
    elCbxUseAnimatedPath.checked = useAnimatedPath;
    elCbxUseColoring.checked = useColoring;
    elCbxAddTypeIndicator.checked = addTypeIndicator;
    elCbxShowConnectors.checked = showConnectors;
    elCbxFillRectangles.checked = fillRectangles;
    elCbxShowShapes.checked = showShapes;

    // now get all parameters and update display
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    updateDrawingStyling();
}

/**
 * Updates the styling of groups so they are either visible or invisible; some <G>-elements get a class added or removed
 * to visually enable certain CSS-selectors like coloring.
 */
function updateDrawingStyling() {
    getParameterValueFromInputs();
    elFills.style.visibility = fillRectangles ? "visible" : "hidden";
    elLetters.style.visibility = addTypeIndicator ? "visible" : "hidden";
    elConnectors.style.visibility = showConnectors ? "visible" : "hidden";
    elLines.style.visibility = showShapes ? "visible" : "hidden";

    if (useColoring) {
        elLines.classList.add('colored');
    } else {
        elLines.classList.remove('colored');
    }

    if (fillRectangles) {
        elLetters.classList.add('colored');
    } else {
        elLetters.classList.remove('colored');
    }
}


/**
 * Clears the canvas
 */
function clearCanvas() {
    elLines.innerHTML = '';
    elLetters.innerHTML = '';
    elFills.innerHTML = '';
    elConnectors.innerHTML = '';
}

function draw(nrOfIterationsRequested, fillRectangle) {
    clearCanvas();

    const firstRectangle = new Rectangle(10, 10, svgWidth - 20, "A", 0);

    if (nrOfIterationsRequested === 0) {
        firstRectangle.drawShape(elLines, useColoring);
        return;
    }

    // now create all rectangles
    let rects = [firstRectangle];
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
            rect.drawShape(elLines, useColoring);
        } else {
            rect.determinePointsOfShape();
            points.push(...rect.points);
        }
        const txt = document.createElementNS(SVG_NS, "text");
        txt.textContent = rect.typeIndicator;
        txt.setAttribute("x", rect.center().x);
        txt.setAttribute("y", rect.center().y + 4);
        txt.style.fontSize = `${15 - rect.iterationNr * 2}pt`;
        txt.classList.add("type-indicator");
        txt.classList.add(`type-${rect.typeIndicator}`);
        elLetters.appendChild(txt);

        const filledRect = document.createElementNS(SVG_NS, "rect");
        filledRect.setAttribute('x', rect.x + rect.w / 4);
        filledRect.setAttribute('y', rect.y + rect.w / 4);
        filledRect.setAttribute('width', rect.w / 2);
        filledRect.setAttribute('height', rect.h / 2);
        filledRect.classList.add('shape');
        filledRect.classList.add('filler');
        filledRect.classList.add(`type-${rect.typeIndicator}`);
        elFills.appendChild(filledRect);


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
                elConnectors.appendChild(line);
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
    elCbxShowConnectors.disabled = useAnimatedPath;
    elCbxUseColoring.disabled = useAnimatedPath;
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
    addTypeIndicator = elCbxAddTypeIndicator.checked;
    showConnectors = elCbxShowConnectors.checked;
    fillRectangles = elCbxFillRectangles.checked;
    showShapes = elCbxShowShapes.checked;
}