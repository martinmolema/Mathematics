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
let rectangleSize = 220;


class Rectangle {
    x1;
    y1;
    x2;
    y2;
    w;
    h;

    constructor(x, y, w, h) {
        this.x1 = x;
        this.y1 = y;
        this.w = w;
        this.h = h;
        this.x2 = x + w;
        this.y2 = y + w;
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


class Cross {
    x;
    y;
    w;
    iterationNr;
    nrOfReductions;

    /**
     * @type {Rectangle[]}
     */
    rectangles;

    /**
     *
     * @param x {number} x-coordinate of top left corner
     * @param y {number} y-coordinate of top left corner
     * @param w {number} width of one square; so the total width / height is 3 times this width; see https://en.wikipedia.org/wiki/Fibonacci_word_fractal#/media/File:Fibonacci_snowflakes_2_1,_2,_3,_and_4.svg
     * @param iterationNr {number}
     */
    constructor(x, y, w, iterationNr) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.iterationNr = iterationNr;
        this.createRectangles(x, y, w);
        this.nrOfReductions = 0;
    }

    createRectangles(x, y, w) {
        this.rectangles = [];
        this.rectangles.push(new Rectangle(x, y, w));  // top
        this.rectangles.push(new Rectangle(x + w, y + w, w)); // right
        this.rectangles.push(new Rectangle(x, y + 2 * w, w)); // bottom
        this.rectangles.push(new Rectangle(x - w, y + w, w)); // left
        this.rectangles.push(new Rectangle(x, y + w, w)); // center
    }

    /**
     *
     * @param element { SVGElement }
     */
    draw(element) {
        this.rectangles.forEach(r => {
            const rect = document.createElementNS(SVG_NS, "rect");
            rect.setAttribute('x', r.x1);
            rect.setAttribute('y', r.y1);
            rect.setAttribute('width', r.w);
            rect.setAttribute('height', r.w);
            rect.classList.add('cross');
            rect.classList.add(`iteration${this.iterationNr}`);

            element.appendChild(rect);
        })
    }

    /**
     * reduce the current set of rectangles to only the last one
     */
    reduce() {
        switch (this.nrOfReductions) {
            case 0:
                this.rectangles.splice(0, 4); // reduce to one block (the center block)
                this.nrOfReductions++;
                break;
            case 1:
                const block = this.rectangles[0];
                const w = this.w / 3;
                this.x = block.x1 + w;
                this.y = block.y1;
                this.w = w;
                // now create a new cross from the last block
                this.createRectangles(this.x, this.y, this.w);
                this.nrOfReductions++;
                break;
            default:
                this.nrOfReductions = 0;
                break;
        }

        return this.nrOfReductions;
    }

    /*

        /!**
         *
         * @param x {number} x-coordinate of top left corner
         * @param y {number}
         * @param lineLength {number}
         * @returns {Line[]}
         *!/
        createCross(x, y, lineLength) {
            /!**
             *
             * @type {Line[]}
             *!/
            const lines = [];
            const line01 = new Line(x, y, x + lineLength, y);
            const line02 = new Line(line01.x2, line01.y2, line01.x2, line01.y2 + lineLength);
            const line03 = new Line(line02.x2, line02.y2, line02.x2 + lineLength, line02.y2);
            const line04 = new Line(line03.x2, line03.y2, line03.x2, line03.y2 + lineLength);
            const line05 = new Line(line04.x2, line04.y2, line04.x2 - lineLength, line04.y2);
            const line06 = new Line(line05.x2, line05.y2, line05.x2, line05.y2 + lineLength);
            const line07 = new Line(line06.x2, line06.y2, line06.x2 - lineLength, line06.y2);
            const line08 = new Line(line07.x2, line07.y2, line07.x2, line07.y2 - lineLength);
            const line09 = new Line(line08.x2, line08.y2, line08.x2 - lineLength, line08.y2);
            const line10 = new Line(line09.x2, line09.y2, line09.x2, line09.y2 - lineLength);
            const line11 = new Line(line10.x2, line10.y2, line10.x2 + lineLength, line10.y2);
            const line12 = new Line(line11.x2, line11.y2, line11.x2, line11.y2 - lineLength);

            return [line01, line02, line03, line04, line05, line06, line07, line08, line09, line10, line11, line12];
        }
    */


}


window.onload = () => {
    setup();
    draw(0);
}

function setup() {
    elCanvas = document.getElementById('canvas');
    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = rectangleSize + 30;
    ORIGIN_Y = 30;

    elLines = document.getElementById("lines");
    elInputIterationNr = document.querySelector("input[name='iteration']");

    document.getElementById("inputs").addEventListener("input", handleInputChanges);

    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
}


function draw(nrOfIterationsToDraw) {

    const firstCross = new Cross(ORIGIN_X, ORIGIN_Y, rectangleSize, 0);
    /**
     *
     * @type {Cross[]}
     */
    let listOfCrosses = [firstCross];
    let currentIteration = 1;

    drawCrosses(listOfCrosses, elLines);
    if (nrOfIterationsToDraw < 1) {
        return;
    }

    for (currentIteration = 0; currentIteration < nrOfIterationsToDraw; currentIteration++) {
        /**
         * @type {Cross[]}
         */
        const newListOfItems = [];
        listOfCrosses.forEach(cross => {

            if (cross.nrOfReductions === 0) {
                newListOfItems.push(...createNewCrosses(cross));
            }
            cross.reduce();

            if (cross.nrOfReductions === 2) { // if reduction is in second phase , then a new cross was created. the empty parts must be filled with crosses again
                const w = cross.w / 3;
                const dist = cross.w;
                const x = cross.x - dist + w;
                const y = cross.y;
                newListOfItems.push(new Cross(x , y, w, currentIteration)); // top-left
                newListOfItems.push(new Cross(x + 2 * dist, y, w, currentIteration)); //top-right
                newListOfItems.push(new Cross(x, y + 2 * dist, w, currentIteration)); // bottom-left
                newListOfItems.push(new Cross(x + 2 * dist, y + 2 * dist, w, currentIteration)); // bottom-right

                cross.nrOfReductions = 0;
            }

        });
        listOfCrosses.push(...newListOfItems);
    }
    updateParameterInfoOnScreen();
    drawCrosses(listOfCrosses, elLines);
}

/**
 *
 * @param cross {Cross}
 * @returns {Cross[] | undefined}
 */
function createNewCrosses(cross) {

    /**
     *
     * @type {Cross[]}
     */
    const list = []
    const it = cross.iterationNr + 1;
    const w = cross.w / 3;

    list.push(new Cross(cross.rectangles[0].x1 + w, cross.rectangles[0].y1, w, it));
    list.push(new Cross(cross.rectangles[1].x1 + w, cross.rectangles[1].y1, w, it));
    list.push(new Cross(cross.rectangles[2].x1 + w, cross.rectangles[2].y1, w, it));
    list.push(new Cross(cross.rectangles[3].x1 + w, cross.rectangles[3].y1, w, it));
    return list;
}

function handleInputChanges(event) {
    getParameterValueFromInputs();
    updateParameterInfoOnScreen();
    draw(nrOfIterationsRequested);
}

/**
 *
 * @param crosses {Cross[]}
 * @param element {SVGElement}
 */
function drawCrosses(crosses, element) {
    elLines.innerHTML = '';
    crosses.forEach(cross => cross.draw(element));
}


function updateParameterInfoOnScreen() {
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
    if (nrOfIterationsRequested > 10) {
        nrOfIterationsRequested = 10;
    }

}

