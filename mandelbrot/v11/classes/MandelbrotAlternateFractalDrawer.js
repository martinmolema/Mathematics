import {FractalDrawer, EPSILONSQRD} from "./FractalDrawer.js";

export class MandelbrotAlternateFractalDrawer extends FractalDrawer {
    constructor(constants, palettes, maxIterations, name) {
        super(constants, palettes, maxIterations, name);
    }

    draw() {
        super.draw();
        const pixels = this.constants.pixels;
        let maxPixelValue = -Infinity;
        let minPixelValue = +Infinity;

        let w = this.constants.canvas_dimensions.w;
        let h = this.constants.canvas_dimensions.h;

        let op_x = this.constants.one_pixel_x;
        let op_y = this.constants.one_pixel_y;

        let x1 = this.constants.boundingbox.x1;
        let y1 = this.constants.boundingbox.y1;

        let cx = x1;

        for (let x = 0; x < w; x++) {
            let cy = y1;
            for (let y = 0; y < h; y++) {
                let qx = cx * cx;
                let qy = cy * cy;

                // simplification of (x1-x2)^2 + (y1-y2)^2 < 2^2
                // x1 = cx, y1 = cy, x2 = 0, y2 = 0; we compare the distance to the central point (0,0) to (zx,zy)
                if (qx + qy < 4) {
                    let startx = 0;
                    let starty = 0;
                    let prevx = 0;
                    let prevy = 0;

                    let iterations = 0;
                    let needsMoreIterations = false;
                    let isStable = false;
                    let hasConverged = false;

                    let pixelpos = y * w + x;
                    let distance = 0;


                    do {
                        // first square (startx, starty)
                        let xy = this.multiply(startx, starty, startx, starty);
                        startx = xy.newx;
                        starty = xy.newy;

                        // add constant
                        startx += cx;
                        starty += cy;
                        distance = this.calculateDistanceSquared(0, 0, startx, starty);
                        hasConverged = this.calculateDistanceSquared(startx, starty, prevx, prevy) < (EPSILONSQRD);
                        isStable = distance < (2 * 2);
                        needsMoreIterations = (++iterations) < this.maxIterations;

                        prevx = startx;
                        prevy = starty;

                    } while (needsMoreIterations && isStable && !hasConverged) ;

                    if (isStable) {
                        pixels[pixelpos] = -1;
                    } else {
                        if (this.constants.useSmoothColoringAlgorithm !== '') {
                            switch (this.constants.useSmoothColoringAlgorithm) {
                                case '_':
                                    pixels[pixelpos] = iterations;
                                    break;
                                case 'A':
                                    pixels[pixelpos] = Math.log(iterations) + 1 - Math.log(Math.log(distance))
                                    break;
                                case 'B':
                                    pixels[pixelpos] = Math.log(iterations) + Math.sqrt(Math.sqrt(distance))
                                    break;
                                case 'C':
                                    pixels[pixelpos] = Math.pow(Math.pow(iterations / this.maxIterations, 2) * this.maxIterations, 1.5) % this.maxIterations;
                                    break;
                                case 'D':
                                    pixels[pixelpos] = Math.pow(Math.pow(iterations / this.maxIterations, .5) * this.maxIterations, 1.5) % this.maxIterations;
                                    break;
                                case 'E':
                                    pixels[pixelpos] = Math.pow(Math.pow(iterations / this.maxIterations, 4) * this.maxIterations, 1.5) % this.maxIterations;
                                    break;
                                case 'F':
                                    pixels[pixelpos] = Math.pow(Math.pow(iterations / this.maxIterations, 0.25) * this.maxIterations, 1.5) % this.maxIterations;
                                    break;
                            }
                            //pixels[pixelpos] = Math.sqrt(distance) ;
                            maxPixelValue = Math.max(pixels[pixelpos], maxPixelValue);
                            minPixelValue = Math.min(pixels[pixelpos], minPixelValue);

                        }
                    }
                } // if distance OK

                cy -= op_y;
            } // for CY
            cx += op_x;
        }// for CX
        if (this.constants.useSmoothColoringAlgorithm !== '_') {
            // remap the found values to match the nr of iterations so the array is filled with values matching 0 to maxIterations
            const factor = this.maxIterations / (maxPixelValue - minPixelValue);
            pixels.forEach((value, index, array) => {
                if (value !== -1) {
                    array[index] = Math.trunc(value * factor);
                }
            });

        }
        this.redrawUsingPalette();
    }// draw()

}// class MandelbrotAlternateFractalDrawer
