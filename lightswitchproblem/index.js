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
    ResetFieldValues();

}

function handleSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    ResetFieldValues();
}

function ResetFieldValues() {
    elContents.innerHTML = '';
    nrOfItems = parseInt(elNrOfItems.value);
    width = parseInt(elWidth.value);
    height = (nrOfItems / width);
    elHeight.value = parseInt(height);

    console.log(nrOfItems, width, height);
    findAllPrimesUpTo(nrOfItems);
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

                if (isPrime(cellnr)){
                    cell.classList.add('isPrime');
                    cell.innerHTML = "<p class='prime-indicator'>*</p>"
                }
                else{
                    cell.innerHTML = "<p class='prime-indicator'>&nbsp;</p>"
                }

                cell.innerHTML += `<p class="light-number">${cellnr}</p>`;
                cell.innerHTML += `<p class="nrOfChanges">(0)</p>`;
                cell.dataset.number = cellnr.toString();
                cell.dataset.nrOfChanges = '1';
                cellnr++;
            }
        }

    }
}

function StartIteration() {
    ResetFieldValues();
    const iterationSpeed = elIterationSpeed.value;
    elPrimefactors.innerHTML = '';

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


function ProcessForNumber(counter) {
    const factors = determinePrimeFactorsForNumber(counter);

    const uniqueFactors = factors.filter((value, index, array) => array.indexOf(value) === index);
    let html = [];
    let totalFactors = 1;

    uniqueFactors.forEach(value => {
        const repeatingFactor = factors.filter(x => x === value).length;
        totalFactors *= (repeatingFactor + 1);

        html.push(`<mrow><msup><mn class="factor">${value}</mn><mn class="power">${repeatingFactor}</mn></msup></mrow>`);
    });

    const isEven = totalFactors % 2 === 0;

    elPrimefactors.innerHTML += `<tr class="${isEven ? 'even' : 'odd'}">`
        + `<td class="number isNumber">${counter}</td>`
        + `<td class="isPrime">${isPrime(counter) ? "Y" : ""}</td>`
        + `<td class="factors"><math>` + html.join('<mo>x</mo>') + `</math></td>`
        + `<td class="factors-count isNumber" >${totalFactors}</td>`
        + `<td class="odd-even" >${isEven ? "Even" : "Odd"}</td>`
        + `<td class="sqrt isNumber" >${(!isEven) ? Math.sqrt(counter) : ""}</td>`
        + `</tr>`
    ;

    let items = document.querySelectorAll("TD");
    items.forEach(elTableCell => {
        const nr = elTableCell.dataset.number;

        if (nr % counter === 0) {
            elTableCell.classList.add('currentlyChanging');
            elTableCell.classList.toggle('invisible');

            elTableCell.dataset.nrOfChanges++;
            const nrOfChanges = elTableCell.dataset.nrOfChanges;

            elTableCell.querySelector('p.light-number').textContent = nr.toString();
            elTableCell.querySelector('p.nrOfChanges').textContent = `(${nrOfChanges.toString()})`;
        }
    });
}

/* Use sif to find all primes up to the number of items given */
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
    console.log(primes);
}

function isPrime(num) {
    return primes.findIndex(x => x === num) !== -1;
}

function determinePrimeFactorsForNumber(num) {
    const originalNumber = num;
    const factors = [];
    const numberOfPrimes = primes.length;

    if (isPrime(num)) {
        factors.push(num);
    } else {
        let primeIndex = 0;
        while (primeIndex < numberOfPrimes && num !== 1) {
            let prime = primes[primeIndex];
            if (num % prime === 0) {
                // one factor is the prime found
                factors.push(prime);

                num = num / prime;

                primeIndex = 0;
            } else {
                primeIndex++;
            }
        }
    }

    console.log(originalNumber, factors.join("x"))
    return factors;
}