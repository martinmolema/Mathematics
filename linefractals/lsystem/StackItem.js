import {Point} from "./Point.js";

export class StackItem {
    angle;
    position;

    /**
     *
     * @param angle {number} in degrees
     * @param position {Point}
     */
    constructor(angle, position) {
        this.angle = angle;
        this.position = new Point(position.x, position.y);
    }
}
