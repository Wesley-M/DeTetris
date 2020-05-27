import colorText from "../res/scripts/show_text_effect.js"

import Sherlock from "../engine_sherlock/index.js";

const { Container, KeyControls, Board } = Sherlock;

const STEP = 1 / 60;
const MAX_FRAME = STEP * 5;

class Game {
    constructor (painter, gameRenderer, sounds, parent = "#board") {
        this.__init(painter, gameRenderer, sounds, parent);
    }

    __init(painter, gameRenderer, sounds, parent = "#board") {
        this.painter = painter;
        this.gameRenderer = gameRenderer;

        this.sounds = sounds;

        this.scene = new Container();

        this.board = new Board(this.painter, this.sounds);

        this.score = 0;

        this.pause = false;

        this.scene.add(this.board);

        document.querySelector(parent).appendChild(this.gameRenderer.view);

        this.sounds["background"].play();
    }

    __initActions() {
        const controls = new KeyControls();
    
        controls.addKeyAction("keydown", 37, this.moveLeft, false);
        controls.addKeyAction("keydown", 39, this.moveRight, false);
        controls.addKeyAction("keydown", 40, this.accelerate, false);
        controls.addKeyAction("keyup", 40, this.resetVelocity, false);
        controls.addKeyAction("keydown", 32, this.rotate, true);

        controls.init();
    }

    moveLeft = () => {
        this.sounds["move"].play();
        this.__selectKey("#arrow_left");
        this.board.movePiece("left"); 
    }

    moveRight = () => {
        this.sounds["move"].play();
        this.__selectKey("#arrow_right");
        this.board.movePiece("right"); 
    }

    accelerate = () => {
        this.__selectKey("#arrow_down");
        this.board.velY = 0.03; 
    }

    resetVelocity = () => {
        this.board.velY = 0.3;
    }

    rotate = () => {
        this.__selectKey("#space_bar");
        this.board.rotatePiece(); 
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
            
            colorText("#gameover-container p" ,"#353434");

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
            this.__init(this.painter, this.gameRenderer, this.sounds);
            this.pause = false;
        });
    }

    updateGameStats() {
        this.score = this.board.completeLines * 100;
        document.querySelector("#stats").innerText = `Score: \n ${this.score}`;
    }

}

export default Game;