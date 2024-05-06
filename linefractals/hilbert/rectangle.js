import {Point} from "./point.js";

export const SVG_NS = "http://www.w3.org/2000/svg";

export class Rectangle {
    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    w;
    /** @type {number} */
    h;
    /** @type {number} */
    x2;
    /** @type {number} */
    y2;
    /** @type {"A"| "B" |  "C" | "D" } */
    typeIndicator;
    /** @type {Point} */
    startPoint;
    /** @type {Point} */
    endPoint;
    /** @type {Point[]} */
    points;
    /** @type {number} */
    iterationNr;

    /**
     * Creates a rectangle; because the width and height are equal, only one is supplied.
     * @param x  {number}
     * @param y {number}
     * @param w {number}
     * @param typeIndicator {"A"| "B" |  "C" | "D" }
     * @param iterationNr {number}
     */
    constructor(x, y, w, typeIndicator, iterationNr) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = w;
        this.x2 = x + w;
        this.y2 = y + w;
        this.typeIndicator = typeIndicator;
        this.iterationNr = iterationNr;
        this.startPoint = undefined;
        this.endPoint = undefined;
        this.points = [];
    }

    center() {
        return new Point(this.x + this.w / 2, this.y + this.h / 2);
    }

    /**
     * Creates a list of 9 rectangles evenly dividing the given rectangle in 3 columns by 3 rows
     * The order is:
     * 0 1
     * 2 3
     * @returns {Rectangle[]}
     */
    createSquaresForDrawing() {
        const newWidth = this.w / 2;
        return [
            new Rectangle(this.x, this.y, newWidth, "", -1),
            new Rectangle(this.x + newWidth, this.y, newWidth, ""-1),
            new Rectangle(this.x, this.y + newWidth, newWidth, ""-1),
            new Rectangle(this.x + newWidth, this.y + newWidth, newWidth, "",-1),
        ];
    }

    /**
     * See https://en.wikipedia.org/wiki/Hilbert_curve#/media/File:Hilbert_curve_production_rules!.svg
     * @return {Rectangle[]}
     */
    createSubSquaresForNextIteration(iterationNr) {
        const newWidth = this.w / 2;
        switch (this.typeIndicator) {
            case "A":
                return [
                    new Rectangle(this.x, this.y + newWidth, newWidth, "D", iterationNr),
                    new Rectangle(this.x, this.y, newWidth, "A", iterationNr),
                    new Rectangle(this.x + newWidth, this.y, newWidth, "A", iterationNr),
                    new Rectangle(this.x + newWidth, this.y + newWidth, newWidth, "B", iterationNr),
                ];
            case "B":
                return [
                    new Rectangle(this.x + newWidth, this.y, newWidth, "C", iterationNr),
                    new Rectangle(this.x, this.y, newWidth, "B", iterationNr),
                    new Rectangle(this.x, this.y + newWidth, newWidth, "B", iterationNr),
                    new Rectangle(this.x + newWidth, this.y + newWidth, newWidth, "A", iterationNr),
                ];
            case "C":
                return [
                    new Rectangle(this.x + newWidth, this.y, newWidth, "B", iterationNr),
                    new Rectangle(this.x + newWidth, this.y + newWidth, newWidth, "C", iterationNr),
                    new Rectangle(this.x, this.y + newWidth, newWidth, "C", iterationNr),
                    new Rectangle(this.x, this.y, newWidth, "D", iterationNr),
                ];
            case "D":
                return [
                    new Rectangle(this.x, this.y + newWidth, newWidth, "A", iterationNr),
                    new Rectangle(this.x + newWidth, this.y + newWidth, newWidth, "D", iterationNr),
                    new Rectangle(this.x+newWidth, this.y, newWidth, "D", iterationNr),
                    new Rectangle(this.x, this.y, newWidth, "C", iterationNr),
                ];
        }
    }

    /**
     * See https://en.wikipedia.org/wiki/Hilbert_curve#/media/File:Hilbert_curve_production_rules!.svg
     * @param elParent {SVGElement}
     * @param useColoring {boolean}
     */
    draw(elParent, useColoring) {
        this.determinePointsOfShape();

        const polyline = document.createElementNS(SVG_NS, "polyline");
        const strPoints = this.points.map(p => `${p.x},${p.y}`).join(' ');
        polyline.setAttribute('points', strPoints);
        polyline.classList.add("shape");
        if (useColoring) {
            polyline.classList.add(`type-${this.typeIndicator}`);
        }
        polyline.classList.add(`iteration-${this.iterationNr}`);
        elParent.appendChild(polyline);

    }

    determinePointsOfShape() {
        const squares = this.createSquaresForDrawing();

        const points = [];
        switch (this.typeIndicator) {
            case "A":
                points.push(squares[2].center());
                points.push(squares[0].center());
                points.push(squares[1].center());
                points.push(squares[3].center());
                break;
            case "B":
                points.push(squares[1].center());
                points.push(squares[0].center());
                points.push(squares[2].center());
                points.push(squares[3].center());
                break;
            case "C":
                points.push(squares[1].center());
                points.push(squares[3].center());
                points.push(squares[2].center());
                points.push(squares[0].center());
                break;
            case "D":
                points.push(squares[2].center());
                points.push(squares[3].center());
                points.push(squares[1].center());
                points.push(squares[0].center());
                break;
        }
        this.startPoint = points[0];
        this.endPoint = points[3];
        this.points.push(...points);

    }

}

