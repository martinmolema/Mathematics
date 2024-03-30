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
let elPrimefactors;

let width, height, nrOfItems;

let primes;

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
    elPrimefactors = document.getElementById("primefactors");

    document.getElementById("settings").addEventListener("submit", handleSubmit);
    document.getElementById("settings").addEventListener("submit", handleSubmit);
    elBtnNextValue.addEventListener("click", StartIteration);
    elBtnStop.addEventListener("click", StopIteration);
    elBtnReset.addEventListener("click", ResetFieldValues);

    console.log(elNrOfItems, elHeight.value, elHeight.value, elContents);
    ResetFieldValues();

    findAllPrimesUpTo(nrOfItems)
}

function handleSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    ResetFieldValues();
    findAllPrimesUpTo(elNrOfItems)
}

function ResetFieldValues() {
    elContents.innerHTML = '';
    nrOfItems = parseInt(elNrOfItems.value);
    width = parseInt(elWidth.value);
    height = (nrOfItems / width);
    elHeight.value = parseInt(height);

    console.log(nrOfItems, width, height);

    ResetField();
    elContents.addEventListener('animationend', (event) => {
        const element = event.target;
        element.classList.remove('currentlyChanging');
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
    elPrimefactors.textContent = determinePrimeFactorsForNumber(counter).join(" x ")

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

/* Use sif to find all primes up to the number of items given */
function findAllPrimesUpTo(num) {
    // fill list with numbers
    const numbers = [...Array(num + 1).keys().map(x => x + 1)];
    numbers[0] = 0; // 1 is not a prime number;
    for (let i = 2; i <= num; i++) {
        let j = i * i;
        while (j <= num) {
            numbers[j - 1] = 0;
            j = j + i;
        }
    }
    primes = numbers.filter(x => x !== 0);
}

function isPrime(num) {
    return primes.findIndex(x => x === num) !== -1;
}

function determinePrimeFactorsForNumber(num) {
    const originalNumber = num;
    const factors = [];
    const halfway = (num % 2) === 0 ? (num / 2) : (num / 2) + 1;
    const numberOfPrimes = primes.length;

    if (isPrime(num)) {
        factors.push(num);
        factors.push(1);
    } else {
        let primeIndex = 0;
        while (primeIndex < numberOfPrimes && num !== 1) {
            let prime = primes[primeIndex];
            if (num % prime === 0) {
                // one factor is the prime found
                factors.push(prime);

                num = num / prime;

                primeIndex = 0;
            }
            else {
                primeIndex++;
            }
        }
        factors.push(1);
    }

    console.log(originalNumber, factors.join("x"))
    return factors;
}