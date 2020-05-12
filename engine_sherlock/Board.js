import Piece from "./Piece.js";
import Collider from "./utils/Collider.js"
import { pieces_states } from "../../res/config/settings.js";

export default class Board {
    constructor(w, h, painter, sounds) {
        this.dim = {width: w, height: h};
        
        this.state = Array(h).fill().map(()=>Array(w).fill(0));
        
        this.collider = new Collider(this);
        this.painter = painter;
        this.sounds = sounds;
        
        this.lastUpdate = 0;
        this.completeLines = 0;

        this.activePiece = false;
        this.gameOver = false;

        this.pause = false;

        this.nextPieceName = "";
        this.nextPiece = false;
    
        this.velY = 0.3;
        this.spawnTime = this.velY / 25;

        this.spawn();
    }

    spawn() {
        let position = {x: Math.floor(this.dim.width / 2), y: 0};

        if (this.nextPieceName !== "") {
            this.activePiece = new Piece(position, this.painter, this.nextPieceName);
        } else {
            this.activePiece = new Piece(position, this.painter);
        }

        let keys = Object.keys(pieces_states);
        this.nextPieceName = keys[ Math.round(Math.random() * 100) % keys.length ];
        this.nextPiece = new Piece(position, this.painter, this.nextPieceName);
    }

    movePiece(dir) {
        let moved = false;

        if (!this.pause) {
            switch(dir) {
                case "left":
                    moved = this.__moveLeft();
                    break;
                case "right":
                    moved = this.__moveRight();
                    break;
                case "down":
                    moved = this.__moveDown();
                    if (!moved) { 
                        this.removeCompleteLines();
                        this.sounds["collision"].play();
                        this.checkGameOver(); 
                    } 
            }
        }

        return moved;
    }

    checkGameOver() {
        if (this.activePiece.position.y == 0) {
            this.gameOver = true;
        }
    }

    __moveLeft() {
        let collisions = this.collider.getCollisions(this.activePiece, {x: -1, y: 0});
        let leftCollision = collisions.includes("left");

        if (!leftCollision) {
            this.erasePiece();
            this.activePiece.position.x -= 1;
            this.updatePieceOnBoard(); 
            this.__checkSpawnCondition();
        }

        return !leftCollision;
    }

    __moveRight() {
        let collisions = this.collider.getCollisions(this.activePiece, {x: 1, y: 0});
        let rightCollision = collisions.includes("right");

        if (!rightCollision) { 
            this.erasePiece();    
            this.activePiece.position.x += 1; 
            this.updatePieceOnBoard();
            this.__checkSpawnCondition();
        }

        return !rightCollision;
    }

    __moveDown() {
        let collisions = this.collider.getCollisions(this.activePiece, {x: 0, y: 1});
        let downCollision = collisions.includes("down");
    
        if (!downCollision) { 
            this.erasePiece();
            this.activePiece.position.y += 1;
            this.updatePieceOnBoard(); 
            this.__checkSpawnCondition();
        } else {
            this.scheduleSpawn = setTimeout(() => { this.spawn() }, this.spawnTime * 1000);
        }

        return !downCollision;
    }

    __checkSpawnCondition() {
        let collisions = this.collider.getCollisions(this.activePiece, {x: 0, y: 1});
        let downCollision = collisions.includes("down");

        if (!downCollision && this.scheduleSpawn != undefined) { 
            clearTimeout(this.scheduleSpawn);
            this.scheduleSpawn = undefined;
        }
    }

    rotatePiece() {
        let oldState = this.activePiece.state;

        this.erasePiece();

        this.activePiece.rotate();

        let collisionBorder = this.collider.getBorderCollision(this.activePiece);
        let collisionPiece = this.collider.getPieceCollision(this.activePiece);

        console.log(collisionBorder + " " + collisionPiece);

        if (collisionBorder != false || collisionPiece != false) {
            this.activePiece.state = oldState;
            if (collisionBorder != false) {
                this.__recover(collisionBorder);
            } else if (collisionPiece != false) {
                this.__recover(collisionPiece);
            }
        }

        this.updatePieceOnBoard();
    }

    __recover(collision) {
        if (collision == "left") {
            if (this.movePiece("right")) this.rotatePiece();
        } else if (collision == "right") {
            if (this.movePiece("left")) this.rotatePiece(); 
        }
    }

    erasePiece() {
        this.updatePieceOnBoard({removePiece: true});
    }

    __getCompleteLines() {
        let completeLines = [];
        let completeLine = false;
        
        for (let i = 0; i < this.dim.height; i++) {
            for (let j = 0; j < this.dim.width; j++) {
                completeLine = (this.state[i][j] != 0);
                if (!completeLine) break;
            }
            if (completeLine) completeLines.push(i);
        }

        this.completeLines += completeLines.length;

        return completeLines;
    }

    removeCompleteLines() {
        let completeIndexes = this.__getCompleteLines().sort();
        let length = completeIndexes.length;

        let j = 1;

        completeIndexes.forEach((completeIndex, i) => {
            setTimeout(() => {
                this.state.splice(completeIndex, 1);
                this.state.unshift(Array(this.dim.width).fill(0));
                this.sounds["complete_line"].play();

                if (i == completeIndexes.length - 1) this.pause = false;
            
            }, j * 500);
            j = j + 1;
        });

        if (completeIndexes.length != 0) this.pause = true;

        return length;
    }

    delay(ms) {
        const startPoint = new Date().getTime()
        while (new Date().getTime() - startPoint <= ms) {/* wait */}
    }

    updatePieceOnBoard({removePiece}={removePiece: false}) {
        const board = this.state;
        const piecePos = this.activePiece.position;

        const horizontalLength = this.activePiece.state[0].length;
        const verticalLength = this.activePiece.state.length;

        const xlim = { start: piecePos.x, end: piecePos.x + horizontalLength};
        const ylim = { start: piecePos.y, end: piecePos.y + verticalLength};
        
        let piece = this.activePiece.state;

        for (let i = ylim.start; i < ylim.end; i++) {
            for (let j = xlim.start; j < xlim.end; j++) {
                const pieceCell = piece[i - ylim.start][j - xlim.start];
                if (pieceCell != 0) board[i][j] = (removePiece) ? 0 : pieceCell;
            }
        }
    }

    update(dt, t) {
        if (t - this.lastUpdate > this.velY) {
            this.lastUpdate = t;
            this.movePiece("down");
        }
    }
}