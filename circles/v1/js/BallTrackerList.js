import {SVGSupport} from "./SVGSupport.js";
import {BallTracker} from "./BallTracker.js";

export class BallTrackerList {
    balls = [];
    angleOffset = 0;
    travellingCircle = undefined;
    /* SVGInfo */ svgInfo;
    /* String */ extraClass

    constructor(/* Number */ angleOffset, /* SVGInfo */ svgInfo, /* String */ extraClass) {
        this.angleOffset = angleOffset;
        this.svgInfo     = svgInfo;
        this.extraClass  = extraClass;
        this.travellingCircle = new SVGSupport(this.svgInfo.svgGroupOuterballs).drawSVGCircle(0, 0, 8, "ball outer " + extraClass);
    }

    add(/* Number */ angle) {
        const ball = new BallTracker(angle, this.svgInfo, this.extraClass );
        this.balls.push(ball);
    }

    updateAngle(/*Number*/ angle) {
        const angleInRadians = (Math.PI / 180) * angle;

        const cx = this.svgInfo.svgCX + (Math.cos(angleInRadians) * this.svgInfo.r);
        const cy = this.svgInfo.svgCY - (Math.sin(angleInRadians) * this.svgInfo.r);

        this.travellingCircle.setAttribute("cx", cx);
        this.travellingCircle.setAttribute("cy", cy);
    }
}