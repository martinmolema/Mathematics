"use strict";


import {LSystem} from "./LSystem.js";
import {Point} from "./Point.js";

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
/*
    // ?
    lsystem.addVariable('F');
    lsystem.addRule('F=F+F-F-FF+F+F-F');
    lsystem.setAxiom('F+F+F+F');
    lsystem.lineLength = 5;
    lsystem.rotationAngle = 90;
    lsystem.setOriginBottomRight(0,0)
    lsystem.generate(5);
    */

/*
    // triangles
    lsystem.addVariable('F');
    lsystem.addRule('F=F-F+F');
    lsystem.setAxiom('F+F+F');
    lsystem.lineLength = 20;
    lsystem.rotationAngle = 120;
    lsystem.setOrigin(-200, 100);
    lsystem.generate(5);
*/
/*

    // Peano Curve
    lsystem.addVariable('X');
    lsystem.addVariable('Y');
    lsystem.addVariable('F');
    lsystem.addRule('X=XFYFX+F+YFXFY-F-XFYFX');
    lsystem.addRule('Y=YFXFY-F-XFYFX+F+YFXFY');
    lsystem.setAxiom('X');
    lsystem.lineLength = 5 ;
    lsystem.rotationAngle = 90;
    lsystem.setOrigin(200, -300);
    lsystem.generate(5);
*/

    // Sierpinski Arrowhead
    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addVariable('Y');
    lsystem.addRule('X=YF+XF+Y');
    lsystem.addRule('Y=XF-YF-X');
    lsystem.setAxiom('YF');
    lsystem.lineLength = 10 ;
    lsystem.startingAngle = 0;
    lsystem.rotationAngle = 60;
    lsystem.setOriginBottomLeft(10,10)
    lsystem.generate(7);

/*
    // Hilbert
    lsystem.addVariable('F');
    lsystem.addVariable('X');
    lsystem.addVariable('Y');
    lsystem.addRule('X=-YF+XFX+FY-');
    lsystem.addRule('Y=+XF-YFY-FX+');
    lsystem.setAxiom('X');
    lsystem.lineLength = 10 ;
    lsystem.rotationAngle = 90;
    lsystem.setOriginBottomLeft(10,10);
    lsystem.generate(7);
*/
/*

    // Quadratic Snowflake variant B
    lsystem.addVariable('F');
    lsystem.addRule('F=F+F-F-F+F');
    lsystem.setAxiom('FF+FF+FF+FF');
    lsystem.lineLength = 3 ;
    lsystem.rotationAngle = 90;
    lsystem.setOriginBottomRight(20,20);
    lsystem.generate(5);
*/


/*

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
*/

    let svgContainer = document.getElementById("drawing");
    let startPoint = new Point(0,0);
    let dragPoint = new Point(0,0);
    let translation = new Point(0,0);
    let temporaryTranslation = new Point(0,0);
    let zoomFactor = 1;

    let isDragging = false;
    const CTM = svgContainer.getScreenCTM();
    svgContainer.addEventListener("wheel", (event) => {

    });
    svgContainer.addEventListener("mousedown", (event) => {
        isDragging = true;
        console.log(`drag start`)
        const startX = (event.clientX - CTM.e) / CTM.a;
        const startY = (event.clientY - CTM.f) / CTM.d;

        startPoint.x = startX;
        startPoint.y = startY;
        startPoint = new Point(startPoint.x, startPoint.y);
        temporaryTranslation = new Point(0,0);

        console.log(`- start at (${startX},${startY})`);

    })

    svgContainer.addEventListener("mouseleave", (event) => {
        if (isDragging) {
            isDragging = false;
            console.log(`drag end (mouse leave)`);

            translation.x = temporaryTranslation.x;
            translation.y = temporaryTranslation.y;
        }
    });
    svgContainer.addEventListener("mouseup", (event) => {
        if (isDragging) {
            console.log(`-dragging (mouse up)`);
            isDragging = false;

            translation.x = temporaryTranslation.x;
            translation.y = temporaryTranslation.y;
        }
    });


    svgContainer.addEventListener("mousemove", (event) => {
        if (isDragging) {
            console.log(`-dragging`);

            const newX = (event.clientX - CTM.e) / CTM.a;
            const newY = (event.clientY - CTM.f) / CTM.d;

            let diffX = newX - startPoint.x;
            let diffY = newY - startPoint.y;

            temporaryTranslation.x = translation.x + diffX;
            temporaryTranslation.y = translation.y + diffY;

            console.log(`- drag to (${newX},${newY}) => delta = (${diffX},${diffY}) => translation = (${temporaryTranslation.x},${-temporaryTranslation.y})`);

            setZoomTranslation(elParent, zoomFactor, temporaryTranslation);
            // elParent.setAttribute('transform', `translate(${temporaryTranslation.x},${-temporaryTranslation.y})`);
        }
    });

    svgContainer.addEventListener("wheel" , (event) => {
        console.log(event.deltaX, event.deltaY);
        if (event.deltaY < 0) {
            zoomFactor += 0.1;
        }
        else {
            zoomFactor -= 0.1;
        }
        zoomFactor = Math.min(5,zoomFactor);
        zoomFactor = Math.max(0.1, zoomFactor);

        setZoomTranslation(elParent, zoomFactor, translation);
    });
}

function setZoomTranslation(svgElement, zoom, translation){
    const translateStr = `translate(${translation.x},${-translation.y})`;
    const zoomStr = `scale(${zoom},${zoom})`;

    svgElement.setAttribute('transform', `${translateStr} ${zoomStr}`);
}