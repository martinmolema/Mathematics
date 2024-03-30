window.onload = function () {
    setup();
}

let elWidth;
let elHeight;
let elContents;
let elNrOfItems;
let elCounter;
let elBtnNextValue;
let elBtnReset;
let elBtnStop;
let timer;
let elIterationSpeed;

let width, height, nrOfItems;

function setup() {
    elNrOfItems = document.querySelectorAll("input[name='nrOfItems']")[0];
    elWidth = document.querySelectorAll("input[name='width']")[0];
    elHeight = document.querySelectorAll("input[name='height']")[0];
    elIterationSpeed = document.querySelectorAll("input[name='iterationSpeed']")[0];

    elContents = document.getElementById("contents");
    elCounter = document.querySelectorAll("input[name='counter']")[0];
    elBtnNextValue = document.getElementById("startIteration");
    elBtnReset = document.getElementById("reset");
    elBtnStop = document.getElementById("stop");

    document.getElementById("settings").addEventListener("submit", handleSubmit);
    elBtnNextValue.addEventListener("click", StartIteration);
    elBtnStop.addEventListener("click", StopIteration);
    elBtnReset.addEventListener("click", ResetFieldValues);

    console.log(elNrOfItems, elHeight.value, elHeight.value, elContents);
    ResetFieldValues();
}

function handleSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    ResetFieldValues();
}

function ResetFieldValues() {
    elContents.innerHTML = '';
    nrOfItems = elNrOfItems.value;
    width = elWidth.value;
    height = (nrOfItems / width);
    elHeight.value = height;
    console.log(nrOfItems, width, height);
    ResetField();
    elContents.addEventListener('animationend', (event) => {
        const element = event.target;
        console.log(element.childNodes[0].textContent);
        element.classList.remove('currentlyChanging');
        console.log(element.classList);
    });
}

function ResetField() {
    elCounter.value = 2;
    let cellnr = 1;
    for (let y = 0; y < height; y++) {
        const row = document.createElement("TR");
        elContents.appendChild(row);

        for (let x = 0; x < width; x++) {
            if (cellnr <= nrOfItems) {
                const cell = document.createElement("TD");
                row.appendChild(cell);
                cell.innerHTML = `<p>${cellnr}</p>`;
                cell.dataset.number = cellnr;
                cell.dataset.nrOfChanges = 1;

                cellnr++;
            }
        }

    }
}

function StartIteration() {
    ResetFieldValues();
    const iterationSpeed = elIterationSpeed.value;

    elBtnNextValue.disabled = true;
    let nr = 2;
    timer = window.setInterval(() => {
        if (nr <= nrOfItems) {
            elCounter.value = nr;
            ProcessForNumber(nr, iterationSpeed);
            nr++;
        } else {
            window.clearInterval(timer);
            elBtnNextValue.disabled = false;
        }

    }, iterationSpeed);
}

function StopIteration() {
    window.clearInterval(timer);
    elBtnNextValue.disabled = false;

}


function ProcessForNumber(counter, iterationSpeed) {
    let items = document.querySelectorAll("TD");
    items.forEach(elTableCell => {
        const nr = elTableCell.dataset.number;

        if (nr % counter === 0) {
            elTableCell.classList.add('currentlyChanging');
            elTableCell.classList.toggle('invisible');

            elTableCell.dataset.nrOfChanges++;
            const nrOfChanges = elTableCell.dataset.nrOfChanges;

            elTableCell.innerHTML = `<p>${nr}</p><p>(${nrOfChanges})</p>`;

        }
    });
}