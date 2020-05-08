import KeyControls from "./controls/KeyControls.js"

const controls = new KeyControls();

export default class Piece {
    constructor(states, position) {
        this.states = states;
        this.currentState = 0;
        this.position = position;
        this.disabled = false;
    }

    changeState() {
        this.currentState = (this.currentState + 1) % this.states.length;
    }
}