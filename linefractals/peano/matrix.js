import {Rectangle} from "./rectangle.js";
import {Cell} from "./cell.js";

export class Matrix {
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
    getPosition(row, col) {
        return new Cell(row, col);
    }

    lastRowNumber() {
        return this.rows - 1;
    }

    firstColumnNumber() {
        return 0;
    }

    CellAtPosition(cell) {
        return this.rectangles[cell.row][cell.col];
    }
}