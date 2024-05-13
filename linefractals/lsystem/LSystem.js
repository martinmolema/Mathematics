
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

    processedRules = [];

    constructor(elSVGParent) {
        this.elParent = elSVGParent;
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
                const varname = parts[0];
                const rulepart = parts[1];

                this.processedRules[varname] = rulepart;
            }
        })
    }

    generate(nrOfIterations) {
        this.lastPosition = new Point(this.originX, this.originY);
        this.angle = this.startingAngle;
        this.stack = [];

        this.nrOfIterationsRequested = nrOfIterations;

        let result = this.axiom;

        for (let i = 1; i <= nrOfIterations; i++) {
            result = this.generateOneIteration(result);
        }
        this.formula = result;
        this.drawFormula(result);
        return result;
    }

    applyRule(char) {
        return this.processedRules[char] || char;
    }

    generateOneIteration(currentResult) {
        let result = '';

        for (const char of currentResult) {
            result += this.applyRule(char);
        }
        return result;
    }

    drawFormula(formula) {
        for(let char of formula) {
            switch (char) {
                case "F":
                    this.lastPosition = this.drawLine(this.lastPosition, this.lineLength);
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
                case "+":
                    this.turn(this.rotationAngle);
                    break;
                case "-":
                    this.turn(-this.rotationAngle);
                    break;
            }
        }
    }

    drawLine(point1, length){
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