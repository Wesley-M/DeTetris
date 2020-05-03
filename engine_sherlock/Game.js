import Container from "./utils/Container.js";
import CanvasRenderer from "./renderer/CanvasRenderer.js"

const STEP = 1 / 60;
const MAX_FRAME = STEP * 5;

class Game {
    constructor (w, h, parent = "#board") {
        this.w = w;
        this.h = h;
        this.renderer = new CanvasRenderer(w, h);
        document.querySelector(parent).appendChild(this.renderer.view);

        this.scene = new Container();
    }

    run(gameUpdate = () => {}) {
        let dt = 0;
        let last = 0;

        let lastUpdate = 0;

        const loop = ms => {
            requestAnimationFrame(loop);

            const t = ms / 1000;
            dt = Math.min(t - last, MAX_FRAME);
            last = t;

            if (t - lastUpdate >= 1) {
                lastUpdate = t;

                this.scene.update(dt, t);
                gameUpdate(dt, t);
                this.renderer.render(this.scene);
            }
            
        };

        requestAnimationFrame(loop);
    }
}

export default Game;