"use strict";


import {LSystem} from "./LSystem.js";

window.onload = () => {
    setup();
}

function setup() {
    const elParent = document.getElementById("canvas");
    const lsystem = new LSystem(elParent);

    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addVariable('Y');
    lsystem.addRule('X=X[-FFF][+FFF]FX');
    lsystem.addRule('Y=YFX[+Y][-Y]');
    lsystem.setAxiom('Y');
    lsystem.lineLength = 10;
    lsystem.rotationAngle = 25.7;
    lsystem.originY = -400;


    lsystem.generate(5);
}