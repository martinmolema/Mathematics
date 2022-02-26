import {BallTrackerList} from "./BallTrackerList.js";

export class BallTrackerListCollection {
    collections = [];
    /* SVGInfo */ svgInfo = undefined;

    constructor(/* SVGInfo */ svgInfo) {
        this.svgInfo = svgInfo;
    }

    newList(/* Number */ angleOffset, /* String */ extraClass) {
        const list = new BallTrackerList(angleOffset, this.svgInfo, extraClass);
        this.collections.push(list);
        return list;
    }
}