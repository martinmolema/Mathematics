
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
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
    /* GUIOptions */ config;

    constructor(/* string */ name, /* GUIOptions */ config, /* String */ id="") {
        this.name = name;
        this.config = config;
        if (id === "") {
            this.id = generateUUID();
        }
        else {
            this.id = id;
        }

    }

    saveableInfo() {
        const obj = {
            data: this.config.json(),
            name: this.name,
            id: this.id
        };
        return obj;
    }

    restoreFromSavedObject(/* Object */ data) {
        this.config.updateFromRestoredObject(data);
    }//restoreFromSavedObject

    restoreFromJSON(/* String */ json){
        this.config.updateFromJSON(json);
    }


}