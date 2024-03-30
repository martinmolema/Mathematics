import {FractalDrawer, EPSILONSQRD} from "./FractalDrawer.js";

class XY {
    x;
    y;
}

export class BurningShipSmartDrawer extends FractalDrawer {
    constructor(constants, palettes, maxIterations, name) {
        super(constants, palettes, maxIterations, name);
    }

    // http://paulbourke.net/fractals/burnship/burningship.c
    draw() {
        super.draw();
        const pixels = this.constants.pixels;

        let w = this.constants.canvas_dimensions.w;
        let h = this.constants.canvas_dimensions.h;

        let op_x = this.constants.one_pixel_x;
        let op_y = this.constants.one_pixel_y;

        const p0 = new XY();
        const p  = new XY();
        const c = new XY();
        const boundingbox = this.constants.boundingbox.clone();
        const bbCenter = boundingbox.center();
        const bbW = boundingbox.dimensions.w;
        const bbH = boundingbox.dimensions.h;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                p0.x = 0;
                p0.y = 0;

                c.x = boundingbox.x1 + (x / w) * bbW;
                c.y = boundingbox.y1 - (y / h) * bbH ;

                let iterations = 0;
                let needsMoreIterations = false;
                let isNotStable = false;
                let hasConverged = false;

                let pixelpos = x + y * w;

                do {
                    const quadX = p0.x * p0.x;
                    const quadY = p0.y * p0.y;

                    p.x = quadX - quadY - c.x;
                    p.y = 2 * Math.abs(p0.x * p0.y) - c.y;

                    isNotStable = (quadX + quadX) > 14;
                    needsMoreIterations = (++iterations) < this.maxIterations;

                    hasConverged = this.calculateDistanceSquared(p.x, p.y, p0.x, p0.y)  < EPSILONSQRD;

                    p0.x = p.x;
                    p0.y = p.y;

                } while (needsMoreIterations && !isNotStable && !hasConverged) ;

                if (!isNotStable) {
                    iterations = -1;
                }
                pixels[pixelpos] = iterations;
            } // for CY
        }// for CX

        this.redrawUsingPalette();
    }// draw()

}// class MandelbrotAlternateFractalDrawer
