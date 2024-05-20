import {Point} from './Point.js';
import {StackItem} from './StackItem.js';

export const SVG_NS = "http://www.w3.org/2000/svg";


export class LSystem {
    rules = [];
    vars = [];
    axiom = '';
    originX = 0;
    originY = 0;
    lineLength = 50;
    angle = 0;
    startingAngle = 90;
    formula = '';
    nrOfIterationsRequested = 0;
    elParent = undefined;
    rotationAngle = 0;
    stack = undefined;
    lastPosition = undefined;
    lineLengthMultiplier = 1;
    svgWidth = 0;
    svgHeight = 0;

    processedRules = [];

    constructor(elSVGParent, svgWidth, svgHeight) {
        this.elParent = elSVGParent;
        this.svgHeight = svgHeight;
        this.svgWidth = svgWidth;
    }

    setOrigin(x, y) {
        this.originX = x;
        this.originY = y;
    }

    setOriginLeftCenter(marginX, marginY) {
        this.originX = -this.svgWidth / 2 + marginX;
        this.originY = 0;
    }

    setOriginRightCenter(marginX, marginY) {
        this.originX = this.svgWidth / 2 - marginX;
        this.originY = 0;
    }

    setOriginBottomLeft(marginX, marginY) {
        this.originX = -this.svgWidth / 2 + marginX;
        this.originY = -this.svgHeight / 2 + marginY;
    }

    setOriginBottomRight(marginX, marginY) {
        this.originX = this.svgWidth / 2 - marginX;
        this.originY = -this.svgHeight / 2 + marginY;
    }

    setOriginTopLeft(marginX, marginY) {
        this.originX = -this.svgWidth / 2 + marginX;
        this.originY = this.svgHeight / 2 - marginY;
    }


    setOriginTopRight(marginX, marginY) {
        this.originX = this.svgWidth / 2 - marginX;
        this.originY = this.svgHeight / 2 - marginY;
    }

    addRule(rule) {
        this.rules.push(rule);
        this.processRules();
    }

    addVariable(variable) {
        this.vars.push(variable);
    }

    setAxiom(axiom) {
        this.axiom = axiom;
    }

    processRules() {
        this.processedRules = {};
        this.rules.forEach(rule => {
            const parts = rule.split('=');
            if (parts.length > 1) {
                const varname = parts[0].trim();
                const rulepart = parts[1].trim();

                this.processedRules[varname] = rulepart;
            }
        })
    }

    generate(nrOfIterations) {
        this.lastPosition = new Point(this.originX, this.originY);
        this.angle = this.startingAngle;
        this.stack = [];

        this.nrOfIterationsRequested = nrOfIterations;

        this.startGeneration(nrOfIterations, this.axiom, this.lineLength);
    }

    startGeneration(nrOfIterations, formula, lineLength) {
        if (nrOfIterations !== 0) {
            for (let char of formula) {

                if (this.processedRules[char] !== undefined) {
                    lineLength = this.processNonRuleCharFromFormula(char, lineLength);
                    const newFormula = this.processedRules[char];
                    this.startGeneration(nrOfIterations - 1, newFormula, lineLength);

                } else {
                    lineLength = this.processNonRuleCharFromFormula(char, lineLength);
                }
            }
        }
        return;
    }

    processNonRuleCharFromFormula(char, length) {

        switch (char) {
            case "F":
                this.lastPosition = this.drawLine(this.lastPosition, length);
                break;
            case "[":
                this.stack.push(new StackItem(this.angle, this.lastPosition))
                break;
            case "]":
                const item = this.stack.pop();
                this.lastPosition.x = item.position.x;
                this.lastPosition.y = item.position.y;
                this.angle = item.angle;
                break;
            case ">":
                length *= this.lineLengthMultiplier;
                break;
            case "+":
                this.turn(this.rotationAngle);
                break;
            case "-":
                this.turn(-this.rotationAngle);
                break;
        }

        return length;
    }

    drawLine(point1, length) {
        const newx = point1.x + Math.cos((this.angle / 180) * Math.PI) * length;
        const newy = point1.y + Math.sin((this.angle / 180) * Math.PI) * length;

        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", point1.x);
        line.setAttribute("y1", point1.y);
        line.setAttribute("x2", newx);
        line.setAttribute("y2", newy);
        // line.setAttribute("stroke-opacity", (iterationNr / nrOfIterationsRequested).toString());

        line.classList.add("shape");
        line.classList.add(`letter-${point1.letter}`);
        line.classList.add(`iteration-${point1.iterationNr}`);

        this.elParent.appendChild(line);
        // FIXME: add proper iterationNr and letter
        return new Point(newx, newy, 0, '');
    }


    turn(rotation) {
        this.angle += rotation;
    }

}