"use strict";

import {GUIDriver} from "./classes/GUIDriver.js";

window.onload = init;


const MAX_ITERATIONS = 200;

function init() {
    const gui = new GUIDriver(MAX_ITERATIONS);


    document.getElementById("generalinfo").addEventListener("click", (evt)=>{
        if (evt.target.tagName == "LEGEND"){
            const elements = document.querySelectorAll("#generalinfo legend");
            for (let i = 0; i < elements.length; i++) {
                let elm = elements[i];
                elm.parentElement.classList.add("wrapped");
            }
            evt.target.parentElement.classList.remove("wrapped");
        }

    });

}
