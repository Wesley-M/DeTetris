export default class Piece {
    constructor(states) {
        this.states = states;
        this.currentState = 0;
        this.position = {x: 0, y: 0};
    }

    changeState() {
        this.currentState = (this.currentState + 1) % this.states.length;
    }

    update() {
        this.changeState();
    }
}