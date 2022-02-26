import {SVGSupport} from "./SVGSupport.js";

export class VirtualLine {
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

    /* SVGInfo*/
    svgInfo = undefined;
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    /* SVGSupport */
    svgSupport = undefined;
    /**
     *
     * @param angleInDegrees angleInDegrees in degrees (0 - 360) . will internally be converted to radians
     * @param svgInfo
     */
    constructor(/* Number */ angleInDegrees, /* SVGInfo */ svgInfo) {
        // 2π rad = 360° ; Math.cos & Math.sin need radians
        this.angleInDegrees = angleInDegrees;
        this.angleInRadians = (Math.PI / 180) * angleInDegrees;
        this.svgInfo = svgInfo;
        this.svgSupport = new SVGSupport(svgInfo.svgGroupVirtualLines)

        this.x1 = this.svgInfo.svgCX + Math.cos(this.angleInRadians) * (this.svgInfo.r);
        this.x2 = this.svgInfo.svgCX + Math.cos(this.angleInRadians + Math.PI) * (this.svgInfo.r);
        this.y1 = this.svgInfo.svgCY + Math.sin(this.angleInRadians) * (this.svgInfo.r);
        this.y2 = this.svgInfo.svgCY + Math.sin(this.angleInRadians + Math.PI) * (this.svgInfo.r);
    }

    /**
     * Will draw line on the svg parent for virtual lines
     */
    drawLine() {
        this.svgSupport.drawSVGLine(this.x1, this.y1, this.x2, this.y2, "virtualline");
    }
}