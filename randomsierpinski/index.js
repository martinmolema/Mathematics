class Point {
    x;
    y;

    constructor(x, y) {
        this.x =  Math.trunc(x);
        this.y = Math.trunc(y);
    }
}

class Corner {
    point;
    randomNumbers;

    /**
     *
     * @param point Point
     * @param randomNumbers Array of integers
     */
    constructor(point, randomNumbers) {
        this.point = point;
        this.randomNumbers = randomNumbers;
    }
}


window.onload = function(){
    setup();
}

let elCanvas;
let canvas;
let width;
let height;
let nrOfCorners = 3;
let divider = 2;
let corners = [];
let nrOfFacesOnDie;

const pixelSizeX = 1;
const pixelSizeY = 1;

let nrOfRandomPoints = 100000;

function setup() {
    elCanvas = document.getElementById("contents");
    const elNrOfCorners = document.querySelector('input[name="corners"]');
    const elDivider = document.querySelector('input[name="divider"]');
    const elIterations = document.querySelector('input[name="iterations"]');

    nrOfCorners = parseInt(elNrOfCorners.value);
    divider = parseFloat(elDivider.value);
    nrOfRandomPoints = parseInt(elIterations.value);

    canvas = elCanvas.getContext("2d");
    width = elCanvas.width;
    height = elCanvas.height;

    document.getElementById("settings").addEventListener("submit", handleSubmit);

    canvas.clearRect(0,0,width, height);

    calculateCorners();
    drawCorners();

    canvas.fillStyle="transparent";
    canvas.strokeStyle="red";
    canvas.beginPath();
    canvas.ellipse(width / 2, height / 2, width/2, height/2, 0 , Math.PI * 2, false );
    canvas.stroke();
}

function handleSubmit(event){
    event.stopPropagation();
    event.preventDefault();
    setup();
    drawPoints();
}



function calculateCorners(){
    corners = [];
    const radius = width / 2;
    const angle = (Math.PI * 2) / nrOfCorners;
    for(let p = 0; p< nrOfCorners; p++ ) {
        const thisAngle = p * angle;
        const x = Math.cos(thisAngle - Math.PI / 2) * radius + width / 2 ;
        const y = Math.sin(thisAngle - Math.PI / 2) * radius + height / 2 ;
        corners.push(new Corner(new Point(x,y),[p+1]));
    }

    nrOfFacesOnDie = nrOfCorners;
/*

    switch (nrOfCorners){
        case 3:
            corners.push(new Corner(new Point(width / 2, paddingY),[1,2]));
            corners.push(new Corner(new Point(paddingX, height - paddingY),[3,4]));
            corners.push(new Corner(new Point(width-paddingX, height - paddingY),[5,6]));
            nrOfFacesOnDie = 6;
            break;
        case 4:
            corners.push(new Corner(new Point(paddingX, paddingY),[1,2]));
            corners.push(new Corner(new Point(width - paddingX, paddingY),[3,4]));
            corners.push(new Corner(new Point(paddingX, height - paddingY),[5,6]));
            corners.push(new Corner(new Point(width-paddingX, height - paddingY),[7,8]));
            nrOfFacesOnDie = 8;
            break;

        default:
            break;
    }
*/
}

function drawCorners() {
    canvas.beginPath();
    canvas.moveTo(corners[0].x, corners[0].y);
    corners.map(c => c.point).forEach(point => {
        drawOnePixel(point.x, point.y, "black");
        canvas.lineTo(point.x, point.y);
    });
    canvas.closePath();
    canvas.strokeStyle = "black";
    canvas.stroke();

}

function drawOnePixel(x,y, color) {
    canvas.fillStyle = color;
    canvas.fillRect(x - pixelSizeX / 2 , y - pixelSizeY / 2, pixelSizeX, pixelSizeY )
}

function drawPoints(){
    // source: https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point

    const currentPoint = new Point(width /2, height /2);
    canvas.moveTo(currentPoint.x, currentPoint.y);

    for (let i = 0; i< nrOfRandomPoints; i++){
        const rnd = getRandomNumber();
        const corner = corners.find(c => c.randomNumbers.includes(rnd));

        const x0 = currentPoint.x;
        const x1 = corner.point.x;
        const y0 = currentPoint.y;
        const y1 = corner.point.y;

        const t = 1 / divider;

        const newX = ( 1 - t) * x1 + t * x0;
        const newY = ( 1 - t) * y1 + t * y0;

        currentPoint.x = newX;
        currentPoint.y = newY;

        drawOnePixel(newX, newY, "blue");
    }
}


function getRandomNumber() {
    return Math.floor(Math.random() * nrOfFacesOnDie) + 1;
}