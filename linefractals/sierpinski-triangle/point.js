export class Point {
    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    iterationNr;

    /**
     *
     * @param x {number}
     * @param y {number}
     * @param iterationNr {number}
     */
    constructor(x, y, iterationNr) {
        this.x = x;
        this.y = y;
        this.iterationNr = iterationNr;
    }
}