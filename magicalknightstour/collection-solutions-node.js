
let board;
let boardWidth = 8;
let solution = [];

let nrOfSolutions = 0;

const MAX_NR_OF_SOLUTIONS = 100;
const EMPTY_CELL = -1;
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
        console.log(JSON.stringify(board));
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
