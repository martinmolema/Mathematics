import {BallTrackerList} from "./BallTrackerList.js";

export class BallTrackerListCollection {
    collections = [];
    /* SVGInfo */ svgInfo = undefined;

    constructor(/* SVGInfo */ svgInfo) {
        this.svgInfo = svgInfo;
    }

    newList(/* Number */ angleOffset, /* String */ cssColor) {
        const list = new BallTrackerList(angleOffset, this.svgInfo, cssColor);
        this.collections.push(list);
        return list;
    }

    clear() {
        for(const c of this.collections) {
            c.clear();
        }
        this.collections.length = 0;
    }
}