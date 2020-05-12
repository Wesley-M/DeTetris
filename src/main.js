import Painter from "../engine_sherlock/utils/Painter.js";
import Game from "../engine_sherlock/Game.js";
import Renderer from "../engine_sherlock/renderer/Renderer.js";

import { pieces_states, colors, sounds } from "../../res/config/settings.js";

const width = 350;
const height = 310;

const painter = new Painter(pieces_states, colors);

const gameRenderer = new Renderer(width, height, painter);

document.querySelector("#play").addEventListener("click", function (e) {
    const game = new Game(width, height, painter, gameRenderer, sounds, "#game-container");
    document.querySelector("#gameinit-container").style.display = "none";

    game.run();
});

