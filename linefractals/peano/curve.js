
// direction we're going to draw
export const DIRECTION_UP = "U";
export const DIRECTION_DOWN = "D";

// Variant: start left then go right, or start right and then go left
export const VARIANT_DRAW_LEFT = "L";
export const VARIANT_DRAW_RIGHT = "R";


export class Curve {
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
                            cells[6].center(), cells[0].center(),
                            cells[1].center(), cells[7].center(),
                            cells[8].center(), cells[2].center(),
                        ];
                        break;
                    case DIRECTION_DOWN:
                        this.points = [
                            cells[0].center(), cells[6].center(),
                            cells[7].center(), cells[1].center(),
                            cells[2].center(), cells[8].center(),
                        ];
                        break;
                }
                break;
            case VARIANT_DRAW_LEFT:
                switch (this.direction) {
                    case DIRECTION_UP:
                        this.points = [
                            cells[8].center(), cells[2].center(),
                            cells[1].center(), cells[7].center(),
                            cells[6].center(), cells[0].center(),
                        ];

                        break;
                    case DIRECTION_DOWN:
                        this.points = [
                            cells[2].center(), cells[8].center(),
                            cells[7].center(), cells[1].center(),
                            cells[0].center(), cells[6].center(),
                        ];
                        break;
                }
                break;

        }
        this.cells = cells;
    }

}