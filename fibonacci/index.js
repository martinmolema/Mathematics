"use strict";

window.onload = () => {
    setup();
    draw();
}
const SVG_NS = "http://www.w3.org/2000/svg";

let elBlocks;
let elSpiral;
let elCanvas;

let svgWidth;
let svgHeight;

let ORIGIN_X;
let ORIGIN_Y;

let scaleFactor = 11;

let nrOfIterations = 13;

function setup() {
    elCanvas = document.getElementById('canvas');
    elBlocks = document.getElementById('blocks');
    elSpiral = document.getElementById('spiral');

    svgWidth = elCanvas.width.baseVal.value;
    svgHeight = elCanvas.height.baseVal.value;

    ORIGIN_X = 1950;
    ORIGIN_Y = 1200;
}

function draw() {
    let currentValue = 1;
    let previousValue = 1;
    let secondPreviousValue = 0;
    let cycle = 0; // 0 = Right side, 1 = Top side, 2 = left side, 3 = below

    let x = 0;
    let y = 0;

    drawRect(x, y, 1, 1);

    for (let i = 1; i <= nrOfIterations; i++) {
        switch (cycle) {
            case 0:
                x += previousValue;
                y -= secondPreviousValue;
                break;
            case 1:
                y -= currentValue;
                x -= secondPreviousValue;
                break;
            case 2:
                x -= currentValue;
                break;
            case 3:
                y += previousValue;
                break;
        }

        drawRect(x, y, currentValue, i);
        drawSpiralPart(x, y, currentValue, cycle);

        cycle++;
        cycle = cycle % 4;

        console.log(currentValue);

        secondPreviousValue = previousValue;
        previousValue = currentValue;
        currentValue = previousValue + secondPreviousValue;
    }
}

function drawRect(x, y, num, iteration) {

    let rx = ORIGIN_X + scaleFactor * x;
    let ry = ORIGIN_Y + scaleFactor * y;

    let width = num * scaleFactor;
    let height = num * scaleFactor;

    const colorNr = (iteration / nrOfIterations) * 360;
    const color = `hsl(${colorNr}, 100%, 50%)`;

    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute('x', rx);
    rect.setAttribute('y', ry);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', color);
    rect.setAttribute('fill-opacity', '0.5');
    rect.classList.add("block");
    elBlocks.appendChild(rect);

    const txt = document.createElementNS(SVG_NS, 'text');
    txt.setAttribute('x', rx + (width / 2));
    txt.setAttribute('y', ry + (height / 2) + num /2);
    txt.setAttribute('font-size', `${num}pt`);

    txt.textContent = num.toString();
    elBlocks.appendChild(txt);
}

/**
 *
 * @param x {number} x position in math-space, relative to Origin (x)
 * @param y {number} y position in math-space, relative to Origin (y)
 * @param num {number} the size of the current square / fibonacci value
 * @param cycle {number} 0 = Right side, 1 = Top side, 2 = left side, 3 = below
 */
function drawSpiralPart(x, y, num, cycle) {
    let x1 = ORIGIN_X + scaleFactor * x;
    let y1 = ORIGIN_Y + scaleFactor * y;
    let x2 = x1 + num * scaleFactor;
    let y2 = y1 + num * scaleFactor;

    let arcCommands = "";
    let move1;
    let lineTo;

    switch (cycle) {
        case 0:
            move1 = `M${x1},${y2}`; // arc starts bottom left corner; arc ends at top right corner
            lineTo = `Q ${x2},${y2}  ${x2},${y1} `;
            break;
        case 1:
            move1 = `M${x2},${y2}`; // arc starts bottom right corner; arc ends at top left corner
            lineTo = `Q${x2},${y1} ${x1},${y1}`;
            break;
        case 2:
            move1 = `M${x2},${y1}`; // arc starts top right corner; arc ends at bottom left corner
            lineTo = `Q ${x1},${y1} ${x1},${y2}`;
            break;
        case 3:
            move1 = `M${x1},${y1}`; // arc starts at top left corner; arc ends at bottom right corner
            lineTo = `Q${x1},${y2} ${x2},${y2}`;
            break;
    }

    arcCommands = `${arcCommands} ${move1} ${lineTo}`;
    const arc = document.createElementNS(SVG_NS, "path");
    arc.setAttribute('d', arcCommands);
    arc.classList.add("spiral");
    elSpiral.appendChild(arc);
}