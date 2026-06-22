import {SVGSupport} from "./SVGSupport.js";

export class BallTracker {
    id = 0;
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
    cx = 0;
    cy = 0;

    speedbar = undefined;

    /**
     *
     * @param angleInDegrees angleInDegrees in degrees (0 - 360) . will internally be converted to radians
     * @param svgInfo
     * @param extraClass
     * @param id
     */
    constructor(/* Number */ angleInDegrees, /* SVGInfo */ svgInfo, extraClass, /*number*/ id) {
        // 2π rad = 360° ; Math.cos & Math.sin need radians
        this.id =id;
        this.angleInDegrees = angleInDegrees;
        this.angleInRadians = (Math.PI / 180) * angleInDegrees;
        this.svgInfo = svgInfo;
        this.svgSupport = new SVGSupport(svgInfo.svgGroupCollections);
        this.createCircle(extraClass);
    }

    setSpeedBar(/* HTMLProgressElement */ speedbar) {
        this.speedbar = speedbar;
    }

    createCircle(extraClass) {
        this.circle = this.svgSupport.drawSVGCircle(0, 0, 5, "ball inside", extraClass);
    }

    updateBallPosition(/* Number */ angleInDegrees,
                       /* Boolean */ showBalls,
                       /* Number */ ballSize,
                       ) {
        const radDeg = (Math.PI / 180);
        const angleInRadians = (this.angleInDegrees - angleInDegrees) * radDeg;

        const pos = Math.cos(angleInRadians); // this is the position on the line regardless of the rotated angle. (e.g. the x-axis)

        const x = Math.cos(this.angleInRadians);
        const y = Math.sin(this.angleInRadians);

        this.cx = this.svgInfo.svgCX + x  * this.svgInfo.r * pos;
        this.cy = this.svgInfo.svgCY - y  * this.svgInfo.r * pos;
        const speed = Math.sqrt(1 - (pos * pos));
        this.speedbar.value = speed * 100;


        if (showBalls) {
            this.circle.setAttribute("cx", this.cx);
            this.circle.setAttribute("cy", this.cy);
            this.circle.setAttribute("r", ballSize);
            this.circle.classList.remove("hidden");
        }
        else {
            this.circle.classList.add("hidden");
        }
    }

    setBallOpacity(opacityInPercent) {
        this.circle.setAttribute("fill-opacity", `${opacityInPercent}%`);
        this.circle.setAttribute("stroke-opacity", `${opacityInPercent}%`);

    }
}