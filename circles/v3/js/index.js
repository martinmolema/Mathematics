import {VirtualLine} from "./VirtualLine.js";
import {SVGInfo} from "./SVGInfo.js";
import {BallTrackerListCollection} from "./BallTrackerListCollection.js";
import {
    BALL_COLOR_TYPE_FIXED,
    BALL_COLOR_TYPE_FOLLOW_SHAPE,
    BALL_COLOR_TYPE_PALETTE,
    GUIOptions
} from "./GUIOptions.js";
import {SavedConfigs} from "./SavedConfigs.js";

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

        this.savedConfigs = new SavedConfigs("Circles_V1");
        if (this.savedConfigs.isEmpty()) {
            this.loadDefaultConfigFromWebsite();
        }

        // Create a list of default options and two default palettelists.
        this.options = new GUIOptions();

        // find HTML elements and connect handlers
        this.setupHTMLElementReferences();
        this.setupEventHandlers();

        // fill the list of palettes (because now we know which HTML-element to fill
        this.addPalettesToGUIElement();

        // now setup all options from the GUI
        this.initValuesFromControls();
        this.updateSavedConfigsList();

        // now that the options are set, we can setup the palettes according to the number of corners and collections
        this.options.updatePaletteForCollections(this.options.nrOfCollections);
        this.options.updatePaletteForBalls(this.options.nrOfBallsPerCollection);
        this.showPaletteList();

        this.collection = new BallTrackerListCollection(this.svgInfo);
        this.syncControls();
        this.init();
    }

    loadDefaultConfigFromWebsite() {
        const xhr = new XMLHttpRequest();
        xhr.open("get", "./json/default.configs.json");
        xhr.onload = (evt) => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const json = xhr.responseText;
                    this.savedConfigs.loadJSON(json, true, true);
                    this.updateSavedConfigsList();
                }
            }
        }
        xhr.error = (evt) => { console.error('Cannot load default config'); }
        xhr.send();

    }

    addPalettesToGUIElement() {
        this.addOnePaletteToOneGUIElement(this.elPaletteSelect);
        this.addOnePaletteToOneGUIElement(this.elPaletteForShapesSelect);
    }

    addOnePaletteToOneGUIElement(selectElement){
        const pal = this.options.paletteListForCollections();
        const nrOfNamesInPalette = pal.getNumberOfItemsInList();
        for(let i=0;i<nrOfNamesInPalette; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.innerText = pal.getPaletteName(i);

            selectElement.appendChild(option);
        }
    }

    setupHTMLElementReferences() {
        this.svgBackgroundCircle     = document.getElementById("backgroundCircle");

        /* Elements for events and supplying values */
        this.elNrOfCollections        = document.querySelector("input[name='nrOfCollections']");
        this.elDistanceType           = document.querySelector("select[name='distanceType']");
        this.elDistanceValue          = document.querySelector("input[name='distanceValue']");
        this.elnrOfBalls              = document.querySelector("input[name='nrOfBalls']");
        this.elShowLines              = document.querySelector("input[name='showLines']");
        this.elshowOuterballs         = document.querySelector("input[name='showOuterballs']");
        this.elShowBackgroundLines    = document.querySelector("input[name='showBackgroundLines']");
        this.elFillShapes             = document.querySelector("input[name='fillShapes']");
        this.elFillOpacity            = document.querySelector("input[name='fillOpacity']");
        this.elPaletteSelect          = document.querySelector("select[name='paletteForBalls']");
        this.elPaletteForShapesSelect = document.querySelector("select[name='paletteShapes']");
        this.elShowBalls              = document.querySelector("input[name='showBalls']");
        this.elRefreshSpeed           = document.querySelector("input[name='refreshSpeed']");
        this.elAnimationDirection     = document.querySelector("select[name='animationDirection']");
        this.elBallOpacity            = document.querySelector("input[name='ballOpacity']");
        this.elBallSize               = document.querySelector("input[name='ballSize']");
        this.elfadeOpacity            = document.querySelector("input[name='fadeOpacity']");
        this.elShapeLineWidth         = document.getElementById("shapeLineWidth");

        /* The radio button group */
        this.elRadiobuttonsBallColoringType = document.querySelectorAll("input[name='ballColoringType']");
        this.elRadioBallColoringTypeValue   = document.querySelector("input[name='ballColoringType']");

        /* elements needed supply feedback */
        this.elRefreshSpeedValue    = document.getElementById("refreshSpeedValue");
        this.elnrOfCollectionsValue = document.getElementById("nrOfCollectionsValue");
        this.elnrOfBallsValue       = document.getElementById("nrOfBallsValue");

        /* Select lists to be filled */
        this.elPalettelistBalls        = document.getElementById("palettelistBalls");
        this.elPalettelistCollections  = document.getElementById("palettelistCollections");

        /* The HSL Color picker */
        this.elHSLColorpickerContainer = document.getElementById("hslcolorpickerContainer");
        this.elHSLColorpicker          = document.getElementById("hslcolors");
        this.elHSLColorChosen          = document.getElementById("hslcolorchosen");

        /* Containers to switch on/off certain elements */
        /* the DIV-element to show all colors of the ball-palette */
        this.elBallPaletteViewContainer         = document.getElementById("ballPalletListContainer");

        /* a DIV-element to be switched on or off only if "Multi Color" for balls is selected */
        this.elpaletteForBallsSectionContainer  = document.getElementById("paletteForBallsSectionContainer");

        /* Save & Load buttons / Textarea*/
        this.btnActivateConfig = document.getElementById("loadsettings");
        this.btnExportConfigs  = document.getElementById("exportsettings");
        this.btnImportConfigs  = document.getElementById("importsettings");
        this.btnUpdateSaved    = document.getElementById("updateSavedSettings");
        this.btnAddNewSaved    = document.getElementById("createNewSavedSettings");
        this.btnClearSettings  = document.getElementById("clearsettings");
        this.btnDeleteSetting  = document.getElementById("deleteExistingItem");

        this.elSelectSavedConfig  = document.querySelector("select[name='savedConfigs']");
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

        this.options.ballColorType          = this.elRadioBallColoringTypeValue.value;

        this.selectPalettesUsingControls();

        if (!this.options.showBackgroundLines) {
            this.hideBackgroundCircle();
        }
    }

    initControlsFromValues() {
        this.elNrOfCollections.value    = this.options.nrOfCollections;
        this.elDistanceType.value       = this.options.distanceType;
        this.elDistanceValue.value      = this.options.distanceInDegrees;
        this.elnrOfBalls.value          = this.options.nrOfBallsPerCollection;
        this.elFillOpacity.value        = this.options.fillOpacity;
        this.elRefreshSpeed.value       = this.options.refreshSpeed;
        this.elAnimationDirection.value = this.options.animationDirection;
        this.elBallOpacity.value        = this.options.ballOpacity;
        this.elBallSize.value           = this.options.ballSize;
        this.elShapeLineWidth.value     = this.options.shapeLineWidth;

        this.elShowBackgroundLines.checked = this.options.showBackgroundLines;
        this.elshowOuterballs.checked      = this.options.showOuterballs;
        this.elFillShapes.checked          = this.options.fillShapes;
        this.elShowLines.checked           = this.options.showLines;
        this.elShowBalls.checked           = this.options.showBalls;
        this.elfadeOpacity.checked         = this.options.fadeOpacity;

        this.setValueOfRadioButtonGroup(this.elRadiobuttonsBallColoringType);

        this.elPaletteSelect.value          = this.options.paletteListForBalls().selectedPaletteNr;
        this.elPaletteForShapesSelect.value = this.options.paletteListForCollections().selectedPaletteNr;
    }// initControlsFromValues

    setValueOfRadioButtonGroup(radiobuttons) {
        for(const radiobutton of radiobuttons) {

            radiobutton.checked = radiobutton.value === this.options.ballColorType;
        }
    }// setValueOfRadioButtonGroup

    selectPalettesUsingControls() {
        const paletteNrSelectedBalls  = this.elPaletteSelect.value;
        const paletteNrSelectedShapes = this.elPaletteForShapesSelect.value;

        this.options.paletteListForBalls().selectPalette(paletteNrSelectedBalls);
        this.options.paletteListForCollections().selectPalette(paletteNrSelectedShapes);

        this.showPaletteList();
    }// selectPalettesUsingControls

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
        this.elRadiobuttonsBallColoringType.forEach(value => {
            value.addEventListener("change", evt => {
                this.options.ballColorType = evt.currentTarget.value;
                this.syncControls();
                this.init();
            });
        });

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
            this.selectPalettesUsingControls();
            this.init();
            this.syncControls();
        });

        this.elPaletteForShapesSelect.addEventListener("change", evt => {
            this.selectPalettesUsingControls();
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
        this.elShapeLineWidth.addEventListener("change", evt => {
            this.options.shapeLineWidth = evt.currentTarget.value;
            this.syncControls();
        });
        this.elHSLColorpicker.addEventListener("click", evt => {
            const x = evt.offsetX;
            const w = this.elHSLColorpicker.clientWidth;
            const colorNumber = 360 * (x/w);
            this.options.selectedSingleHSLColor = `hsl(${colorNumber}, 100%, 50%)`;
            this.syncControls();
            this.init();
        });
        this.btnExportConfigs.addEventListener("click", evt => {
            const json = this.savedConfigs.json();
            this.exportToDownloadableFile(json);
        });
        this.btnImportConfigs.addEventListener("change", evt => {
            this.importFromFileUpload(this.btnImportConfigs.files[0]);
        }, false);

        this.btnAddNewSaved.addEventListener("click", evt => {
            this.saveCurrentGUIConfiguration();
            this.syncControls();
        });
        this.btnUpdateSaved.addEventListener("click", evt => {
            this.saveCurrentGUIConfiguration(this.elSelectSavedConfig.value);
            this.syncControls();
        });

        this.btnActivateConfig.addEventListener("click", evt => {
            this.activateConfig(this.elSelectSavedConfig.value);
        });

        this.elSelectSavedConfig.addEventListener("change", evt => {
            this.syncControls();
        });
        this.btnClearSettings.addEventListener("click", evt => {
            if (confirm("Are you sure you want to clear all locally saved items?")){
                this.savedConfigs.clear();
                this.updateSavedConfigsList();
            }
        });
        this.btnDeleteSetting.addEventListener("click", evt => {

        });

    }// setupEventhandlers

    /**
     * Import a file, selected by the user using a <input type="file"> and input.addEventListener("change", ...)
     * @param file
     */
    importFromFileUpload(/*File */ file){
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
        const reader = new FileReader();
        const that = this;
        reader.onload = (evt) => {
            const json = evt.target.result;
            that.importNewConfigurationsFromJSON(json);
            this.syncControls();
        }
        reader.readAsText(file);
    }

    /**
     * Creates a download file by creating a temporary <A>-element and activating it
     * @param json the JSON to be exported
     */
    exportToDownloadableFile(/* string */ json) {
        const filename = 'circles.configurations.json';
        // Set up the link
        const link = document.createElement("a");
        link.setAttribute("target","_blank");
        if(Blob !== undefined) {
            const blob = new Blob([json], {type: "text/plain"});
            link.setAttribute("href", URL.createObjectURL(blob));
        } else {
            link.setAttribute("href","data:text/plain," + encodeURIComponent(text));
        }
        link.setAttribute("download",filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Activate a certain configuration
     * @param id the unique identification of the configuration
     */
    activateConfig(/* GUID */ id) {
        const config = this.savedConfigs.getConfigByID(id);
        this.options.updateFromRestoredObject(config.config);
        this.initControlsFromValues();
        this.syncControls();
        this.showPaletteList();
        this.init();
    }// loadNewConfig

    /**
     * Imports a new set of configurations by the supplied JSON string
     * @param json
     */
    importNewConfigurationsFromJSON(/* string */ json) {
        this.savedConfigs.loadJSON(json, true, true);
        this.updateSavedConfigsList();
    }

    /**
     * Updates the <SELECT>-element on the GUI so the list of available configurations is visible
     */
    updateSavedConfigsList() {
        while (this.elSelectSavedConfig.childNodes.length !== 0){
            this.elSelectSavedConfig.firstChild.remove();
        }
        const items = this.savedConfigs
            .getNamesAndIDs()
            .sort((a, b) => a.name.localeCompare(b.name));

        for (const item of items) {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerText = item.name;
            this.elSelectSavedConfig.appendChild(option);
        }
        this.elSelectSavedConfig.value = null;
    }

    /**
     * Saves the current configuration (the GUI-elements selected) to a new or existing configuration.
     * @param existingID
     */
    saveCurrentGUIConfiguration(/* GUID | "" */ existingID = "") {
        if (existingID === "") {
            const name = prompt("What is the name of this configuration");
            if (name !== null) {
                const newId = this.savedConfigs.addNewConfig(name, this.options);
                this.updateSavedConfigsList();
                this.elSelectSavedConfig.value = newId;
            }
        }
        else{
            const currentName = this.savedConfigs.getNameForID(existingID);
            const name = prompt("What is the name of this configuration", currentName);
            if (name != null) {
                this.savedConfigs.updateNameForID(existingID, name);
                this.savedConfigs.updateConfigurationFromGUIObjectByID(existingID, this.options);
                this.updateSavedConfigsList();
            }

        }

    }// saveCurrentGUIConfiguration

    syncControls() {
        switch (this.elDistanceType.value) {
            case "MAN":
                this.elDistanceValue.disabled = false;
                break;
            case "AUTO":
                this.elDistanceValue.disabled = true;
                break;
        }
        this.elBallOpacity.disabled = !this.options.showBalls;
        this.elBallSize.disabled    = !this.options.showBalls;
        this.elfadeOpacity.disabled = !this.options.showBalls;

        this.elpaletteForBallsSectionContainer.style.display = this.options.ballColorTypeIsPalette() ? "block": "none";
        this.elBallPaletteViewContainer.style.display        = this.options.ballColorTypeIsPalette() ? "block": "none";

        this.elRefreshSpeedValue.innerText    = `${this.options.refreshSpeed}ms`;
        this.elnrOfCollectionsValue.innerText = `${this.options.nrOfCollections}`;
        this.elnrOfBallsValue.innerText       = `${this.options.nrOfBallsPerCollection}`;

        this.elHSLColorpickerContainer.style.display = this.options.ballColorTypeIsFixed() ? "flex" : "none";
        this.elHSLColorChosen.style.backgroundColor  = this.options.selectedSingleHSLColor;

        const isConfigSelected = (this.elSelectSavedConfig.value !== null  && this.elSelectSavedConfig.value !== "");
        this.btnUpdateSaved.disabled    = !isConfigSelected;
        this.btnDeleteSetting.disabled  = !isConfigSelected;
        this.btnActivateConfig.disabled = !isConfigSelected;
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

                switch(this.options.ballColorType) {
                    case BALL_COLOR_TYPE_FIXED:
                        coll.addNewBall(angle, this.options.selectedSingleHSLColor);
                        break;
                    case BALL_COLOR_TYPE_FOLLOW_SHAPE:
                        const paletteColor = this.options.paletteListForCollections().getPaletteColor(c);
                        coll.addNewBall(angle, paletteColor);
                        break;
                    case BALL_COLOR_TYPE_PALETTE:
                        const cssColor = this.options.paletteListForBalls().getPaletteColor(colNr++);
                        coll.addNewBall(angle, cssColor);
                        break;
                }

                if (this.options.useSingleHSLColor) {

                }
                else if (this.options.usePaletForCorners) {
                }
                else{
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
