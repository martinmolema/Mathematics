window.onload = () => {
    setup();
}

const SVG_NS = "http://www.w3.org/2000/svg";
let nrOfIterations = 200000;
let svgWidth;
let svgHeight;

let scale = 1;

let elSvgCanvas;
let elContents;
let elZoomValueSlider;
let elCheckboxFixedColor;
let elSpanNrOfPrimes;
let elSpanNrOfPointsFound;

let fixedColor = false;

// the location of the origin.
let ORIGIN_X = 0;
let ORIGIN_Y = 0;
let drawingSpaceMargin = 10;

let primes;


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
    elContents = document.getElementById("contents");
    elSpanNrOfPointsFound = document.getElementById("nrOfPoints");
    elSpanNrOfPrimes = document.getElementById("nrOfPrimes");

    elZoomValueSlider = document.getElementById("zoomValue");
    elCheckboxFixedColor = document.querySelector("input[name='fixedColor']")

    document.getElementById('inputs').addEventListener('input', () => {
        fixedColor = elCheckboxFixedColor.checked;
        const zoomFactor = elZoomValueSlider.value;
        scale = 1 / zoomFactor;
        draw();

    });

    svgWidth = elSvgCanvas.width.baseVal.value - 2 * drawingSpaceMargin;
    svgHeight = elSvgCanvas.height.baseVal.value - 2 * drawingSpaceMargin;

    ORIGIN_X = drawingSpaceMargin + svgWidth / 2;
    ORIGIN_Y = drawingSpaceMargin + svgHeight / 2;

    findAllPrimesUpTo(nrOfIterations);

    draw();
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
    elSpanNrOfPrimes.textContent = primes.length.toLocaleString();
}


function draw() {
    elContents.innerHTML = '';
    const nrOfPrimes = primes.length;

    const points = [];

    for (let i = 0; i < nrOfPrimes; i++) {
        const radius = primes[i];

        const x = ORIGIN_X + Math.cos(radius) * radius * scale;
        const y = ORIGIN_Y + Math.sin(radius) * radius * scale;

        if (Math.abs(x) < svgWidth && Math.abs(y) < svgHeight) {
            points.push(new Point(x, y));
        }
    }
    const nrOfPointsFound = points.length;
    elSpanNrOfPointsFound.textContent = nrOfPointsFound.toLocaleString();

    points.forEach((p, index, array) => {

        let color= fixedColor ? 'black' : `hsl(${index/nrOfPointsFound * 360},80%,50%`;
        const dot = document.createElementNS(SVG_NS, 'circle');
        dot.setAttribute('cx', p.x);
        dot.setAttribute('cy', p.y);
        dot.setAttribute('r', 2);
        dot.setAttribute('fill', color);
        dot.classList.add('dot');

        elContents.appendChild(dot);
    });
}