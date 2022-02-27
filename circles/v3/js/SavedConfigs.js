import {SaveableConfig} from "./SaveableConfig.js";
import {GUIOptions} from "./GUIOptions.js";

export class SavedConfigs {
    /* SaveableConfig */ configs = [];
    /* String */ key = "";

    constructor(/* string */ key) {
        this.key = key;
        this.load();
    }

    addNewConfig(/* string */ name, /* GUIOptions */ options) {
        const newConfig = new SaveableConfig(name, options);
        this.configs.push(newConfig);
        this.save();
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
            this.loadJSON(json);
        }
    }

    loadJSON(/* string */json) {
        this.configs = [];
        const items = JSON.parse(json);
        for(const item of items) {
            const name = item.name;
            const id   = item.id;
            const newConfig = new SaveableConfig(name, new GUIOptions(), id);
            newConfig.restoreFromJSON(item.data);
            this.configs.push(newConfig);
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