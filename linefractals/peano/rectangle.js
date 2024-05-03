import {Point} from "./point.js";

export class Rectangle {
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
     * FIXME: cells 1 3 5 and 7 are not used!
     * @returns {Rectangle[]}
     */
    createSquares() {
        const newWidth = this.w / 3;
        return [
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
    }

}