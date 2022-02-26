import {VirtualLine} from "./VirtualLine.js";
import {SVGInfo} from "./SVGInfo.js";
import {BallTrackerListCollection} from "./BallTrackerListCollection.js";
import {SVGSupport} from "./SVGSupport.js";

export class Runner {
    svgInfo = undefined;

    /* BallTrackerListCollection */
    collection = undefined;
    /* VirtualLine */
    backgroundLines = [];

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
    palettes = [];
    palette = []; // the current palette chosen
    showBalls = false;
    refreshSpeed = 0;
    maxNumberOfCollections = 20;
    elPalettelist = undefined;
    animationDirection = "";
    ballSize = 5;
    fadeOpacity = false;

    constructor() {
        this.svgInfo = new SVGInfo(800, 800,
            document.getElementById("svgContainer"),
            document.getElementById("virtuallines"),
            document.getElementById("collections"),
            document.getElementById("outerballs"),
        );
        this.svgSupportForCollections = new SVGSupport(this.svgInfo.svgGroupCollections);

        this.setupHTMLElementReferences();

        this.setupEventHandlers();

        this.setupPalettes();

        this.initValuesFromControls();

        this.collection = new BallTrackerListCollection(this.svgInfo);
        this.syncControls();
        this.init();
    }

    setupHTMLElementReferences() {
        this.svgBackgroundCircle     = document.getElementById("backgroundCircle");

        this.elNrOfCollections      = document.querySelector("input[name='nrOfCollections']");
        this.elDistanceType         = document.querySelector("select[name='distanceType']");
        this.elDistanceValue        = document.querySelector("input[name='distanceValue']");
        this.elnrOfBalls            = document.querySelector("input[name='nrOfBalls']");
        this.elShowLines            = document.querySelector("input[name='showLines']");
        this.elshowOuterballs       = document.querySelector("input[name='showOuterballs']");
        this.elShowBackgroundLines  = document.querySelector("input[name='showBackgroundLines']");
        this.elFillShapes           = document.querySelector("input[name='fillShapes']");
        this.elFillOpacity          = document.querySelector("input[name='fillOpacity']");
        this.elPaletteSelect        = document.querySelector("select[name='palette']");
        this.elShowBalls            = document.querySelector("input[name='showBalls']");
        this.elRefreshSpeed         = document.querySelector("input[name='refreshSpeed']");
        this.elAnimationDirection   = document.querySelector("select[name='animationDirection']");
        this.elBallOpacity          = document.querySelector("input[name='ballOpacity']");
        this.elBallSize             = document.querySelector("input[name='ballSize']");
        this.elfadeOpacity          = document.querySelector("input[name='fadeOpacity']");

        this.elRefreshSpeedValue    = document.getElementById("refreshSpeedValue");
        this.elPalettelist          = document.getElementById("palettelist");
        this.elnrOfCollectionsValue = document.getElementById("nrOfCollectionsValue");
        this.elnrOfBallsValue       = document.getElementById("nrOfBallsValue");
    }

    initValuesFromControls() {

        this.nrOfCollections        = this.elNrOfCollections.value;
        this.distanceType           = this.elDistanceType.value;
        this.distanceInDegrees      = this.elDistanceValue.value;
        this.nrOfBallsPerCollection = this.elnrOfBalls.value;
        this.fillOpacity            = this.elFillOpacity.value;
        this.refreshSpeed           = this.elRefreshSpeed.value;
        this.animationDirection     = this.elAnimationDirection.value;
        this.ballOpacity            = this.elBallOpacity.value;
        this.ballSize               = this.elBallSize.value;

        this.showBackgroundLines    = this.elShowBackgroundLines.checked;
        this.showOuterballs         = this.elshowOuterballs.checked;
        this.fillShapes             = this.elFillShapes.checked;
        this.showLines              = this.elShowLines.checked;
        this.showBalls              = this.elShowBalls.checked;
        this.fadeOpacity            = this.elfadeOpacity.checked;

        this.selectPalette(this.elPaletteSelect.value);

        if (!this.showBackgroundLines) {
            this.hideBackgroundCircle();
        }
    }

    selectPalette(/* NUmber */ num) {
        if (num < this.palettes.length) {
            this.palette = this.palettes[num];
            this.showPaletteList();
        }

    }

    showPaletteList() {
        while (this.elPalettelist.childNodes.length !== 0) {
            this.elPalettelist.firstChild.remove();
        }

        for(let i = 0; i < this.maxNumberOfCollections; i++) {
            const el = document.createElement("div");
            el.classList.add("palette");
            el.classList.add("item");
            el.style.backgroundColor = this.palette[i];
            el.innerhtml = '&nbsp;';
            this.elPalettelist.appendChild(el);
        }
    }

    setupEventHandlers() {

        this.elNrOfCollections.addEventListener("change", (evt) => {
            this.nrOfCollections = this.elNrOfCollections.value;
            this.syncControls();
            this.init();
        });
        this.elDistanceValue.addEventListener("change", evt => {
            this.distanceInDegrees = evt.currentTarget.value;
            this.syncControls();
            this.init();
        });
        this.elnrOfBalls.addEventListener("change" , evt => {
            this.nrOfBallsPerCollection = evt.currentTarget.value;
            this.syncControls();
            this.init();
        });
        this.elShowLines.addEventListener("change", evt => {
            this.showLines = evt.currentTarget.checked;
            this.syncControls();
        });
        this.elshowOuterballs.addEventListener("change", evt => {
            this.showOuterballs = evt.currentTarget.checked;
            this.syncControls();
        });
        this.elShowBackgroundLines.addEventListener("change" , evt => {
            this.showBackgroundLines = evt.currentTarget.checked;
            this.syncControls();
            this.init();
        });
        this.elFillShapes.addEventListener("change", evt => {
            this.fillShapes = evt.currentTarget.checked;
            this.syncControls();
        });
        this.elFillOpacity.addEventListener("change", evt => {
            this.fillOpacity = evt.currentTarget.value;
            this.syncControls();
        });

        this.elDistanceType.addEventListener("change" , evt => {
            this.distanceType = evt.currentTarget.value;
            this.syncControls();
        });

        this.elPaletteSelect.addEventListener("change", evt => {
            this.selectPalette(evt.currentTarget.value);
            this.init();
            this.syncControls();
        });

        this.elShowBalls.addEventListener("change", evt => {
            this.showBalls = evt.currentTarget.checked;
            this.syncControls();
        });

        this.elRefreshSpeed.addEventListener("change", evt => {
            this.refreshSpeed = evt.currentTarget.value;
            this.syncControls();
            this.stop();
            this.start();
        });

        this.elAnimationDirection.addEventListener("change", evt => {
            this.animationDirection = evt.currentTarget.value;
            this.syncControls();
            this.stop();
            this.start();
        });

        this.elBallOpacity.addEventListener("change", evt => {
            this.ballOpacity = evt.currentTarget.value;
            this.syncControls();
        });

        this.elBallSize.addEventListener("change", evt => {
            this.ballSize = evt.currentTarget.value;
            this.syncControls();
        });

        this.elfadeOpacity.addEventListener("change", evt => {
           this.fadeOpacity = evt.currentTarget.checked;
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
        this.elFillShapes.disabled  = !this.elShowLines.checked;
        this.elRefreshSpeedValue.innerText = `${this.refreshSpeed}ms`;
        this.elnrOfCollectionsValue.innerText = `${this.nrOfCollections}`;
        this.elnrOfBallsValue.innerText = `${this.nrOfBallsPerCollection}`;
    }

    setupPalettes() {
        const colored = [ /* in total the same amount of colors as the maximum of collections*/
            "blue","orange","red","yellow","grey",
            "darkgreen","purple","lightblue","green","crimson",
            "Chocolate","deeppink","gold","honeydew","lavender",
            "magenta","seashell","brown", "teal", "orangered"

        ];
        const greyscales = [];
        for (let i=0;i<=255; i+= 255 / this.maxNumberOfCollections) {
            greyscales.push(`rgb(${i},${i},${i})`)
        }
        const greyscalesReverse = [];
        for (let i=255;i>=0; i-= 255 / this.maxNumberOfCollections) {
            greyscalesReverse.push(`rgb(${i},${i},${i})`)
        }
        const hsl = [];
        for (let i = 0; i<255; i+= 255/this.maxNumberOfCollections) {
            hsl.push(`hsl(${i}, 100%, 50%)`);
        }
        const randomhsl = [];
        for (let i = 0; i<255; i+= 255/this.maxNumberOfCollections) {
            const color = Math.random() * 255;
            randomhsl.push(`hsl(${color}, 100%, 50%)`);
        }

        const randomrgb = [];
        for (let i = 0; i<255; i+= 255/this.maxNumberOfCollections) {
            const color1 = Math.random() * 255;
            const color2 = Math.random() * 255;
            const color3 = Math.random() * 255;
            randomrgb.push(`rgb(${color1}, ${color2}, ${color3})`);
        }

        const randomgray = [];
        for (let i = 0; i<255; i+= 255/this.maxNumberOfCollections) {
            const color1 = Math.random() * 255;
            randomgray.push(`rgb(${color1}, ${color1}, ${color1})`);
        }

        this.palettes = [
            colored, greyscales, greyscalesReverse, hsl, randomhsl, randomrgb, randomgray
        ];
        const paletteNames = [
            'Colored' , 'Greyscales', 'Greyscales reversed', 'HSL', 'Random HSL', 'Random RGB', 'Random greyscales'
        ]
        for(const pal in this.palettes) {
            const option = document.createElement("option");
            option.value = pal;
            option.innerText = paletteNames[pal];
            this.elPaletteSelect.appendChild(option);
        }
    }

    clearBackgroundLines() {
        this.backgroundLines.length = 0;

        this.clearOneSVGGroup(this.svgInfo.svgGroupVirtualLines);
    }
    createBackgroundLines() {
        for (let angle = 0; angle < 180; angle += 180 / this.nrOfBallsPerCollection) {
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
        if (this.showBackgroundLines){
            this.createBackgroundLines();
            this.showBackgroundCircle();
        }
        else {
            this.hideBackgroundCircle();
        }


        let distanceInDegrees = 0;
        switch (this.distanceType) {
            case "MAN":
                distanceInDegrees = this.distanceInDegrees;
                break;
            case "AUTO":
                distanceInDegrees = 360 / this.nrOfCollections;
                break;
        }
        for (let c = 0; c < this.nrOfCollections; c++) {
            const coll = this.collection.newList(c * distanceInDegrees, this.palette[c]);
            for (let angle = 0; angle < 180; angle += (180 / this.nrOfBallsPerCollection)) {
                coll.add(angle);
            }
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
                collection.updateAngle(cAngle,
                    this.showBalls,
                    this.ballOpacity,
                    this.fadeOpacity,
                    this.ballSize,
                    this.showLines,
                    this.showOuterballs,
                    this.fillShapes,
                    this.fillOpacity);
            }
            switch (this.animationDirection) {
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
            }
        }, speed);
    }

    start(){
        this.run(this.refreshSpeed);
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
