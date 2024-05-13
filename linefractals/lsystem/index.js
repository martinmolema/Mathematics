"use strict";


import {LSystem} from "./LSystem.js";

window.onload = () => {
    setup();
}

function setup() {
    const elParent = document.getElementById("canvas");
    const lsystem = new LSystem(elParent, 800, 800);

/*
    // bushy cactus tree
    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addVariable('Y');
    lsystem.addRule('X=X[-FFF][+FFF]FX');
    lsystem.addRule('Y=YFX[+Y][-Y]');
    lsystem.setAxiom('Y');
    lsystem.lineLength = 5;
    lsystem.rotationAngle = 25.7;
    lsystem.originY = -400;
    lsystem.generate(8);
*/

/*

    // squares
    lsystem.addVariable('F');
    lsystem.addRule('F=FF+F-F+F+FF');
    lsystem.setAxiom('F+F+F+F');
    lsystem.lineLength = 20;
    lsystem.rotationAngle = 90;
    lsystem.generate(4);

*/

/*    // fractal tree
    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addRule('X=>[-FX]+FX');
    lsystem.setAxiom('FX');
    lsystem.lineLength = 200;
    lsystem.rotationAngle = 40;
    lsystem.originY = -100;
    lsystem.lineLengthMultiplier = 0.6;
    lsystem.generate(8);
    */
/*
    // plant left oriented
    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addRule('X=F-[[X]+X]+F[+FX]-X');
    lsystem.addRule('F=FF');
    lsystem.setAxiom('X');
    lsystem.lineLength = 5;
    lsystem.rotationAngle = 22.5;
    lsystem.generate(5);

*/
/*

    // square sierpinski
    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addRule('X=XF-F+F-XF+F+XF-F+F-X');
    lsystem.setAxiom('F+XF+F+XF');
    lsystem.lineLength = 10;
    lsystem.rotationAngle = 90;
    lsystem.originX = 250;
    lsystem.generate(5);
*/

    // Quadratic Gosper
    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addVariable('Y');
    lsystem.addRule('X=XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-');
    lsystem.addRule('Y=+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY');
    lsystem.setAxiom('-YF');
    lsystem.lineLength = 5;
    lsystem.rotationAngle = 90;
    lsystem.setOriginBottomLeft(10,10);
    lsystem.generate(4);
}