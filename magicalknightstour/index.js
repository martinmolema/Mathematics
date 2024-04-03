
/*
window.onload = function () {
    setup();
}
*/

let elBoard;
let board;
let boardWidth = 8;
let nrOfIterations = 0;

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
    [ + 2,  + 1], // A
    [ + 1,  + 2], // B
    [ - 1,  + 2], // C
    [ - 2,  + 1], // D
    [ - 2,  - 1], // E
    [ - 1,  - 2], // F
    [ + 1,  - 2], // G
    [ + 2,  - 1], // H
];


setup();


function setup() {
    // an array of arrays; first index is rows/Y , second index = col/X
    board = Array.from({length: boardWidth}, () =>
        Array.from({length: boardWidth}, () => EMPTY_CELL)
    );

    console.log(board.length, board[0].length);
    // elBoard = document.getElementById("contents");
    // createBoard();

    assignValueToPosition(0,0, 1);
    searchTour(0, 0, 1);
    console.log(`Solution: ${nrOfIterations}`)
    console.log(`--------------------------------------------------------------`);
    drawBoardConsole(board);
    drawBoardHTML(board);
    console.log(`--------------------------------------------------------------`);
}

function searchTour(knightX, knightY, moveNr) {
    if (moveNr === boardWidth * boardWidth) {
        console.log(`new solution : ${nrOfIterations} iterations`);
        return true;
    }

    possibleJumps.forEach(jump => {
        const newKnightX = knightX + jump[0];
        const newKnightY = knightY + jump[1];

        if (isValidJump(newKnightX, newKnightY)) {

            // block place on board by setting the value of that position to non-zero
            assignValueToPosition(newKnightX, newKnightY, moveNr);

            // recursively search next step
            nrOfIterations++;
            if (nrOfIterations % 1000000 == 0) {
                console.clear();
                console.log(Intl.NumberFormat().format(nrOfIterations), moveNr);
                drawBoardConsole(board);
            }
            if (searchTour(newKnightX, newKnightY, moveNr + 1) ){
                return true;
            }
            else {
                //restore old situation
                makeCellEmpty(newKnightX, newKnightY);
            }

        }
    });
    return false;
}

function assignValueToPosition(x, y, value) {
    board[y][x] = value;
}

function boardValue(x, y) {
    return board[y][x];
}

function makeCellEmpty(x, y) {
    assignValueToPosition(x,y,EMPTY_CELL);
}



function isValidJump(x, y) {
    return (x >= 0) &&
        (x < boardWidth) &&
        (y >= 0) &&
        (y < boardWidth) &&
        (boardValue(x,y) === EMPTY_CELL); // this MUST be last otherwise index out of bounds
}

function createBoard() {
    elBoard.innerHTML = '';
    for (let row = 0; row < boardWidth; row++) {
        const elRow = document.createElement("tr");
        elBoard.appendChild(elRow);

        for (let col = 0; col < boardWidth; col++) {
            const elCol = document.createElement("td");
            elCol.innerHTML = '-';
            elCol.dataset.col = col;
            elCol.dataset.row = row;
            elRow.appendChild(elCol);
        }
    }
}

function drawBoardHTML(board) {
    for (let row = 0; row < boardWidth; row++) {
        const elRow = elBoard.querySelector(`TR:nth-of-type(${row + 1})`);

        for (let col = 0; col < boardWidth; col++) {
            const elCell = elRow.querySelector(`TD:nth-of-type(${col + 1})`);
            elCell.textContent = board[row][col];
        }
    }
}

function drawBoardConsole(board) {
    console.log(`--------------------------`);
    for (let row = 0; row < boardWidth; row++) {
        const line = board[row].map(x => x.toString().padStart(4, ' ')).join(' ');
        console.log(line);
    }

}
