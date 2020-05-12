import { pieces_states } from "../../res/config/settings.js";

export default class Piece {
    constructor(position, painter, name) {
        this.name = name;
        this.state = this.chooseState(painter);
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

    chooseState(painter) {
        let keys = Object.keys(pieces_states);

        let coloredPiece = false;
        
        if (this.name != undefined && keys.includes(this.name)) {
            coloredPiece = painter.colorPiece(this.name, pieces_states[this.name]);
        } else {
            let randomIndex = keys[ Math.round(Math.random() * 100) % keys.length ];
            coloredPiece = painter.colorPiece(randomIndex, pieces_states[randomIndex]);
        }

        return coloredPiece;
    };
}