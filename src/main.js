import Sherlock from "../engine_sherlock/index.js";
import pieces_states from "../res/config/pieces_states.js";

const { CanvasRenderer, Container, 
        KeyControls, Texture, Text, 
        Sprite, Game, Piece, Board } = Sherlock;

const game = new Game(225, 450);

const board = new Board(15, 30);

const controls = new KeyControls();
controls.addAction(37, () => { board.movePiece("left"); });
controls.addAction(39, () => { board.movePiece("right"); });
controls.addAction(32, () => { board.rotatePiece(); });
controls.init();

const { scene, w, h } = game;

scene.add(board);

game.run();