window.onload = function () {
    setup();
}
const SVG_NS = "http://www.w3.org/2000/svg";

let nrOfIterations = 8000;
let elSvgCanvas;
let elContents;
let elConnectors;
let elPrimeLines;

// dimensions of the complete SVG
let svgWidth;
let svgHeight;
// the location of the origin.
let ORIGIN_X;
let ORIGIN_Y;
let drawingSpaceMargin = 10;

let textBoxWidth = 40;
let textBoxHeight = 40;

let listOfPoints = [];

class Point {
    n;
    col;
    row;
    x;
    y;

    constructor(n, col, row, x, y) {
        this.n = n;
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
    }
}

function setup() {
    elSvgCanvas = document.getElementById("canvas");
    elContents = document.getElementById("contents");
    elConnectors = document.getElementById("connectors");
    elPrimeLines = document.getElementById("primelines");

    svgWidth = elSvgCanvas.width.baseVal.value - 2 * drawingSpaceMargin;
    svgHeight = elSvgCanvas.height.baseVal.value - 2 * drawingSpaceMargin;

    ORIGIN_X = drawingSpaceMargin + svgWidth / 2;
    ORIGIN_Y = drawingSpaceMargin + svgHeight / 2;

    findAllPrimesUpTo(nrOfIterations);
    draw();
}

function getNextDirection(direction) {
    switch (direction) {
        case "R":
            return "U";
        case "U":
            return "L";
        case "L":
            return "D";
        case "D":
            return "R";

    }
}

function draw() {
    let nrOfNumbersToDraw = 2;
    let direction = "R"; // R=Right, U = Up, L = Left, D=Down. in that order

    let x = 0;
    let y = 0;
    let i = 0;
    while (i < nrOfIterations) {
        for (let j = 0; j < nrOfNumbersToDraw - 1 && i < nrOfIterations; j++) {
            drawOneNumber(i + 1, x, y);
            i++;
            switch (direction) {
                case "R":
                    x++;
                    break;
                case "U":
                    y--;
                    break;
                case "L":
                    x--;
                    break;
                case "D":
                    y++;
            }
        }
        direction = getNextDirection(direction);
        for (let j = 0; j < nrOfNumbersToDraw - 1 && i < nrOfIterations; j++) {
            drawOneNumber(i + 1, x, y);
            i++;
            switch (direction) {
                case "R":
                    x++;
                    break;
                case "U":
                    y--;
                    break;
                case "L":
                    x--;
                    break;
                case "D":
                    y++;
            }
        }
        direction = getNextDirection(direction);
        nrOfNumbersToDraw++;
    }
    drawConnectionPoints();
    findPrimeLines();
}

function findPrimeLines() {
    // first find size of matrix that was created
    const xmin = listOfPoints.map(p => p.col).reduce((previousValue, currentValue) => currentValue < previousValue ? currentValue : previousValue, 1000000);
    const xmax = listOfPoints.map(p => p.col).reduce((previousValue, currentValue) => currentValue > previousValue ? currentValue : previousValue, -1000000);
    const ymin = listOfPoints.map(p => p.row).reduce((previousValue, currentValue) => currentValue < previousValue ? currentValue : previousValue, 1000000);
    const ymax = listOfPoints.map(p => p.row).reduce((previousValue, currentValue) => currentValue > previousValue ? currentValue : previousValue, -100000);

    console.log(`dimensions = (${xmin},${ymin}) x (${xmax},${ymax})`);

    listOfPoints.forEach(cell => {
        const line1 = findPrimeLineFromXY(cell.col, cell.row, 1, 1, []);
        const line2 = findPrimeLineFromXY(cell.col, cell.row, 1, -1, []);
        const line3 = findPrimeLineFromXY(cell.col, cell.row, -1, 1, []);
        const line4 = findPrimeLineFromXY(cell.col, cell.row, -1, -1, []);

        drawPrimeline(line1);
        drawPrimeline(line2);
        drawPrimeline(line3);
        drawPrimeline(line4);

    });
}

function drawPrimeline(lineparts) {
    const nrOfParts = lineparts.length;
    if (nrOfParts < 2) {
        return;
    }

    lineparts.sort((a, b) => a.n - b.n);

    console.log(lineparts.map(p => p.n.toString()).join(','));

    const x1 = lineparts[0].x;
    const x2 = lineparts[nrOfParts - 1].x;
    const y1 = lineparts[0].y;
    const y2 = lineparts[nrOfParts - 1].y;

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.classList.add("primeline");

    elPrimeLines.appendChild(line);
}

function findValueAtColRow(col, row) {
    return listOfPoints.find(p => p.col === col && p.row === row);
}

function findPrimeLineFromXY(col, row, dx, dy, result) {
    const value = findValueAtColRow(col, row); // returns if undefined; convenient if (col, row) coords are out of range.
    if (value) {
        const alreadyFound = result.find(p => p.n === value.n) !== undefined;
        const isPrime = primes.includes(value.n);

        if (!alreadyFound && isPrime) {
            result.push(value);
            findPrimeLineFromXY(col + dx, row + dy, dx, dy, result);
        }
    }
    return result;
}

function drawConnectionPoints() {
    let prevPoint = listOfPoints[0];
    for (let i = 1; i < listOfPoints.length; i++) {
        const point = listOfPoints[i];
        let x1 = prevPoint.x;
        let y1 = prevPoint.y;
        let x2 = point.x;
        let y2 = point.y;

        if (x1 === x2) {
            const goingDown = (y1 < y2);
            y1 += (textBoxHeight / 4) * (goingDown ? 1 : -1);
            y2 += (textBoxHeight / 4) * (goingDown ? -1 : 1);
        } else if (y1 === y2) {
            const goingRight = (x1 < x2);
            x1 += (textBoxWidth / 4) * (goingRight ? 1 : -1);
            x2 += (textBoxWidth / 4) * (goingRight ? -1 : 1);
        }

        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.classList.add("connector");

        elConnectors.appendChild(line);

        prevPoint = point;
    }
}

function drawOneNumber(n, col, row) {
    const txtX = ORIGIN_X + col * textBoxWidth + textBoxWidth / 2;
    const txtY = ORIGIN_Y + row * textBoxHeight + textBoxHeight / 2;

    listOfPoints.push(new Point(n, col, row, txtX, txtY));

    const txt = document.createElementNS(SVG_NS, "text");
    txt.setAttribute("x", txtX);
    txt.setAttribute("y", txtY + 6);
    if (primes.includes(n)) {
        txt.classList.add("isPrime");
    }

    txt.textContent = n.toString();
    elContents.appendChild(txt);
}

function findAllPrimesUpTo(num) {
    // fill list with numbers
    primes = [];

    const numbers = [...Array(num + 1).keys().map(x => x + 1)];

    numbers[0] = 0; // 1 is not a prime number;
    for (let i = 2; i <= num; i++) {
        let j = i * i;
        if (numbers[i - 1] !== 0) {
            primes.push(i);
            while (j <= num) {
                numbers[j - 1] = 0;
                j = j + i;
            }
        }
    }
}

