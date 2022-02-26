export class ColorPaletteList {
    palettes = [];
    paletteNames = [];

    selectedPalette = undefined;
    selectedPaletteNr = undefined;

    constructor(maxNrOfColors) {
        this.setupPalettes(maxNrOfColors);
    }

    selectPalette(index) {
        this.selectedPaletteNr = index;
        this.selectedPalette = this.palettes[index];
    }

    nrOfColorsInSelectedPalette(){
        return this.selectedPalette.length;
    }

    getPaletteColor(num) {
        return this.selectedPalette[num];
    }

    getPaletteName(num) {
        return this.paletteNames[num];
    }

    getNumberOfItemsInList() {
        return this.palettes.length;
    }

    setupPalettes(maxNrOfColors) {
        const colorList = [ /* in total the same amount of colors as the maximum of colors*/
            "blue","orange","red","yellow","grey",
            "darkgreen","purple","lightblue","green","crimson",
            "Chocolate","deeppink","gold","honeydew","lavender",
            "magenta","seashell","brown", "teal", "orangered",
            "blue","orange","red","yellow","grey",
            "darkgreen","purple","lightblue","green","crimson",
            "Chocolate","deeppink","gold","honeydew","lavender",
            "magenta","seashell","brown", "teal", "orangered",

        ];
        const colored = colorList.slice(0,maxNrOfColors);
        const coloredReverse = [...colored].reverse();
        const greyscales = [];
        for (let i=0;i<=255; i+= 255 / maxNrOfColors) {
            greyscales.push(`rgb(${i},${i},${i})`)
        }
        const greyscalesReverse = [];
        for (let i=255;i>=0; i-= 255 / maxNrOfColors) {
            greyscalesReverse.push(`rgb(${i},${i},${i})`)
        }
        const hsl = [];
        for (let i = 0; i<360; i+= 360/maxNrOfColors) {
            hsl.push(`hsl(${i}, 100%, 50%)`);
        }
        const hslreversed = [];
        for (let i = 360; i>=0; i-= 360/maxNrOfColors) {
            hslreversed.push(`hsl(${i}, 100%, 50%)`);
        }
        const randomhsl = [];
        for (let i = 0; i<360; i+= 360/maxNrOfColors) {
            const color = Math.random() * 255;
            randomhsl.push(`hsl(${color}, 100%, 50%)`);
        }

        const randomrgb = [];
        for (let i = 0; i<255; i+= 255/maxNrOfColors) {
            const color1 = Math.random() * 255;
            const color2 = Math.random() * 255;
            const color3 = Math.random() * 255;
            randomrgb.push(`rgb(${color1}, ${color2}, ${color3})`);
        }

        const randomgray = [];
        for (let i = 0; i<255; i+= 255/maxNrOfColors) {
            const color1 = Math.random() * 255;
            randomgray.push(`rgb(${color1}, ${color1}, ${color1})`);
        }

        const constantRed = [];
        for (let i = 0; i<255; i+= 255/maxNrOfColors) {
            constantRed.push("red");
        }

        const constantGreen = [];
        for (let i = 0; i<255; i+= 255/maxNrOfColors) {
            constantGreen.push("green");
        }

        const constantBlue = [];
        for (let i = 0; i<255; i+= 255/maxNrOfColors) {
            constantBlue.push("blue");
        }

        this.palettes = [
            colored, coloredReverse, greyscales, greyscalesReverse, hsl, hslreversed, randomhsl, randomrgb, randomgray,
            constantRed, constantGreen, constantBlue
        ];
        this.paletteNames = [
            'Colored' , 'Colored reverse' , 'Greyscales', 'Greyscales reversed', 'HSL', 'HSL Reversed', 'Random HSL', 'Random RGB', 'Random greyscales',
            'Only red', 'Only green', 'Only blue'
        ];
        if (this.selectedPaletteNr !== undefined) {
            this.selectedPalette = this.palettes[this.selectedPaletteNr];
        }
    }
}