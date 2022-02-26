export class SVGSupport {

    constructor(svgElement) {
        this.svg = svgElement;
    }// constructor

    setSize(width, height) {
        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);
    }

    createElement(tagName) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName);
    }

    drawSVGCircle(cx, cy, r, className) {
        const circle = this.createElement("circle");

        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("class", className);

        this.svg.appendChild(circle);
        return circle;
    }

    drawSVGLine(x1, y1, x2, y2, className) {
        const line = this.createElement("line");

        line.setAttribute("x1", x1);
        line.setAttribute("x2", x2);
        line.setAttribute("y1", y1);
        line.setAttribute("y2", y2);
        line.setAttribute("class", className);

        this.svg.appendChild(line);
    }


} // class SVGSupport
