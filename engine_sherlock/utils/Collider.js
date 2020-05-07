export default class Collider {

    constructor(board) {
        this.board = board;
    }

    getBorderCollision(piece) {
        let collision = false;
        
        let offset = {x: 0, y: 0};
        
        if (this.leftBoardCollision(piece, offset)) collision = "left";
        else if (this.rightBoardCollision(piece, offset)) collision = "right";
        else if (this.downBoardCollision(piece, offset)) collision = "down";

        return collision;
    }

    getPieceCollision(piece) {
        let collision = false;
        
        if (this.leftPieceCollision(piece, {x: -1, y: 0})) collision = "left";
        else if (this.rightPieceCollision(piece, {x: 1, y: 0})) collision = "right";
        else if (this.downPieceCollision(piece, {x: 0, y: 1})) collision = "down";

        return collision;
    }

    getCollisions(piece, offset) {
        let collisions = [];
        
        if (offset.y == 0) {
            if (this.leftBoardCollision(piece, offset) || this.leftPieceCollision(piece, offset))
                collisions.push("left");

            if (this.rightBoardCollision(piece, offset) || this.rightPieceCollision(piece, offset))
                collisions.push("right");
        } else {
            if (this.downBoardCollision(piece, offset) || this.downPieceCollision(piece, offset))
                collisions.push("down");
        }

        return collisions;
    }
    
    leftBoardCollision (piece, offset) {
        return (piece.position.x + offset.x < 0);
    }

    rightBoardCollision (piece, offset) {
        const horizontalLength = piece.states[piece.currentState][0].length;
        return (piece.position.x + offset.x + horizontalLength > this.board.dim.width);
    }

    downBoardCollision (piece, offset) {
        const verticalLength = piece.states[piece.currentState].length;
        return (piece.position.y + offset.y + verticalLength > this.board.dim.height);
    }

    leftPieceCollision (piece, offset) {
        return this.adjacentPieceCollision ({piece, offset: offset, andCondition: "offset.x < 0"});
    }

    rightPieceCollision (piece, offset) {
        return this.adjacentPieceCollision ({piece, offset: offset, andCondition: "offset.x > 0"});
    }

    downPieceCollision(piece, offset) {
        return this.adjacentPieceCollision ({piece, offset: offset, orCondition: "j == verticalLength - 1"});
    }

    adjacentPieceCollision ({piece, offset, orCondition, andCondition}) {
        const horizontalLength = piece.states[piece.currentState][0].length;
        const verticalLength = piece.states[piece.currentState].length;

        const currY = piece.position.y;
        const currX = piece.position.x;

        const pieceMtx = piece.states[piece.currentState];

        if (orCondition == undefined) orCondition = false;
        if (andCondition == undefined) andCondition = true;

        for (let j = 0; j < verticalLength; j++) {
            for (let i = 0; i < horizontalLength; i++) {
                if (currY + j + offset.y < this.board.dim.height) {
                    let adjacentPiece = this.board.state[currY + j + offset.y][currX + i + offset.x];
                    if (pieceMtx[j][i] == 1) {
                        if (eval(andCondition) && adjacentPiece == 1) {
                            if (eval(orCondition) || pieceMtx[j + offset.y][i + offset.x] != 1) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }
}