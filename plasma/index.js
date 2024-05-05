let elCanvas;
let ctx;
let elSliderColorOffset;

let canvasWidth;
let canvasHeight;
let epsilon;
let halfSize;
let matrix;
let colorNrOffset = 0;

window.onload = function () {
    setup();
    draw();

}


function setup() {
    elCanvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    elSliderColorOffset = document.getElementById("sliderColorOffset");

    document.getElementById("inputs").addEventListener("input", handleInputChanges);

    canvasHeight = elCanvas.height;
    canvasWidth = elCanvas.width;
    epsilon = 0.1 / canvasHeight;
    halfSize = canvasWidth / 2;
    initBoard();
}

function initBoard() {
    // an array of arrays; first index is rows/Y , second index = col/X
    matrix = Array.from({length: canvasHeight}, () =>
        Array.from({length: canvasWidth}, () => 0)
    );

}
function handleInputChanges(){
    colorNrOffset = parseInt(elSliderColorOffset.value);
    convertMatrixToImage(colorNrOffset);
}


function draw() {
    const c1 = Math.random();
    const c2 = Math.random();
    const c3 = Math.random();
    const c4 = Math.random();
    const stddev = 1.0;

    plasma(0.5, 0.5, 0.5, stddev, c1, c2, c3, c4);
    convertMatrixToImage(0);
}

function convertMatrixToImage(colorOffset){

    /**
     * @type {ImageData}
     */
    const completeImage = ctx.createImageData(canvasWidth, canvasHeight);
    /**
     * @type {Uint8ClampedArray}
     */
    const imageRGBValues = completeImage.data;

    for(let y=0; y<canvasHeight; y++) {
        for (let x=0; x<canvasWidth; x++) {
            const colorNr = (((matrix[y][x]) * 100 + colorNrOffset) % 100) / 100;

            const color = hslToRgb(colorNr, 1, 0.30);
            let array_index = (y * canvasWidth * 4 + x * 4);
            imageRGBValues[array_index + 0] = color[0];
            imageRGBValues[array_index + 1] = color[1];
            imageRGBValues[array_index + 2] = color[2];
            imageRGBValues[array_index + 3] = 255; // 255 = full opacity
        }
    }
    ctx.putImageData(
        completeImage,
        0, 0,
        0, 0,
        canvasWidth,canvasHeight
    );
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1/3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}


function plasma(x, y, size, stddev, c1, c2, c3, c4) {
    if (size <= epsilon) {
        return
    }
    // calculate new color of midpoint using random displacement
    const displacement = (Math.random() - 0.5) * stddev;
    const cM = (c1 + c2 + c3 + c4) / 4.0 + displacement;

    // draw a colored square
    const px = Math.trunc(x * canvasWidth);
    const py = Math.trunc(y * canvasHeight);
    matrix[px][py] = cM;

    const cT = (c1 + c2) / 2.0;    // top
    const cB = (c3 + c4) / 2.0;    // bottom
    const cL = (c1 + c3) / 2.0;    // left
    const cR = (c2 + c4) / 2.0;    // right


    plasma(x - size / 2, y - size / 2, size / 2, stddev / 2, cL, cM, c3, cB);
    plasma(x + size / 2, y - size / 2, size / 2, stddev / 2, cM, cR, cB, c4);
    plasma(x - size / 2, y + size / 2, size / 2, stddev / 2, c1, cT, cL, cM);
    plasma(x + size / 2, y + size / 2, size / 2, stddev / 2, cT, c2, cM, cR);
}
