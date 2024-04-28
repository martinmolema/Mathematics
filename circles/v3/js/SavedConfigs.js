import {SaveableConfig} from "./SaveableConfig.js";
import {GUIOptions} from "./GUIOptions.js";

export class SavedConfigs {
    /* SaveableConfig */ configs = [];
    /* String */ key = "";

    constructor(/* string */ key) {
        this.key = key;
        this.load();
    }

    nrOfConfigurationsPresent() {
        return this.configs.length;
    }

    isEmpty() {
        return this.nrOfConfigurationsPresent() === 0;
    }

    addNewConfig(/* string */ name, /* GUIOptions */ options) {
        const newConfig = new SaveableConfig(name, options);
        this.configs.push(newConfig);
        this.save();
        return newConfig.id;
    }

    updateConfigurationFromGUIObjectByID(/* GUID */ id, /* GUIConfig */ newConfig) {
        const config = this.getConfigByID(id);
        if (config) {
            config.updateFromGUIObject(newConfig);
            this.save();
        }
    }

    getNameForID(/* GUID */ id) {
        const item = this.getConfigByID(id);
        if (item === undefined) { return ""; }
        return item.name;
    }

    updateNameForID(/* GUID */ id, /* string */ newname) {
        const item = this.getConfigByID(id);
        if (item !== undefined) {
            item.name = newname;
        }
    }

    /**
     * Returns the first configuration that is found by name (names are not unique!)
     * @param name
     */
    getConfigByName(/* string */ name) {
        return this.configs.find(x => x.name === name);
    }

    getConfigByID(/* GUID */ id) {
        return this.configs.find(x => x.id === id);
    }

    getNamesAndIDs() {
        return this.configs.map(x => { return {name:x.name, id:x.id };  });
    }

    /**
     * Saves the array to the local storage of the browser
     */
    save(){
        const json = this.json();
        localStorage.setItem(this.key, json);
    }// save()

    clear() {
        localStorage.setItem(this.key, "");
        this.configs.length = 0; // proper cleaning instead of assigning a new array
    }

    json() {
        const saveableContents = this.configs.map(x => x.saveableInfo());
        return JSON.stringify(saveableContents);
    }

    /**
     * Load the JSON-info from the local storage and create new items. This is done by creating a new list of
     * SaveableConfig items and restoring the data for the options
     */
    load() {
        const json = localStorage.getItem(this.key);
        if (json != null) {
            this.loadJSON(json,true);
        }
    }

    /**
     * Loads a set of configurations from the given parameter and then saves it to localstorage. first clears the current
     * set of
     * @param json
     * @param clearCurrentset
     * @param saveAfterLoadCompleted
     * @param clearCurrentset
     * @param saveAfterLoadCompleted
     */
    loadJSON(/* string */ json, /* boolean */ clearCurrentset=true, /* boolean */ saveAfterLoadCompleted = false) {
        if (clearCurrentset) {
            this.configs = [];
        }
        if (json === "") { return ; }
        const items = JSON.parse(json);
        for(const item of items) {
            const name = item.name;
            const id   = item.id;
            const newConfig = new SaveableConfig(name, new GUIOptions(), id);
            newConfig.restoreFromSavedObject(item.data);
            this.configs.push(newConfig);
        }
        if (saveAfterLoadCompleted) {
            this.save();
        }
    }

    /**
     * Clears the list
     */
    Clear(){
        this.historyitems.length = 0;
        localStorage.setItem(this.key,JSON.stringify(this.historyitems));
    } // Clear()
}