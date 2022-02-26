import {VirtualLine} from "./VirtualLine.js";
import {SVGInfo} from "./SVGInfo.js";
import {BallTrackerListCollection} from "./BallTrackerListCollection.js";
import {GUIOptions} from "./GUIOptions.js";

export class Runner {
    svgInfo = undefined;

    /* BallTrackerListCollection */
    collection = undefined;
    /* VirtualLine */
    backgroundLines = [];

    options= undefined;

    constructor() {
        this.svgInfo = new SVGInfo(800, 800,
            document.getElementById("svgContainer"),
            document.getElementById("virtuallines"),
            document.getElementById("collections"),
            document.getElementById("outerballs"),
        );

        // Create a list of default options and two default palettelists.
        this.options = new GUIOptions();

        // find HTML elements and connect handlers
        this.setupHTMLElementReferences();
        this.setupEventHandlers();

        // fill the list of palettes (because now we know which HTML-element to fill
        this.addPalettesToGUIElement();

        // now setup all options from the GUI
        this.initValuesFromControls();

        // now that the options are set, we can setup the palettes according to the number of corners and collections
        this.options.updatePaletteForCollections(this.options.nrOfCollections);
        this.options.updatePaletteForBalls(this.options.nrOfBallsPerCollection);
        this.showPaletteList();

        this.collection = new BallTrackerListCollection(this.svgInfo);
        this.syncControls();
        this.init();
    }

    addPalettesToGUIElement() {
        const pal = this.options.paletteListForCollections();
        const nrOfNamesInPalette = pal.getNumberOfItemsInList();
        for(let i=0;i<nrOfNamesInPalette; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.innerText = pal.getPaletteName(i);
            this.elPaletteSelect.appendChild(option);
        }
    }

    setupHTMLElementReferences() {
        this.svgBackgroundCircle     = document.getElementById("backgroundCircle");

        this.elNrOfCollections        = document.querySelector("input[name='nrOfCollections']");
        this.elDistanceType           = document.querySelector("select[name='distanceType']");
        this.elDistanceValue          = document.querySelector("input[name='distanceValue']");
        this.elnrOfBalls              = document.querySelector("input[name='nrOfBalls']");
        this.elShowLines              = document.querySelector("input[name='showLines']");
        this.elshowOuterballs         = document.querySelector("input[name='showOuterballs']");
        this.elShowBackgroundLines    = document.querySelector("input[name='showBackgroundLines']");
        this.elFillShapes             = document.querySelector("input[name='fillShapes']");
        this.elFillOpacity            = document.querySelector("input[name='fillOpacity']");
        this.elPaletteSelect          = document.querySelector("select[name='palette']");
        this.elShowBalls              = document.querySelector("input[name='showBalls']");
        this.elRefreshSpeed           = document.querySelector("input[name='refreshSpeed']");
        this.elAnimationDirection     = document.querySelector("select[name='animationDirection']");
        this.elBallOpacity            = document.querySelector("input[name='ballOpacity']");
        this.elBallSize               = document.querySelector("input[name='ballSize']");
        this.elfadeOpacity            = document.querySelector("input[name='fadeOpacity']");
        this.elUsePaletForCorners     = document.querySelector("input[name='usePaletForCorners']");

        this.elRefreshSpeedValue      = document.getElementById("refreshSpeedValue");
        this.elPalettelistBalls       = document.getElementById("palettelistBalls");
        this.elPalettelistCollections = document.getElementById("palettelistCollections");
        this.elnrOfCollectionsValue   = document.getElementById("nrOfCollectionsValue");
        this.elnrOfBallsValue         = document.getElementById("nrOfBallsValue");
        this.elballPalletContainer    = document.getElementById("ballPalletContainer");
        this.elShapeLineWidth         = document.getElementById("shapeLineWidth");
    }

    initValuesFromControls() {

        this.options.nrOfCollections        = this.elNrOfCollections.value;
        this.options.distanceType           = this.elDistanceType.value;
        this.options.distanceInDegrees      = this.elDistanceValue.value;
        this.options.nrOfBallsPerCollection = this.elnrOfBalls.value;
        this.options.fillOpacity            = this.elFillOpacity.value;
        this.options.refreshSpeed           = this.elRefreshSpeed.value;
        this.options.animationDirection     = this.elAnimationDirection.value;
        this.options.ballOpacity            = this.elBallOpacity.value;
        this.options.ballSize               = this.elBallSize.value;
        this.options.shapeLineWidth         = this.elShapeLineWidth.value;

        this.options.showBackgroundLines    = this.elShowBackgroundLines.checked;
        this.options.showOuterballs         = this.elshowOuterballs.checked;
        this.options.fillShapes             = this.elFillShapes.checked;
        this.options.showLines              = this.elShowLines.checked;
        this.options.showBalls              = this.elShowBalls.checked;
        this.options.fadeOpacity            = this.elfadeOpacity.checked;
        this.options.usePaletForCorners     = this.elUsePaletForCorners.checked;


        this.selectPalette();

        if (!this.options.showBackgroundLines) {
            this.hideBackgroundCircle();
        }
    }

    selectPalette() {
        const paletteNrSelected = this.elPaletteSelect.value;
        this.options.paletteListForBalls().selectPalette(paletteNrSelected);
        this.options.paletteListForCollections().selectPalette(paletteNrSelected);

        this.showPaletteList();
    }

    showPaletteList() {
        this.showOnePaletteList(this.elPalettelistBalls, this.options.paletteListForBalls());
        this.showOnePaletteList(this.elPalettelistCollections, this.options.paletteListForCollections());
    }

    showOnePaletteList(/* DOMElement */ parent, /* PaletteList */ palette) {
        while (parent.childNodes.length !== 0) {
            parent.firstChild.remove();
        }
        const nrOfItems = palette.nrOfColorsInSelectedPalette();
        for(let i = 0; i < nrOfItems; i++) {
            const el = document.createElement("div");
            el.classList.add("palette");
            el.classList.add("item");
            el.style.backgroundColor = palette.getPaletteColor(i);
            el.innerhtml = '&nbsp;';
            parent.appendChild(el);
        }
    }

    setupEventHandlers() {

        this.elNrOfCollections.addEventListener("change", (evt) => {
            this.options.nrOfCollections = this.elNrOfCollections.value;
            this.options.updatePaletteForCollections(this.options.nrOfCollections);
            this.showPaletteList();
            this.syncControls();
            this.init();
        });
        this.elDistanceValue.addEventListener("change", evt => {
            this.options.distanceInDegrees = evt.currentTarget.value;
            this.syncControls();
            this.init();
        });
        this.elnrOfBalls.addEventListener("change" , evt => {
            this.options.nrOfBallsPerCollection = evt.currentTarget.value;
            this.options.updatePaletteForBalls(this.options.nrOfBallsPerCollection);
            this.showPaletteList();
            this.syncControls();
            this.init();
        });
        this.elShowLines.addEventListener("change", evt => {
            this.options.showLines = evt.currentTarget.checked;
            this.syncControls();
        });
        this.elshowOuterballs.addEventListener("change", evt => {
            this.options.showOuterballs = evt.currentTarget.checked;
            this.syncControls();
        });
        this.elShowBackgroundLines.addEventListener("change" , evt => {
            this.options.showBackgroundLines = evt.currentTarget.checked;
            this.syncControls();
            this.init();
        });
        this.elFillShapes.addEventListener("change", evt => {
            this.options.fillShapes = evt.currentTarget.checked;
            this.syncControls();
        });
        this.elFillOpacity.addEventListener("change", evt => {
            this.options.fillOpacity = evt.currentTarget.value;
            this.syncControls();
        });

        this.elDistanceType.addEventListener("change" , evt => {
            this.options.distanceType = evt.currentTarget.value;
            this.init();
            this.syncControls();
        });

        this.elPaletteSelect.addEventListener("change", evt => {
            this.selectPalette();
            this.init();
            this.syncControls();
        });

        this.elShowBalls.addEventListener("change", evt => {
            this.options.showBalls = evt.currentTarget.checked;
            this.syncControls();
        });

        this.elRefreshSpeed.addEventListener("change", evt => {
            this.options.refreshSpeed = evt.currentTarget.value;
            this.syncControls();
            this.stop();
            this.start();
        });

        this.elAnimationDirection.addEventListener("change", evt => {
            this.options.animationDirection = evt.currentTarget.value;
            this.syncControls();
            this.stop();
            this.start();
        });

        this.elBallOpacity.addEventListener("change", evt => {
            this.options.ballOpacity = evt.currentTarget.value;
            this.syncControls();
        });

        this.elBallSize.addEventListener("change", evt => {
            this.options.ballSize = evt.currentTarget.value;
            this.syncControls();
        });

        this.elfadeOpacity.addEventListener("change", evt => {
           this.options.fadeOpacity = evt.currentTarget.checked;
           this.syncControls();
        });

        this.elUsePaletForCorners.addEventListener("change", evt => {
            this.options.usePaletForCorners = evt.currentTarget.checked;
            this.syncControls();
            this.init();
        });

        this.elShapeLineWidth.addEventListener("change", evt => {
            this.options.shapeLineWidth = evt.currentTarget.value;
            this.syncControls();
        });

    }

    syncControls() {
        switch (this.elDistanceType.value) {
            case "MAN":
                this.elDistanceValue.disabled = false;
                break;
            case "AUTO":
                this.elDistanceValue.disabled = true;
                break;
        }
        // this.elFillShapes.disabled  = !this.elShowLines.checked;
        this.elBallOpacity.disabled = !this.elShowBalls.checked;
        this.elRefreshSpeedValue.innerText = `${this.options.refreshSpeed}ms`;
        this.elnrOfCollectionsValue.innerText = `${this.options.nrOfCollections}`;
        this.elnrOfBallsValue.innerText = `${this.options.nrOfBallsPerCollection}`;
        this.elballPalletContainer.style.visibility = this.options.usePaletForCorners ? "visible" : "hidden";
    }

    clearBackgroundLines() {
        this.backgroundLines.length = 0;

        this.clearOneSVGGroup(this.svgInfo.svgGroupVirtualLines);
    }
    createBackgroundLines() {
        for (let angle = 0; angle < 180; angle += 180 / this.options.nrOfBallsPerCollection) {
            this.backgroundLines.push(new VirtualLine(angle, this.svgInfo));
        }
        this.drawVirtualLines();
    }

    hideBackgroundCircle() {
        this.svgBackgroundCircle.classList.add("hidden");
    }

    showBackgroundCircle() {
        this.svgBackgroundCircle.classList.remove("hidden");
    }

    init(){
        this.svgBackgroundCircle.setAttribute("cx", this.svgInfo.svgCX);
        this.svgBackgroundCircle.setAttribute("cy", this.svgInfo.svgCY);
        this.svgBackgroundCircle.setAttribute("r", this.svgInfo.r);
        this.clearAllBalls();
        this.clearBackgroundLines();
        this.collection.clear();
        if (this.options.showBackgroundLines){
            this.createBackgroundLines();
            this.showBackgroundCircle();
        }
        else {
            this.hideBackgroundCircle();
        }

        let distanceInDegrees = 0;
        switch (this.options.distanceType) {
            case "MAN":
                distanceInDegrees = this.options.distanceInDegrees;
                break;
            case "AUTO":
                distanceInDegrees = 360 / this.options.nrOfCollections;
                break;
        }
        for (let c = 0; c < this.options.nrOfCollections; c++) {
            const collectionColor = this.options.paletteListForCollections().getPaletteColor(c);
            const coll = this.collection.newList(c * distanceInDegrees, collectionColor);
            let colNr = 0;
            for (let angle = 0; angle < 180; angle += (180 / this.options.nrOfBallsPerCollection)) {
                const cssColor = this.options.paletteListForBalls().getPaletteColor(colNr++);
                if (this.options.usePaletForCorners) {
                    coll.addNewBall(angle, cssColor);
                }
                else{
                    coll.addNewBall(angle, collectionColor);
                }

            }
            coll.initSecondStage();
        }
    }

    drawVirtualLines() {
        for (let vl of this.backgroundLines) {
            vl.drawLine();
        }
    }

    run(speed) {
        /* Number */
        let angle = 0;
        this.intervalRef = window.setInterval(() => {
            for (let collection of this.collection.collections) {
                const cAngle = (angle + collection.angleOffset) % 360;
                collection.updateAngle(cAngle, this.options);
            }
            switch (this.options.animationDirection) {
                case "CCW":
                    angle++;
                    angle = angle % 360;
                    break;
                case "CW":
                    angle--;
                    if (angle < 0 ) {
                        angle = 360;
                    }
                    break;
                default:
                    console.error('Wrong animation direction');
                    break;
            }
        }, speed);
    }

    start(){
        this.run(this.options.refreshSpeed);
    }

    stop(){
        window.clearInterval(this.intervalRef);
    }

    clearAllBalls() {
        this.clearOneSVGGroup(this.svgInfo.svgGroupCollections);
        this.clearOneSVGGroup(this.svgInfo.svgGroupOuterballs);
    }

    clearOneSVGGroup(/* SVGElement */ group) {
        while (group.hasChildNodes()) {
            group.firstChild.remove();
        }
    }
}

window.onload = () => {
    const runner = new Runner();
    runner.start();
}
