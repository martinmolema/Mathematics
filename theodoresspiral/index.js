window.onload = function () {
    setup();
}
const SVG_NS = "http://www.w3.org/2000/svg";
let elSVG = document.getElementById("contents");
const UNIT_IN_PIXEL = 1;

const ORIGIN_X = 400;
const ORIGIN_Y = 400;


class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

function setup() {
    let previousPoint = new Point(1, 0);
    for (let i = 1; i < 400; i++) {
        const polygon = document.createElementNS(SVG_NS, "polygon");

        // create an empty array that will be expanded to the set of points
        const points = [];

        // push Origin (0,0)
        points.push(new Point(0,0));

        // add the point from the previous iteration
        points.push(previousPoint);

        // now calculate the angle. fill an array with a range first
        const parts = Array.from(Array(i-1).keys());
        // now calculate a sum using the Reduce method to calculate the angles
        const angle = 2* Math.PI - parts.reduce((sumValue, currentValue) => sumValue + Math.atan(1 / Math.sqrt(currentValue)), 0);

        // calculate the radius: the Square Root of the current iteration
        const radius = Math.sqrt(i);

        // translate from Polar to Carthesian (https://www.mathcentre.ac.uk/resources/uploaded/mc-ty-polar-2009-1.pdf)
        let x = previousPoint.x + radius * Math.cos(angle);
        let y = previousPoint.y + radius * Math.sin(angle);

        // Add the point
        const newPoint = new Point(x, y);

        // put a small dot on the outer rim of the spiral for this iteration
        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("cx", ORIGIN_X + x * UNIT_IN_PIXEL);
        circle.setAttribute("cy", ORIGIN_Y + y * UNIT_IN_PIXEL);
        circle.setAttribute("r", 2);
        circle.classList.add('dot');
        elSVG.appendChild(circle);

        points.push(newPoint);

        previousPoint = newPoint;
        polygon.setAttribute('class', `segment nr_${i}`)
        polygon.setAttribute("points", points.map(m => `${ORIGIN_X + m.x * UNIT_IN_PIXEL},${ORIGIN_Y + m.y * UNIT_IN_PIXEL}`).join(' '));
        elSVG.appendChild(polygon);
    }
}