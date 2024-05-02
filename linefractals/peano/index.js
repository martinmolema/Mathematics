"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";
let elCanvas;
let elInputIterationNr;
let elLines;

let nrOfIterationsRequested;


let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;

// direction we're going to draw
const DIRECTION_UP = "U";
const DIRECTION_DOWN = "D";

// Variant: start left then go right, or start right and then go left
const VARIANT_DRAW_LEFT = "L";
const VARIANT_DRAW_RIGHT = "R";

class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * A class to represent a position with the class Matrix
 */
class Cell {
    /**
     * {number} range = 0 to nr of colums-1
     */
    col;
    /**
     * {number} range = 0 to nr of rows-1
     */
    row;

    /**
     *
     * @param col {number}
     * @param row {number}
     */
    constructor(row, col) {
        this.col = col;
        this.row = row;
    }
}

class Matrix {
    /**
     * {number}
     */
    rows;
    /**
     * {number}
     */
    cols;
    /**
     * {number}
     */
    width;
    /**
     * {Rectangles[][]}
     */
    rectangles;

    /**
     *
     * @param rows {number}
     * @param cols {number}
     * @param width {number}
     */
    constructor(rows, cols, width) {
        this.rows = rows;
        this.cols = cols;
        this.width = width
        this.createCells();
    }

    createCells() {
        const w = this.width / this.cols;

        this.rectangles = [];

        for (let r = 0; r < this.rows; r++) {
            const colrects = [];
            for (let col = 0; col < this.cols; col++) {
                colrects.push(new Rectangle(col * w, r * w, w));
            }
            this.rectangles.push(colrects);
        }
    }


    /**
     * Checks if there is room to place a shape with a size given in number of rows and number of columns
     * Numbers can be negative to give a relative. The given cell is regarded as the part of the shape to be placed.
     * @param startCell {Cell}
     * @param rows {number}
     * @param cols {number}
     * @return {boolean}
     */
    hasRoomForShape(startCell, rows, cols) {

        rows += rows < 1 ? 1 : -1;
        cols += cols < 1 ? 1 : -1;
        return (
            (startCell.row + rows <= this.lastRowNumber()) &&
            (startCell.col + cols <= this.lastColumnNumber()) &&
            (startCell.row + rows >= this.firstRowNumber()) &&
            (startCell.col + cols >= this.firstColumnNumber())
        )
    }

    getPosition(row, col) {
        return new Cell(row, col);
    }

    lastRowNumber() {
        return this.rows - 1;
    }

    lastColumnNumber() {
        return this.cols - 1;
    }

    firstColumnNumber() {
        return 0;
    }

    firstRowNumber() {
        return 0;
    }

    CellAtPosition(cell) {
        return this.rectangles[cell.row][cell.col];
    }
}

class Curve {
    /**
     *@type {Point[]}
     */
    points;

    /**
     * @type {Rectangle[]}
     */
    cells;
    /**
     * @type {Rectangle}
     */
    outerRectangle;
    /**
     * @type {DIRECTION_UP | DIRECTION_DOWN}
     */
    direction;
    /**
     * @type {VARIANT_DRAW_RIGHT | VARIANT_DRAW_LEFT}
     */
    variant;

    /**
     *
     * @param rectangle {Rectangle}
     * @param direction {DIRECTION_UP | DIRECTION_DOWN}
     * @param variant {VARIANT_DRAW_RIGHT | VARIANT_DRAW_LEFT}
     */
    constructor(rectangle, direction, variant) {
        this.points = [];
        this.cells = [];
        this.variant = variant;
        this.direction = direction;
        this.outerRectangle = rectangle;
        this.createOneCurve();
    }


    /**
     *
     * @param rectangle {Rectangle}
     * @param direction {DIRECTION_UP | DIRECTION_DOWN}
     * @param variant {VARIANT_DRAW_LEFT | VARIANT_DRAW_RIGHT}
     */
    createOneCurve() {
        /* split the given rectangle in 9 new rectangles
        The order is:
        0 1 2
        3 4 5
        6 7 8
     */

        const cells = this.outerRectangle.createSquares();
        /**
         * {Point[]}
         */

        switch (this.variant) {
            case VARIANT_DRAW_RIGHT:
                switch (this.direction) {
                    case DIRECTION_UP:
                        this.points = [
                            cells[6].center(),
                            cells[3].center(),
                            cells[0].center(),
                            cells[1].center(),
                            cells[4].center(),
                            cells[7].center(),
                            cells[8].center(),
                            cells[5].center(),
                            cells[2].center(),
                        ];
                        break;
                    case DIRECTION_DOWN:
                        this.points = [
                            cells[0].center(),
                            cells[3].center(),
                            cells[6].center(),
                            cells[7].center(),
                            cells[4].center(),
                            cells[1].center(),
                            cells[2].center(),
                            cells[5].center(),
                            cells[8].center(),
                        ];
                        break;
                }
                break;
            case VARIANT_DRAW_LEFT:
                switch (this.direction) {
                    case DIRECTION_UP:
                        this.points = [
                            cells[8].center(),
                            cells[5].center(),
                            cells[2].center(),
                            cells[1].center(),
                            cells[4].center(),
                            cells[7].center(),
                            cells[6].center(),
                            cells[3].center(),
                            cells[0].center(),
                        ];

                        break;
                    case DIRECTION_DOWN:
                        this.points = [
                            cells[2].center(),
                            cells[5].center(),
                            cells[8].center(),
                            cells[7].center(),
                            cells[4].center(),
                            cells[1].center(),
                            cells[0].center(),
                            cells[3].center(),
                            cells[6].center(),
                        ];
                        break;
                }
                break;

        }
        this.cells = cells;
    }

}

class Rectangle {
    x;
    y;
    w;
    h;
    x2;
    y2;

    /**
     * Creates a rectangle; because the width and height are equal, only one is supplied.
     * @param x  {number}
     * @param y {number}
     * @param w {number}
     */
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = w;
        this.x2 = x + w;
        this.y2 = y + w;
    }

    center() {
        return new Point(this.x + this.w / 2, this.y + this.h / 2);
    }

    /**
     * Creates a list of 9 rectangles evenly dividing the given rectangle in 3 columns by 3 rows
     * The order is:
     * 0 1 2
     * 3 4 5
     * 6 7 8
     * @param rect {Rectangle}
     * @returns {Rectangle[]}
     */
    createSquares() {
        const newWidth = this.w / 3;
        const rectangles = [
            new Rectangle(this.x, this.y, newWidth),
            new Rectangle(this.x + newWidth, this.y, newWidth),
            new Rectangle(this.x + 2 * newWidth, this.y, newWidth),
            new Rectangle(this.x, this.y + newWidth, newWidth),
            new Rectangle(this.x + newWidth, this.y + newWidth, newWidth),
            new Rectangle(this.x + 2 * newWidth, this.y + newWidth, newWidth),
            new Rectangle(this.x, this.y + 2 * newWidth, newWidth),
            new Rectangle(this.x + newWidth, this.y + 2 * newWidth, newWidth),
            new Rectangle(this.x + 2 * newWidth, this.y + 2 * newWidth, newWidth),
        ];
        return rectangles;
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
    elInputIterationNr = document.querySelector("input[name='iteration']");

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
    if (nrOfIterationsRequested > 30) {
        nrOfIterationsRequested = 30;
    }

}

function draw(nrOfIterationsRequested) {

    const nrOfRows = Math.pow(3, nrOfIterationsRequested)
    const nrOfColumns  = nrOfRows;

    const matrix = new Matrix(nrOfRows, nrOfColumns, svgWidth)

    let cell = matrix.getPosition(matrix.lastRowNumber(), matrix.firstColumnNumber());

    let direction = DIRECTION_UP;
    let variant = VARIANT_DRAW_RIGHT;

    let infiniteLoopProtection = 999;
    let roomForMoreShapes = true;

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

    const points = [];
    let nrOfCurves = 0;
    for (let col = 0; col < nrOfColumns; col++) {
        variant = VARIANT_DRAW_RIGHT;
        let startval, endval, increment;
        switch (direction) {
            case DIRECTION_UP:
                startval = nrOfRows-1;
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
            nrOfCurves++;
            points.push(...curve.points);
            // switch directions
            variant = (variant === VARIANT_DRAW_RIGHT) ? VARIANT_DRAW_LEFT : VARIANT_DRAW_RIGHT;
        }
        direction = (direction === DIRECTION_DOWN) ? DIRECTION_UP : DIRECTION_DOWN;
    }
    elLines.innerHTML = '';

    let curPoint = points[0];
    let totalLength = 0;
    points.forEach(point => {
        const diffX = point.x - curPoint.x;
        const diffY = point.y - curPoint.y;

        totalLength += Math.sqrt( diffX * diffX + diffY * diffY );
        curPoint = point;
    })
    createAndAddLine(points, totalLength);
}

function createAndAddLine(points, totalLength) {
    const path = points.map(p => `${p.x},${p.y}`).join(' ');
    const svgPolyline = document.createElementNS(SVG_NS, 'polyline');
    svgPolyline.setAttribute('points', path);
    svgPolyline.setAttribute('stroke-dasharray', totalLength.toString());
    svgPolyline.setAttribute('stroke-dashoffset', totalLength.toString());
    elLines.appendChild(svgPolyline);

}
