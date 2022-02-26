export class SVGInfo {
    /* Number */ svgWidth = 0;
    /* Number */ svgHeight = 0;
    /* Number */ svgCX = 0;
    /* Number */ svgCY = 0;
    /* Number */ r = 0;
    /* Number */ d = 0;
    /* SVGElement */ globalSVG;
    /* SVGElement */ svgGroupVirtualLines;
    /* SVGElement */ svgGroupCollections;
    /* SVGElement */ svgGroupOuterballs;


    /**
     *
     * @param svgWidth
     * @param svgHeight
     */
    constructor(/*Number*/ svgWidth,
                /*Number*/ svgHeight,
                /* SVGElement */ globalSVG,
                /* SVGElement */ svgGroupVirtualLines,
                /* SVGElement */ svgGroupCollections,
                /* SVGElement */ svgGroupOuterballs,
                ) {
        this.svgWidth = svgWidth;
        this.svgHeight = svgHeight;
        this.svgCX = this.svgWidth / 2;
        this.svgCY = this.svgHeight / 2;
        this.r = svgWidth / 2;
        this.d = svgWidth;

        this.globalSVG = globalSVG;
        this.svgGroupVirtualLines = svgGroupVirtualLines;
        this.svgGroupCollections = svgGroupCollections;
        this.svgGroupOuterballs = svgGroupOuterballs;
    }
}