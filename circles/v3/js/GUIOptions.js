import {ColorPaletteList} from "./ColorPaletteList.js";

export const BALL_COLOR_TYPE_FIXED = 'FIXED';
export const BALL_COLOR_TYPE_FOLLOW_SHAPE = 'SHAPE';
export const BALL_COLOR_TYPE_PALETTE = 'PALETTE';

export class GUIOptions {
    distanceType = "";
    distanceInDegrees = -1;
    nrOfCollections = 1;
    nrOfBallsPerCollection = 0;
    ballOpacity = 1;
    showLines = false;
    showOuterballs = true;
    showBackgroundLines = true;
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

    /**
     * Creates an object that can be serialised/saved using e.g. JSON.stringify
     */
    saveableObject(){
        return {
            distanceType: this.distanceType,
            distanceInDegrees: this.distanceInDegrees,
            nrOfCollections: this.nrOfCollections,
            ballOpacity: this.ballOpacity,
            nrOfBallsPerCollection: this.nrOfBallsPerCollection,
            showLines: this.showLines,
            showOuterballs: this.showOuterballs,
            showBackgroundLines: this.showBackgroundLines,
            fillShapes: this.fillShapes,
            fillOpacity: this.fillOpacity,
            showBalls: this.showBalls,
            refreshSpeed: this.refreshSpeed,
            animationDirection: this.animationDirection,
            ballSize: this.ballSize,
            fadeOpacity: this.fadeOpacity,
            shapeLineWidth: this.shapeLineWidth,
            selectedSingleHSLColor: this.selectedSingleHSLColor,
            ballColorType: this.ballColorType,
            selectedPaletteForBalls: this.paletteListForBalls().selectedPaletteNr,
            selectedPaletteForShapes: this.paletteListForCollections().selectedPaletteNr,
        }
    }

    json() {
        const obj = this.saveableObject();
        return JSON.stringify(obj);
    }

    updateFromJSON(/* string */ json) {
        const obj = JSON.parse(json);
        this.updateFromRestoredObject(obj);
    }

    updateFromRestoredObject(obj){
        this.distanceType = obj.distanceType;
        this.distanceInDegrees = obj.distanceInDegrees;
        this.nrOfCollections = obj.nrOfCollections;
        this.ballOpacity =obj.ballOpacity;
        this.nrOfBallsPerCollection = obj.nrOfBallsPerCollection;
        this.showLines = obj.showLines;
        this.showOuterballs = obj.showOuterballs;
        this.showBackgroundLines = obj.showBackgroundLines;
        this.fillShapes = obj.fillShapes;
        this.fillOpacity = obj.fillOpacity;
        this.showBalls = obj.showBalls;
        this.refreshSpeed = obj.refreshSpeed;
        this.animationDirection = obj.animationDirection;
        this.ballSize = obj.ballSize;
        this.fadeOpacity = obj.fadeOpacity;
        this.shapeLineWidth = obj.shapeLineWidth;
        this.selectedSingleHSLColor = obj.selectedSingleHSLColor;
        this.ballColorType = obj.ballColorType;

        this.updatePaletteForCollections(this.nrOfCollections);
        this.updatePaletteForBalls(this.nrOfBallsPerCollection);

        this.paletteListForBalls().selectPalette(obj.selectedPaletteForBalls);
        this.paletteListForCollections().selectPalette(obj.selectedPaletteForShapes);
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