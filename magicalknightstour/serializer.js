const SVG_NS = "http://www.w3.org/2000/svg";
let boardWidth = 8;
const boards = [];
let elContents;
let elIterationNr;

window.onload = function () {
    setup();
}


function setup() {
    elContents = document.getElementById("contents");
    elIterationNr = document.getElementById("iteration");

    const xhr = new XMLHttpRequest();
    const url = window.location.protocol + '//' + window.location.host + '/magicalknightstour/8x8-0,0.solutions.json';
    xhr.onload = (event /* ProgressEvent */) => {
        const lines = xhr.response.split('\n');

        lines.forEach(value => {
            value = value.trim();
            if (value !== '') {
                boards.push(JSON.parse(value));
            }
        });
        console.log(`lines.length = ${lines.length}`);
        drawBoardsOnInterval();
    };
    xhr.open('GET', url);
    xhr.send();
}

function drawBoardsOnInterval() {
    boardWidth = boards[0].length;

    let idx = 0;
    setInterval(() => {
        addNewBoardToHTML(boards[idx++], idx);
    }, 5);

}


function addNewBoardToHTML(board, idx) {
    // elContents.innerHTML = '';
    elIterationNr.textContent = idx.toLocaleString();
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    const svg = document.createElementNS(SVG_NS, "svg");

    div.className = "board";
    h1.textContent = idx.toLocaleString();
    div.appendChild(h1);
    div.appendChild(svg);

    elContents.appendChild(div);

    const width = 400;
    const height = 400;
    const cellWidth = width / (boardWidth + 1);
    const cellHeight = height / (boardWidth + 1);

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0,0,${width},${height}`);

    const solution = Array.from(Array(boardWidth * boardWidth).keys());
    for (let rowNr = 0; rowNr < boardWidth; rowNr++) {
        for (let colNr = 0; colNr < boardWidth; colNr++) {
            const val = board[rowNr][colNr];
            solution[val] = {x: rowNr, y: colNr};
        }
    }

    let sumrow = 0;
    for (let row = 0; row < boardWidth; row++) {
        sumrow = 0;
        for (let col = 0; col < boardWidth; col++) {
            const value = board[col][row];
            const rect = document.createElementNS(SVG_NS, "rect");
            const x = col * cellWidth;
            const y = row * cellHeight;
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

            sumrow += value;
        }
        const txt = document.createElementNS(SVG_NS, "text");
        txt.setAttribute('x', (boardWidth) * cellWidth + cellWidth / 2);
        txt.setAttribute('y', row * cellHeight + cellHeight / 3);
        txt.textContent = sumrow.toString();
        txt.classList.add("sum");
        txt.classList.add("value");
        svg.appendChild(txt);
    }
    for (let colnr = 0; colnr < boardWidth; colnr++) {
        const rowsum = board[colnr].reduce((accumulator, currentvalue) => accumulator += currentvalue, 0);
        const txt = document.createElementNS(SVG_NS, "text");
        txt.setAttribute('x', colnr * cellWidth + cellWidth / 2);
        txt.setAttribute('y', boardWidth * cellHeight + cellHeight / 2);
        txt.textContent = rowsum.toString();
        txt.classList.add("sum");
        txt.classList.add("value");
        svg.appendChild(txt);
    }

    const polygon = document.createElementNS(SVG_NS, 'polyline');
    const points = solution.map(p => `${p.x * cellWidth + cellWidth / 2},${p.y * cellHeight + cellHeight / 2}`).join(' ');
    polygon.setAttribute('points', points);
    polygon.classList.add('path');

    svg.appendChild(polygon);
}
