import Sherlock from "../engine_sherlock/index.js";

const { Container, KeyControls, Board } = Sherlock;

const STEP = 1 / 60;
const MAX_FRAME = STEP * 5;

class Game {
    constructor (w, h, painter, gameRenderer, sounds, parent = "#board") {
        this.__init(w, h, painter, gameRenderer, sounds, parent);
    }

    __init(w, h, painter, gameRenderer, sounds, parent = "#board") {
        this.w = w;
        this.h = h;
        
        this.painter = painter;
        this.gameRenderer = gameRenderer;

        this.sounds = sounds;

        this.scene = new Container();

        this.board = new Board(15, 
                               20, 
                               this.painter,
                               this.sounds);

        this.score = 0;

        this.pause = false;

        this.scene.add(this.board);

        document.querySelector(parent).appendChild(this.gameRenderer.view);

        this.sounds["background"].play();
    }

    __initActions() {
        const controls = new KeyControls();
    
        controls.addKeyAction("keydown", 37, () => {
            this.sounds["move"].play();
            this.__selectKey("#arrow_left");
            this.board.movePiece("left"); 
        }, false);

        controls.addKeyAction("keydown", 39, () => { 
            this.sounds["move"].play();
            this.__selectKey("#arrow_right");
            this.board.movePiece("right"); 
        }, false);

        controls.addKeyAction("keydown", 40, () => { 
            this.__selectKey("#arrow_down");
            this.board.velY = 0.03; 
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

        let pause = false;

        const loop = ms => {
            let idFrame = requestAnimationFrame(loop);

            const t = ms / 1000;
            dt = Math.min(t - last, MAX_FRAME);
            last = t;

            if (!this.board.gameOver) {
                this.scene.update(dt, t);
                this.gameRenderer.render(this.scene);
                this.updateGameStats();
            } else {
                this.gameOver();
            }
        };

        requestAnimationFrame(loop);
    }

    gameOver() {
        if (!this.pause) {
            document.querySelector("#gameover-container").style.display = "flex";

            this.sounds["background"].stop();
            this.sounds["game_over"].play();

            this.pause = true;

            this.replay();
        }
    }

    replay() {
        document.querySelector("#replay").addEventListener("click", (e) => {
            document.querySelector("#gameover-container").style.display = "none";
            this.sounds["game_over"].stop();
            this.__init(this.w, this.h, this.painter, this.gameRenderer, this.sounds, "#game-container");
            this.pause = false;
        });
    }

    updateGameStats() {
        this.score = this.board.completeLines * 100;
        document.querySelector("#stats").innerText = `Score: \n ${this.score}`;
    }

}

export default Game;