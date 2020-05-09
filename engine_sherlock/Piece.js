import pieces_states from "../res/config/pieces_states.js"

export default class Piece {
    constructor(position) {
        this.state = this.chooseRandomState();
        this.position = position;
        this.disabled = false;
    }

    rotate() {
        let n = this.state.length;
        let m = this.state[0].length;

        let newState = Array(m).fill().map(()=>Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                newState[j][n-i-1] = this.state[i][j];
            }
        }

        this.state = newState;
    }

    chooseRandomState() {
        let keys = Object.keys(pieces_states);
        let randomIndex = keys[ Math.round(Math.random() * 100) % keys.length ];
        return pieces_states[randomIndex];
    };
}