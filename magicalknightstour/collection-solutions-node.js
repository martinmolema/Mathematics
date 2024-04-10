
let board;
let boardWidth = 8;
let startPositionX = 0;
let startPositionY = 0;
let solution = [];

let nrOfSolutions = 0;

let MAX_NR_OF_SOLUTIONS = 1;
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
    // remove the NodeJS executable + script
    process.argv.splice(0, 2);
    process.argv.forEach(arg => process.stderr.write(`${arg} \n`));

    if (process.argv.length >= 1) {
        boardWidth = parseInt(process.argv[0]);
    }
    if (process.argv.length > 1) {
        startPositionX = parseInt(process.argv[1]);
        startPositionY = parseInt(process.argv[2]);
    }
    if (process.argv.length > 3) {
        MAX_NR_OF_SOLUTIONS = parseInt(process.argv[3]);
    }

    if (startPositionX < 0 || startPositionX > boardWidth-1 || startPositionY < 0 || startPositionY > boardWidth-1) {
        process.exit();
    }

    process.stderr.write(`Using board: ${boardWidth}x${boardWidth} | starting at (${startPositionX},${startPositionY}) | max # solutions: ${MAX_NR_OF_SOLUTIONS}\n`);

    initBoard();
    assignValueToPosition(startPositionX, startPositionY, 0);
    solution.push({x: startPositionX, y: startPositionY});
    if (searchTour(startPositionX, startPositionY, 1)) {
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
