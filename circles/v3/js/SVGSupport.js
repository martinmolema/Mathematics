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

    createPolyline(classname) {
        const polyline = this.createElement("polyline");
        this.svg.appendChild(polyline);
        polyline.setAttribute("class", classname);
        return polyline;
    }

    createPolygon(classname, cssColor) {
        const polygone = this.createElement("polygon");
        this.svg.appendChild(polygone);
        polygone.setAttribute("class", classname);
        polygone.setAttribute("fill", cssColor);
        polygone.setAttribute("stroke", cssColor);
        return polygone;
    }

    drawSVGCircle(cx, cy, r, className,  cssFillColor) {
        const circle = this.createElement("circle");

        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("class", className);
        circle.setAttribute("fill", cssFillColor);
        circle.setAttribute("stroke", cssFillColor);

        this.svg.appendChild(circle);
        return circle;
    }

    drawSVGLine(x1, y1, x2, y2, className, cssFillColor) {
        const line = this.createElement("line");

        line.setAttribute("x1", x1);
        line.setAttribute("x2", x2);
        line.setAttribute("y1", y1);
        line.setAttribute("y2", y2);
        line.setAttribute("class", className);
        line.setAttribute("stroke", cssFillColor);

        this.svg.appendChild(line);
        return line;
    }


} // class SVGSupport
