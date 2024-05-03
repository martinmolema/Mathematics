"use strict";

import {Curve, DIRECTION_DOWN, DIRECTION_UP, VARIANT_DRAW_LEFT, VARIANT_DRAW_RIGHT} from "./curve.js";
import {Matrix} from "./matrix.js";

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;
let elCbxUseAnimatedPath;
let elCbxUseDifferentColorForConnectors;
let elCbxShowConnectors;
let elCbxShowDots
let elCbxShowRectangles;

let nrOfIterationsRequested;
let showConnectors = true;
let differentColorForConnectors = true;
let useAnimatedPath = false;
let showDots = false;
let showRectangles = false;

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
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = svgWidth / 2;
    ORIGIN_Y = svgHeight / 2;

    elLines = document.getElementById("lines");
    elInputIterationNr = document.querySelector("input[name='iteration']");

    elCbxUseAnimatedPath = document.getElementById("cbxUseAnimatedPath");
    elCbxUseDifferentColorForConnectors = document.getElementById("cbxConnectorDifferentColor");
    elCbxShowConnectors = document.getElementById("cbxShowConnectors");
    elCbxShowDots = document.getElementById("cbxShowStartEndPoints");
    elCbxShowRectangles = document.getElementById("cbxShowRectangles");

    elCbxShowConnectors.checked = showConnectors;
    elCbxUseDifferentColorForConnectors.checked = differentColorForConnectors;
    elCbxUseAnimatedPath.checked = useAnimatedPath;
    elCbxShowDots.checked = showDots;
    elCbxShowRectangles.checked = showRectangles;

    document.getElementById("inputs").addEventListener("input", handleInputChanges);

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
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
    if (nrOfIterationsRequested > 6) {
        nrOfIterationsRequested = 6;
    }

    useAnimatedPath = elCbxUseAnimatedPath.checked;
    differentColorForConnectors = elCbxUseDifferentColorForConnectors.checked;
    showConnectors = elCbxShowConnectors.checked;
    showDots = elCbxShowDots.checked;
    showRectangles = elCbxShowRectangles.checked;

    elCbxUseDifferentColorForConnectors.disabled = useAnimatedPath;
    elCbxShowConnectors.disabled = useAnimatedPath;
    elCbxShowDots.disabled = useAnimatedPath;
}

function draw(nrOfIterationsRequested) {

    const nrOfRows = Math.pow(3, nrOfIterationsRequested)
    const nrOfColumns = nrOfRows;

    const matrix = new Matrix(nrOfRows, nrOfColumns, svgWidth)

    let cell = matrix.getPosition(matrix.lastRowNumber(), matrix.firstColumnNumber());

    let direction = DIRECTION_UP;
    let variant = VARIANT_DRAW_RIGHT;

    let infiniteLoopProtection = 999;
    let roomForMoreShapes = true;

    // clear the canvas
    elLines.innerHTML = '';

    /**
     * Algorithm:
     *  1) start with direction "UP"
     *  2) draw shape
     *  3) check if same direction fits
     *    3a) if fits: draw!; goto 3
     *    3b) if not fits: check direction:
     *          when going UP --> direction becomes DOWN; move right one column
     *          when going DOWN --> direction becomes UP; move right one column
     *    4) goto 3
     */

    /**
     *
     * @type {Curve[]}
     */
    const curves = [];


    let previousCurve = undefined;
    let nrOfCurves = 0;
    for (let col = 0; col < nrOfColumns; col++) {
        variant = VARIANT_DRAW_RIGHT;
        let startval, endval, increment;
        switch (direction) {
            case DIRECTION_UP:
                startval = nrOfRows - 1;
                endval = -1;
                increment = -1;
                break;
            case DIRECTION_DOWN:
                startval = 0;
                endval = nrOfRows;
                increment = 1;
                break;
        }
        for (let row = startval; row !== endval; row += increment) {
            const cell = matrix.CellAtPosition(matrix.getPosition(row, col));
            const curve = new Curve(cell, direction, variant);
            curves.push(curve);
            if (!useAnimatedPath) {
                drawCurve(curve);

                if (showConnectors && previousCurve !== undefined) {
                    drawConnectorLine(previousCurve, curve);
                }
                previousCurve = curve;
            }

            // switch directions
            variant = (variant === VARIANT_DRAW_RIGHT) ? VARIANT_DRAW_LEFT : VARIANT_DRAW_RIGHT;
        }
        direction = (direction === DIRECTION_DOWN) ? DIRECTION_UP : DIRECTION_DOWN;
    }

    if (showRectangles) {
        drawRectangles(curves);
    }

    if (useAnimatedPath) {
        createAndAddAnimatedPolyline(curves);
    }
}

function drawRectangles(curves){
    if (showRectangles){
        curves.forEach(curve => {
            curve.cells.forEach(cell => {
                elLines.appendChild(createRectangle(cell.x, cell.y, cell.w, cell.h, "cell"));
            });
            elLines.appendChild(createRectangle(curve.cells[0].x, curve.cells[0].y, curve.cells[0].w * 3, curve.cells[0].w * 3, "boundary"));
        });
    }
}

function createAndAddAnimatedPolyline(curves) {
    let totalLength = 0;
    let allPoints = [];
    curves.forEach(curve => {
        allPoints.push(...curve.points);
    });

    let curPoint = allPoints[0];
    allPoints.forEach(p => {
        const diffX = p.x - curPoint.x;
        const diffY = p.y - curPoint.y;

        totalLength += Math.sqrt(diffX * diffX + diffY * diffY);
        curPoint = p;
    });

    const pointsAsString = allPoints.map(p => `${toStringFixed(p.x)},${toStringFixed(p.y)}`).join(' ');
    const svgPolyline = document.createElementNS(SVG_NS, 'polyline');
    svgPolyline.setAttribute('points', pointsAsString);
    svgPolyline.setAttribute('stroke-dasharray', totalLength.toString());
    svgPolyline.setAttribute('stroke-dashoffset', totalLength.toString());
    elLines.appendChild(svgPolyline);
}

function drawCurve(curve) {
    const line = createSVGPolyine(curve.points);
    elLines.appendChild(line);

    if (showDots) {
        const dot1 = createDot(curve.points[0], "start");
        const dot2 = createDot(curve.points[5], "end");
        elLines.appendChild(dot1);
        elLines.appendChild(dot2);
    }
}

/**
 *
 * @param x {number}
 * @param y {number}
 * @param w {number}
 * @param h {number}
 * @param className {string}
 * @return {SVGRectElement}
 */
function createRectangle(x, y, w, h, className) {

    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.classList.add(className);
    return rect;
}

function createDot(point, className) {
    const dot = document.createElementNS(SVG_NS, "circle");

    dot.setAttribute('cx', toStringFixed(point.x));
    dot.setAttribute('cy', toStringFixed(point.y));
    dot.setAttribute('r', '3');
    dot.classList.add('dot');
    if (className !== undefined) {
        dot.classList.add(className);
    }

    return dot;
}

function createSVGPolyine(points, className) {
    const svgLine = document.createElementNS(SVG_NS, "polyline");
    const pointsAsString = points.map(p => `${toStringFixed(p.x)},${toStringFixed(p.y)}`).join(' ');
    svgLine.setAttribute('points', pointsAsString);
    svgLine.classList.add(className);
    return svgLine;
}


function toStringFixed(n) {
    return n.toFixed(2);
}

function createSVGLine(x1, y1, x2, y2, className) {
    const svgLine = document.createElementNS(SVG_NS, 'line');

    svgLine.setAttribute('x1', toStringFixed(x1));
    svgLine.setAttribute('y1', toStringFixed(y1));
    svgLine.setAttribute('x2', toStringFixed(x2));
    svgLine.setAttribute('y2', toStringFixed(y2));
    svgLine.classList.add(className);
    return svgLine;
}

function drawConnectorLine(curve1, curve2) {
    const p1 = curve1.points[curve1.points.length - 1];
    const p2 = curve2.points[0];
    const line = createSVGLine(p1.x, p1.y, p2.x, p2.y, "connector");
    if (!showConnectors) {
        line.classList.add("invisible");
    }
    if (differentColorForConnectors) {
        line.classList.add("differentColor");
    }
    elLines.appendChild(line);
}