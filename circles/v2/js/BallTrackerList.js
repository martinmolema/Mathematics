import {SVGSupport} from "./SVGSupport.js";
import {BallTracker} from "./BallTracker.js";

export class BallTrackerList {
    balls = [];
    angleOffset = 0;
    travellingCircle = undefined;
    connectorLines = undefined;
    /* SVGInfo */ svgInfo;
    /* String */ cssColor

    constructor(/* Number */ angleOffset, /* SVGInfo */ svgInfo, /* String */ cssColor) {
        this.angleOffset = angleOffset;
        this.svgInfo     = svgInfo;
        this.cssColor    = cssColor;
        this.travellingCircle = new SVGSupport(this.svgInfo.svgGroupOuterballs).drawSVGCircle(0, 0, 8, "ball outer", cssColor);
        this.connectorLines   = new SVGSupport(this.svgInfo.svgGroupCollections).createPolygon("connectorlines " , cssColor);
    }

    clear() {
        this.balls.length = 0;
    }

    add(/* Number */ angle) {
        const ball = new BallTracker(angle, this.svgInfo, this.cssColor );
        this.balls.push(ball);
    }

    updateAngle(/*Number*/ angle,
                /* boolean */ showBalls,
                /* number */ ballOpacity,
                /* boolean */ fadeBallOpacity,
                /* number */ ballSize,
                /* boolean */ showLines,
                /* boolean */ showOuterballs,
                /* boolean */ fillShapes,
                /* Number*/ fillOpacity) {
        if (showOuterballs){
            const angleInRadians = (Math.PI / 180) * angle;
            const cx = this.svgInfo.svgCX + (Math.cos(angleInRadians) * this.svgInfo.r);
            const cy = this.svgInfo.svgCY - (Math.sin(angleInRadians) * this.svgInfo.r);

            this.travellingCircle.setAttribute("cx", cx);
            this.travellingCircle.setAttribute("cy", cy);
            this.travellingCircle.classList.remove("hidden");
        }
        else {
            this.travellingCircle.classList.add("hidden");
        }

        let startOpacity = ballOpacity;
        const remainingOpacity = 0;
        const step = (startOpacity - remainingOpacity) / this.balls.length;
        for (let ball of this.balls) {
            if (fadeBallOpacity) {
                startOpacity -= step;
            }
            ball.updateBallPosition(angle, showBalls, startOpacity, ballSize);
        }

        let points = "";
        if (showLines){
            for (const ball of this.balls) {
                points += `${ball.cx},${ball.cy} `;
            }
        }
        if (fillShapes) {
            this.connectorLines.classList.add("fillShapes");
        }
        else {
            this.connectorLines.classList.remove("fillShapes");
        }
        this.connectorLines.setAttribute("points", points);
        this.connectorLines.setAttribute("fill-opacity", `${fillOpacity}%`);
        this.connectorLines.setAttribute("stroke-opacity", `${fillOpacity}%`);
    }
}