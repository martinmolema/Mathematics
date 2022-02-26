import {ColorPaletteList} from "./ColorPaletteList.js";

export const BALL_COLOR_TYPE_FIXED = 'FIXED';
export const BALL_COLOR_TYPE_FOLLOW_SHAPE = 'SHAPE';
export const BALL_COLOR_TYPE_PALETTE = 'PALETTE';

export class GUIOptions {
    distanceType = "";
    distanceInDegrees = -1;
    nrOfCollections = 1;
    svgSupportForCollections = undefined;
    nrOfBallsPerCollection = 0;
    showLines = false;
    showOuterballs = true;
    showBackgroundLines = true;
    svgBackgroundCircle = undefined;
    fillShapes = false;
    fillOpacity = 50;
    collectionPalette = undefined; // the current palette chosen for the collection
    ballPalette = undefined; // the current palette chosen chosen if a palette is chosen per ball

    showBalls = false;
    refreshSpeed = 0;
    animationDirection = "";
    ballSize = 5;
    fadeOpacity = false;
    shapeLineWidth = 1;
    selectedSingleHSLColor = "";

    ballColorType = "";

    constructor() {
        this.collectionPalette = new ColorPaletteList(1);
        this.ballPalette       = new ColorPaletteList(1);
    }

    updatePaletteForCollections(nrOfCollections) {
        this.collectionPalette.setupPalettes(nrOfCollections);
    }

    updatePaletteForBalls(nrOfBalls) {
        this.ballPalette.setupPalettes(nrOfBalls);
    }

    paletteListForBalls() {
        return this.ballPalette;
    }

    paletteListForCollections() {
        return this.collectionPalette;
    }

    ballColorTypeIsPalette()      { return this.ballColorType === BALL_COLOR_TYPE_PALETTE; }
    ballColorTypeIsFixed()        { return this.ballColorType === BALL_COLOR_TYPE_FIXED; }
    ballColorTypeIsFollowShape()  { return this.ballColorType === BALL_COLOR_TYPE_FOLLOW_SHAPE; }


}