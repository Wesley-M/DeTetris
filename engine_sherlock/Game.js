import Sherlock from "../engine_sherlock/index.js";

const { Container, KeyControls, CanvasRenderer, Board } = Sherlock;

const STEP = 1 / 60;
const MAX_FRAME = STEP * 5;

class Game {
    constructor (w, h, parent = "#board") {
        this.__init(w, h, parent = "#board");
    }

    __init(w, h, parent = "#board") {
        this.w = w;
        this.h = h;

        this.renderer = new CanvasRenderer(w, h);

        this.scene = new Container();
        this.board = new Board(Math.floor(w/this.renderer.pieceSide), Math.floor(h/this.renderer.pieceSide));

        this.scene.add(this.board);

        document.querySelector(parent).appendChild(this.renderer.view);
    }

    __initActions() {
        const controls = new KeyControls();
    
        controls.addKeyAction("keydown", 37, () => {
            this.__selectKey("#arrow_left");
            this.board.movePiece("left"); 
        }, false);

        controls.addKeyAction("keydown", 39, () => { 
            this.__selectKey("#arrow_right");
            this.board.movePiece("right"); 
        }, false);

        controls.addKeyAction("keydown", 40, () => { 
            this.__selectKey("#arrow_down");
            this.board.velY = 0.05; 
        }, false);

        controls.addKeyAction("keyup", 40, () => { this.board.velY = 0.3; }, false);

        controls.addKeyAction("keydown", 32, () => { 
            this.__selectKey("#space_bar");
            this.board.rotatePiece(); 
        }, true);

        controls.init();
    }

    __selectKey(el) {
        document.querySelector(el).style.filter = "invert(100%)"; 
        setTimeout(() => {
            document.querySelector(el).style.filter = "invert(0%)";
        }, 50);
    }

    run() {
        this.__initActions();

        let dt = 0;
        let last = 0;

        const loop = ms => {
            requestAnimationFrame(loop);

            const t = ms / 1000;
            dt = Math.min(t - last, MAX_FRAME);
            last = t;

            this.scene.update(dt, t);
            this.renderer.render(this.scene);
        };

        requestAnimationFrame(loop);
    }
}

export default Game;