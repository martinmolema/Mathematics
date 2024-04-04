/*
window.onload = function () {
    setup();
}
*/

let elContents;
let board;
let boardWidth = 8;
let nrOfIterations = 0;
let solution = [];

let nrOfSolutions = 0;

const MAX_NR_OF_SOLUTIONS = 6;
const EMPTY_CELL = -1;
const SVG_NS = "http://www.w3.org/2000/svg";
/*
 * +---+---+---+---+---+---+---+---+---+
 * |   |   |   |   |   |   |   |   |   |
 * +---+---+---+---+---+---+---+---+---+
 * |   |   | F |   | G |   |   |   |   |
 * +---+---+---+---+---+---+---+---+---+
 * |   | E |   |   |   | H |   |   |   |
 * +---+---+---+---+---+---+---+---+---+
 * |   |   |   | K |   |   |   |   |   |
 * +---+---+---+---+---+---+---+---+---+
 * |   | D |   |   |   | A |   |   |   |
 * +---+---+---+---+---+---+---+---+---+
 * |   |   | C |   |  B|   |   |   |   |
 * +---+---+---+---+---+---+---+---+---+
 * |   |   |   |   |   |   |   |   |   |
 * +---+---+---+---+---+---+---+---+---+
 *
 */
const possibleJumps = [
    [+2, +1], // A
    [+1, +2], // B
    [-1, +2], // C
    [-2, +1], // D
    [-2, -1], // E
    [-1, -2], // F
    [+1, -2], // G
    [+2, -1], // H
];


setup();


function setup() {

    elContents = document.getElementById("contents");
    elContents.innerHTML = '';

    /*    for(let x = 0; x < boardWidth; x++ ){
            for(let y = 0; y < boardWidth; y++) {

            }
        }*/
    initBoard();
    const x = 0;
    const y = 0;
    assignValueToPosition(x, y, 0);
    solution.push({x: 0, y: 0});
    if (searchTour(x, y, 1)) {
    } else {
        console.log(`No solution for (${x},${y})`);
    }

}

function initBoard() {
    // an array of arrays; first index is rows/Y , second index = col/X
    board = Array.from({length: boardWidth}, () =>
        Array.from({length: boardWidth}, () => EMPTY_CELL)
    );

}

function searchTour(knightX, knightY, moveNr) {
    if (moveNr === boardWidth * boardWidth) {
        console.log(`new solution : ${nrOfIterations} iterations`);
        drawBoardConsole(board);
        console.log(solution);
        addNewBoardToHTML(board);
        nrOfSolutions++;
        return nrOfSolutions === MAX_NR_OF_SOLUTIONS;
    }

    for (let j = 0; j < possibleJumps.length; j++) {
        const jump = possibleJumps[j];
        const newKnightX = knightX + jump[0];
        const newKnightY = knightY + jump[1];

        if (isValidJump(newKnightX, newKnightY)) {

            // block place on board by setting the value of that position to non-zero
            assignValueToPosition(newKnightX, newKnightY, moveNr);

            solution.push({x: newKnightX, y: newKnightY});

            // recursively search next step
            nrOfIterations++;
            if (searchTour(newKnightX, newKnightY, moveNr + 1)) {

                return true;
            } else {
                //restore old situation
                makeCellEmpty(newKnightX, newKnightY);
            }
            solution.pop();

        }
    }
    return false;
}

function assignValueToPosition(x, y, value) {
    board[x][y] = value;
}

function boardValue(x, y) {
    return board[x][y];
}

function makeCellEmpty(x, y) {
    assignValueToPosition(x, y, EMPTY_CELL);
}


function isValidJump(x, y) {
    return (x >= 0) &&
        (x < boardWidth) &&
        (y >= 0) &&
        (y < boardWidth) &&
        (boardValue(x, y) === EMPTY_CELL); // this MUST be last otherwise index out of bounds
}

function addNewBoardToHTML(board) {
    const svg = document.createElementNS(SVG_NS, "svg");
    elContents.appendChild(svg);
    const width = 400;
    const height = 400;
    const cellWidth = width / boardWidth;
    const cellHeight = height / boardWidth;

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0,0,${width},${height}`);

    elContents.appendChild(svg);


    for (let col = 0; col < boardWidth; col++) {
        for (let row = 0; row < boardWidth; row++) {
            const value = board[row][col];
            const rect = document.createElementNS(SVG_NS, "rect");
            const x = row * cellWidth;
            const y = col * cellHeight;
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', cellWidth);
            rect.setAttribute('height', cellHeight);
            rect.classList.add("cell");
            svg.appendChild(rect);

            const txt = document.createElementNS(SVG_NS, "text");
            txt.setAttribute('x', x + cellWidth / 2);
            txt.setAttribute('y', y + cellHeight / 3);
            txt.textContent = value.toString();
            txt.classList.add("cell");
            txt.classList.add("value");

            svg.appendChild(txt);

        }
    }
    const polygon = document.createElementNS(SVG_NS, 'polyline');
    const points = solution.map(p => `${p.x * cellWidth + cellWidth / 2},${p.y * cellHeight + cellHeight / 2}`).join(' ');
    let lengthOfPolygon = 0;
    let px = solution[0].x;
    let py = solution[0].y;
    for (let i = 1; i < solution.length; i++) {
        const distX = (solution[i].x - px) * cellWidth;
        const distY = (solution[i].y - py) * cellHeight;

        lengthOfPolygon += Math.sqrt(distX * distX + distY * distY);
        px = solution[i].x;
        py = solution[i].y;
    }

    polygon.setAttribute('points', points);
    polygon.setAttribute('stroke-dasharray', `${lengthOfPolygon}`);
    polygon.setAttribute('stroke-dashoffset', `${lengthOfPolygon}`);
    polygon.classList.add('path');

    svg.appendChild(polygon);
}

function drawBoardConsole(board) {
    console.log(`--------------------------`);
    for (let row = 0; row < boardWidth; row++) {
        const line = board[row].map(x => x.toString().padStart(4, ' ')).join(' ');
        console.log(line);
    }

}
