import {VirtualLine} from "./VirtualLine.js";
import {SVGInfo} from "./SVGInfo.js";
import {BallTrackerListCollection} from "./BallTrackerListCollection.js";

export class Runner {
    svgInfo = undefined;

    /* BallTrackerListCollection */
    collection = undefined;
    /* VirtualLine */
    backgroundLines = [];

    constructor() {
        this.svgInfo = new SVGInfo(800, 800,
            document.getElementById("svgContainer"),
            document.getElementById("virtuallines"),
            document.getElementById("collections"),
            document.getElementById("outerballs"),
        );

        this.collection = new BallTrackerListCollection(this.svgInfo);

        let nrOfLines = 60;
        for (let angle = 0; angle < 180; angle += 180 / nrOfLines) {
            this.backgroundLines.push(new VirtualLine(angle, this.svgInfo));
        }
        const extraClassNames = [
            "blue",
            "orange",
            "red",
            "yellow",
            "grey",
            "purple"
        ];
        const nrOfCollections = extraClassNames.length;
        const distanceInDegrees = 360 / nrOfCollections;
        for (let c = 0; c < nrOfCollections; c++) {
            const coll = this.collection.newList(c * distanceInDegrees, extraClassNames[c]);
            for (let angle = 0; angle < 180; angle += 180 / nrOfLines) {
                coll.add(angle);
            }
        }
        this.drawVirtualLines();
    }

    drawVirtualLines() {
        for (let vl of this.backgroundLines) {
            vl.drawLine();
        }
    }

    run() {
        /* Number */
        let angle = 0;
        const intervalRef = window.setInterval(() => {
            for (let collection of this.collection.collections) {
                const cAngle = (angle + collection.angleOffset) % 360;
                for (let ball of collection.balls) {
                    ball.update(cAngle);
                }
                collection.updateAngle(cAngle);
            }
            angle++;
            angle = angle % 360;
        }, 50);
    }
}

window.onload = () => {
    const runner = new Runner();
    runner.run();
}
