export class Point {
    x;
    y;
    iterationNr = -1;
    letter = '';

    constructor(x, y, iterationNr, letter) {
        this.x = x;
        this.y = y;
        this.iterationNr = iterationNr | -1;
        this.letter = letter || '';
    }
}