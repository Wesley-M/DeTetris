export default class Painter {
    constructor(pieces_states, allColors) {
        this.colors = this.__randomizeColorsPositions(allColors);
        this.colorsPerPiece = Math.floor(allColors.length / Object.keys(pieces_states).length);
        this.colorStates = this.__getColorStates(pieces_states);
    }

    __getColorStates(pieces_states) {
        let colorStates = {};

        let keys = Object.keys(pieces_states);

        let iniIndex = 0;
        for (let i = 0; i < keys.length; i++) {
            colorStates[keys[i]] = {start: iniIndex, end: (iniIndex + this.colorsPerPiece - 1)}
            iniIndex += this.colorsPerPiece;
        }

        return colorStates;
    }

    /**
     * Randomize color order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    __randomizeColorsPositions(colors) {
        for (let i = colors.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            // swap variables in ES6+
            [colors[i], colors[j]] = [colors[j], colors[i]]
        }
        return colors;
    }


    getColor(index) {
        if (index >= 0 && index < this.colors.length)
            return this.colors[index];
    }

    colorPiece(pieceId, pieceMtx) {
        let randomColor = this.__randomColor(pieceId);

        for (let i = 0; i < pieceMtx.length; i++) {
            for (let j = 0; j < pieceMtx[0].length; j++) {
                if (pieceMtx[i][j] != 0) {
                    pieceMtx[i][j] = randomColor;
                }
            }
        }

        return pieceMtx;
    }

    __randomColor(pieceId) {
        let start = this.colorStates[pieceId].start;
        let end = this.colorStates[pieceId].end;

        return start + Math.floor(Math.random() * (end - start) + 1);
    }
}