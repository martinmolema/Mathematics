import {SVGSupport} from "./SVGSupport.js";
import {BallTracker} from "./BallTracker.js";

export class BallTrackerList {
    balls = [];
    angleOffset = 0;
    travellingCircle = undefined;
    connectorLines = undefined;
    /* SVGInfo */
    svgInfo;
    /* String */
    cssColor

    constructor(/* Number */ angleOffset, /* SVGInfo */ svgInfo, /* String */ cssColor) {
        this.angleOffset = angleOffset;
        this.svgInfo = svgInfo;
        this.cssColor = cssColor;
        this.shape = new SVGSupport(this.svgInfo.svgGroupCollections).createPolygon("shape ", cssColor);

        this.travellingCircle = new SVGSupport(this.svgInfo.svgGroupOuterballs).drawSVGCircle(0, 0, 8, "ball outer", cssColor);
    }

    initSecondStage() {
    }


    clear() {
        this.balls.length = 0;
    }

    addNewBall(/* Number */ angle, cssColor) {
        const ball = new BallTracker(angle, this.svgInfo, cssColor);
        this.balls.push(ball);
    }

    updateAngle(/*Number*/ angle, /* GUIOptions */ guiOptions) {
        if (guiOptions.showOuterballs) {
            const angleInRadians = (Math.PI / 180) * angle;
            const cx = this.svgInfo.svgCX + (Math.cos(angleInRadians) * this.svgInfo.r);
            const cy = this.svgInfo.svgCY - (Math.sin(angleInRadians) * this.svgInfo.r);

            this.travellingCircle.setAttribute("cx", cx);
            this.travellingCircle.setAttribute("cy", cy);
            this.travellingCircle.classList.remove("hidden");
        } else {
            this.travellingCircle.classList.add("hidden");
        }

        let startOpacity = guiOptions.ballOpacity;
        const remainingOpacity = 5;
        const step = (startOpacity - remainingOpacity) / this.balls.length;

        for(const ball of this.balls) {
            ball.updateBallPosition(angle, guiOptions.showBalls, guiOptions.ballSize);
            if (guiOptions.fadeOpacity) {
                startOpacity -= step;
            }
            ball.setBallOpacity(startOpacity);
        }

        // update the shape
        let points = "";
        if (guiOptions.showLines || guiOptions.fillShapes) {
            for (const ball of this.balls) {
                points += `${ball.cx},${ball.cy} `;
            }
        }
        if (guiOptions.showLines) {
            this.shape.classList.add("showShapeLines");
        }
        else{
            this.shape.classList.remove("showShapeLines");
        }
        if (guiOptions.fillShapes){
            this.shape.classList.add("fillShapes");
        } else {
            this.shape.classList.remove("fillShapes");
        }
        this.shape.setAttribute("points", points);
        this.shape.setAttribute("fill-opacity", `${guiOptions.fillOpacity}%`);
        this.shape.setAttribute("stroke-opacity", `${guiOptions.fillOpacity}%`);
        this.shape.setAttribute("stroke-width", `${guiOptions.shapeLineWidth}`);
    }
}