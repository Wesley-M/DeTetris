import Sherlock from "../engine_sherlock/index.js";
import pieces_states from "../res/config/pieces_states.js";

const { CanvasRenderer, Container, 
        KeyControls, Texture, Text, 
        Sprite, Game, Piece } = Sherlock;

const game = new Game(640, 480);

const { scene, w, h } = game;

const t_piece = new Piece(pieces_states.t);

scene.add(t_piece);

game.run();