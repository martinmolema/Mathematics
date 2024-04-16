window.onload = function () {
    setup();
}
const SVG_NS = "http://www.w3.org/2000/svg";

let elSvgCanvas;
let elAxesMarkers;
let elSVGDrawing;
let elSlider;
let elSliderValue;
let elCheckboxDrawLines;
let elCheckboxDrawDots;
let elCheckboxFixedColor;
let elCheckboxFillTriangles;
let elSliderFillOpacity;
let drawingDirection = "F";

let drawDots = true;
let drawLines = true;
let fixedColor = false;
let fillTriangles = false;
let fillOpacity = 0.7;

// the current number of iterations requested by the user
let nrOfIterations;

// dimensions of the complete SVG
let svgWidth;
let svgHeight;

let drawingSpaceMargin = 10;

// the number of markers on the positive or negative part of an axis
let desiredNrOfMarkers = 10;
let actualNumberOfMarkers = 10;

// the maximum radius to draw: this is in fact the square root of the current number of iterations
let maxRadius;

// the distance between to values on the axis; so this is NOT the amount of pixels
let markerDistance;

// the multiplying factor to scale a radius on the SVG.
let UNIT_IN_PIXEL = 1;

// the location of the origin.
let ORIGIN_X = 400;
let ORIGIN_Y = 400;

// list of points
let listOfPoints = [];


class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

function setup() {
    elSvgCanvas = document.getElementById("canvas");
    elSVGDrawing = document.getElementById("contents");
    elSlider = document.getElementById("slider");
    elSliderValue = document.getElementById("sliderValue");
    elAxesMarkers = document.getElementById("axesmarkers");

    elCheckboxDrawDots = document.querySelector("input[name='drawDots']")
    elCheckboxDrawLines = document.querySelector("input[name='drawLines']")
    elCheckboxFixedColor = document.querySelector("input[name='fixedColor']")
    elCheckboxFillTriangles = document.querySelector("input[name='fillTriangles']")
    elSliderFillOpacity = document.querySelector("input[name='fillOpacity']")

    svgWidth = elSvgCanvas.width.baseVal.value - 2 * drawingSpaceMargin;
    svgHeight = elSvgCanvas.height.baseVal.value - 2 * drawingSpaceMargin;

    elSlider.addEventListener("input", function (event) {
        nrOfIterations = parseInt(elSlider.value);
        updateParametersFromScreenInput();
        calculateDrawingUnits();
        draw();
    });

    document.querySelector("article section:first-of-type").addEventListener("input", (event) => {
        updateParametersFromScreenInput();
        draw();
    });

    nrOfIterations = 10;
    updateParametersFromScreenInput();
    calculateDrawingUnits();
    draw();
}

function updateParametersFromScreenInput() {
    elSlider.value = nrOfIterations;
    elSliderValue.innerText = nrOfIterations.toString();
    drawDots = elCheckboxDrawDots.checked;
    drawLines = elCheckboxDrawLines.checked;
    fixedColor = elCheckboxFixedColor.checked;
    fillTriangles = elCheckboxFillTriangles.checked;
    // elSliderFillOpacity.style.visibility = fillTriangles ? "visible" : "hidden";
    fillOpacity = parseInt(elSliderFillOpacity.value);

    drawingDirection = document.querySelector("input[name='drawingOrder']:checked").value;
}

function myround(value, step) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}

function calculateDrawingUnits() {
    ORIGIN_X = drawingSpaceMargin + svgWidth / 2;
    ORIGIN_Y = drawingSpaceMargin + svgHeight / 2;

    // create a new list of points
    listOfPoints = [];

    // a bit hacky:prepare the first point so a valid "previous point" can be given to the FOR-loop handling the rest.
    listOfPoints.push(new Point(1, 0));
    listOfPoints.push(new Point(1, 1));

    // remember the last point so a proper triangle can be constructed.
    let previousPoint = new Point(1, 1);

    let angle = (45 / 360) * Math.PI * 2;

    for (let i = 2; i <= nrOfIterations; i++) {
        // now calculate the angle. fill an array with a range first
        const parts = Array.from(Array(i - 1).keys());

        // calculate the radius: the Square Root of the current iteration
        const radius = Math.sqrt(i);

        // calculate the new angle
        angle += Math.atan(1 / radius);

        // translate from Polar to Carthesian (https://www.mathcentre.ac.uk/resources/uploaded/mc-ty-polar-2009-1.pdf)
        let x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);

        // Add the point
        const newPoint = new Point(x, y);
        listOfPoints.push(newPoint);

        // move the previous point to the current point.
        previousPoint = newPoint;
    }

    // now find the most extreme point on the grid, in either X or Y direction (positive or negative) so we can
    // calculate the scale of the drawing and the axis markers
    // first find the maximum on the X-axis, then find the maximum on the Y-axis and take the max of either.
    const maxX = listOfPoints.map(p => p.x).reduce((previousValue, currentValue) => Math.abs(currentValue) > previousValue ? Math.abs(currentValue) : previousValue, 0);
    const maxY = listOfPoints.map(p => p.y).reduce((previousValue, currentValue) => Math.abs(currentValue) > previousValue ? Math.abs(currentValue) : previousValue, 0);
    const maxPosition = Math.max(maxX, maxY);

    // calculate the value between ticks: each position is determined by
    markerDistance = maxPosition / desiredNrOfMarkers;

    // round the marker distance to a "normal" value.
    markerDistance = myround(markerDistance, 0.1);

    // now calculate the actual number of markers that will be placed. THIS CAN BE A FRACTION AND IT SHOULD BE!
    actualNumberOfMarkers = maxPosition / markerDistance;

    // calculate the multiplication factor: the width is halved (because we only need one part (e.g. positive) of the
    // axis. Then the maximum position on that axis is used to divide the available pixels by the needed space (in calculation space)
    UNIT_IN_PIXEL = (svgWidth / 2) / maxPosition;
}

function drawAxesMarkers() {
    elAxesMarkers.innerHTML = '';

    // calculate the visual spacing of the markers; use the floating point value of the actual number of markers.
    let stepX = svgWidth / (2 * actualNumberOfMarkers);
    let stepY = svgHeight / (2 * actualNumberOfMarkers);

    // now create an integer number so the for-loop can actually place the correct number of markers
    const nrOfMarkersToPlace = Math.floor(actualNumberOfMarkers);

    for (let tickNrX = -nrOfMarkersToPlace; tickNrX <= nrOfMarkersToPlace; tickNrX++) {
        // create the marker line
        const marker = document.createElementNS(SVG_NS, "line");
        const x1 = ORIGIN_X + tickNrX * stepX;
        const y1 = ORIGIN_Y - 3;
        const x2 = x1;
        const y2 = y1 + 6;

        marker.setAttribute('x1', x1);
        marker.setAttribute('y1', y1);
        marker.setAttribute('x2', x2);
        marker.setAttribute('y2', y2);
        marker.classList.add("tick");
        elAxesMarkers.appendChild(marker);

        const txt = document.createElementNS(SVG_NS, "text");
        txt.setAttribute('x', x1);
        txt.setAttribute('y', y2 + 10);
        txt.classList.add("tick");
        txt.classList.add("horizontal");

        const markerValue = myround(tickNrX * markerDistance, 0.1);
        txt.textContent = markerValue.toString();
        elAxesMarkers.appendChild(txt);
    }

    // now place the Y-axis lines. Remember that the Y-axis of the carthesian system is reversed compared to the SVG-coordinate system!
    for (let tickNrY = nrOfMarkersToPlace; tickNrY >= -nrOfMarkersToPlace; tickNrY--) {
        const marker = document.createElementNS(SVG_NS, "line");

        const x1 = ORIGIN_X - 3;
        const y1 = ORIGIN_Y - tickNrY * stepX;
        const x2 = x1 + 6;
        const y2 = y1;

        marker.setAttribute('x1', x1);
        marker.setAttribute('y1', y1);
        marker.setAttribute('x2', x2);
        marker.setAttribute('y2', y2);
        marker.classList.add("tick");
        elAxesMarkers.appendChild(marker);

        const txt = document.createElementNS(SVG_NS, "text");
        txt.setAttribute('x', x1);
        txt.setAttribute('y', y1 + 4);
        txt.classList.add("tick");
        txt.classList.add("vertical");

        const markerValue = myround(tickNrY * markerDistance, 0.1);
        txt.textContent = markerValue.toString();
        elAxesMarkers.appendChild(txt);
    }

}

function mapXPositionToCanvas(x) {
    return ORIGIN_X + x * UNIT_IN_PIXEL
}

function mapYPositionToCanvas(y) {
    return ORIGIN_Y - y * UNIT_IN_PIXEL;
}

function mapCoordinateToCanvas(x, y) {
    return new Point(mapXPositionToCanvas(x), mapYPositionToCanvas(y));
}

function mapPointToCanvas(p) {
    return mapCoordinateToCanvas(p.x, p.y);
}

function draw() {
    elSVGDrawing.innerHTML = '';

    drawAxesMarkers();

    let nrOfPoints = listOfPoints.length;
    let previousPoint;
    let startValue;
    let stopValue;
    let incrementValue;

    switch (drawingDirection) {
        case "F":
            previousPoint = listOfPoints[0];
            startValue = 0;
            stopValue = nrOfPoints;
            incrementValue = 1;
            break;
        case "R":
            previousPoint = listOfPoints[nrOfPoints-1];
            startValue = nrOfPoints-1;
            stopValue = 0;
            incrementValue = -1;
            break;
    }


    for (let i = startValue ; i !== stopValue ; i+= incrementValue) {

        const currentPoint = listOfPoints[i];
        const x = mapXPositionToCanvas(currentPoint.x);
        const y = mapYPositionToCanvas(currentPoint.y);

        let color = "blue";
        if (!fixedColor) {
            const hslHue = (360 / nrOfIterations) * i;
            color = `hsl(${hslHue}, 100%, 50%)`;
        }
        let fillColor = fillTriangles ? color : "none";
        let strokeColorLine = drawLines ? color : fillColor;

        const polygon = document.createElementNS(SVG_NS, "polygon");

        // create an empty array that will be expanded to the set of points
        const points = [];

        // push Origin (0,0)
        points.push(mapCoordinateToCanvas(0, 0));

        // add the point from the previous iteration
        points.push(mapPointToCanvas(previousPoint));


        // Add the point
        const newPoint = new Point(x, y);
        points.push(newPoint);

        const listOfPointsAsString = points.map(m => `${m.x},${m.y}`).join(' ');

        polygon.setAttribute('class', `segment nr_${i}`);
        polygon.setAttribute("points", listOfPointsAsString);

        polygon.setAttribute('stroke', strokeColorLine);
        polygon.setAttribute('stroke-opacity', fillOpacity / 100);
        polygon.setAttribute('fill', fillColor);
        polygon.setAttribute('fill-opacity', fillOpacity / 100);

        elSVGDrawing.appendChild(polygon);

        if (drawDots) {
            // put a small dot on the outer rim of the spiral for this iteration
            const circle = document.createElementNS(SVG_NS, "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", 2);
            circle.setAttribute("fill", color);
            circle.classList.add('dot');
            elSVGDrawing.appendChild(circle);
        }

        previousPoint = currentPoint;
    }
}