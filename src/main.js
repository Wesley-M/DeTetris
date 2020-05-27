import Painter from "../engine_sherlock/utils/Painter.js";
import Game from "../engine_sherlock/Game.js";
import Renderer from "../engine_sherlock/renderer/Renderer.js";

import { pieces_states, colors, sounds } from "../engine_sherlock/config/settings.js";

import colorText from "../../res/scripts/show_text_effect.js"

const painter = new Painter(pieces_states, colors);

const gameRenderer = new Renderer(painter);

// Showing initial text
colorText("#gameinit-container p" ,"#353434");

document.querySelector("#play").addEventListener("click", function (e) {
    document.querySelector("#gameinit-container").style.display = "none";
    
    const game = new Game(painter, gameRenderer, sounds);
    mobileControlEvents(game);
    game.run();
});


function mobileControlEvents(game) {
    document.querySelector("#arrow_left").addEventListener("mousedown", game.moveLeft);
    document.querySelector("#arrow_right").addEventListener("mousedown", game.moveRight);
    document.querySelector("#arrow_down").addEventListener("mousedown", game.accelerate);
    document.querySelector("#arrow_down").addEventListener("mouseup", game.resetVelocity);
    document.querySelector("#space_bar").addEventListener("click", game.rotate);
}