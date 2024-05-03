/**
 * A class to represent a position with the class Matrix
 */
export class Cell {
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