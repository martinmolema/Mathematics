import {SVGSupport} from "./SVGSupport.js";

export class BallTracker {
    /**
     * The angle in degrees
     * @type {number}
     */
    angleInDegrees = 0;
    /**
     * The angle of the line in radians
     * @type {number}
     */
    angleInRadians = 0;

    circle = undefined;
    /* SVGInfo*/
    svgInfo = undefined;
    /* SVGSupport */
    svgSupport = undefined;

    /**
     *
     * @param angleInDegrees angleInDegrees in degrees (0 - 360) . will internally be converted to radians
     * @param svgInfo
     */
    constructor(/* Number */ angleInDegrees, /* SVGInfo */ svgInfo, extraClass) {
        // 2π rad = 360° ; Math.cos & Math.sin need radians
        this.angleInDegrees = angleInDegrees;
        this.angleInRadians = (Math.PI / 180) * angleInDegrees;
        this.svgInfo = svgInfo;
        this.svgSupport = new SVGSupport(svgInfo.svgGroupCollections);
        this.createCircle(extraClass);
    }

    createCircle(extraClass) {
        this.circle = this.svgSupport.drawSVGCircle(0, 0, 5, "ball " + extraClass);
    }

    update(/* Number */ angleInDegrees) {
        const radDeg = (Math.PI / 180);
        const angleInRadians = (this.angleInDegrees - angleInDegrees) * radDeg;

        const pos = Math.cos(angleInRadians); // this is the position on the line regardless of the rotated angle. (e.g. the x-axis)

        let cx = this.svgInfo.svgCX + (Math.cos(this.angleInRadians))  * this.svgInfo.r * pos;
        let cy = this.svgInfo.svgCY - (Math.sin(this.angleInRadians))  * this.svgInfo.r * pos;

        this.circle.setAttribute("cx", cx);
        this.circle.setAttribute("cy", cy);
    }
}