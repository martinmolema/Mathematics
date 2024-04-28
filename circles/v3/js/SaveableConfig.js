
function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export class SaveableConfig {
    /* string */ name;
    /* String */ id;
    /* GUIOptions */ options;
    /* Object */ config;

    constructor(/* string */ name, /* GUIOptions */ options, /* String */ id="") {
        this.name = name;
        this.config = options.saveableObject();
        if (id === "") {
            this.id = generateUUID();
        }
        else {
            this.id = id;
        }

    }

    /**
     * Updates the configuratoin to an existing new one
     * @param newConfig
     */
    updateFromGUIObject(/* GUIConfig*/ newConfig){
        this.config = newConfig.saveableObject();
    }

    saveableInfo() {
        return {
            data: this.config,
            name: this.name,
            id: this.id
        };
    }

    restoreFromSavedObject(/* Object */ data) {
        this.config = data;
    }//restoreFromSavedObject
}