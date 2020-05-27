import Text from "../utils/Text.js"
import Texture from "../utils/Texture.js"
import Board from "../Board.js"

import { BOARD_WIDTH, BOARD_HEIGHT, PIECE_DIMENSION } from "../config/settings.js"

export default class Renderer {
    constructor (painter) {
        const canvas = document.createElement("canvas");

        this.w = canvas.width = BOARD_WIDTH * PIECE_DIMENSION;
        this.h = canvas.height = BOARD_HEIGHT * PIECE_DIMENSION;
    
        this.painter = painter;

        this.view = canvas;

        this.ctx = canvas.getContext("2d");
        this.ctx.textBaseline = "top";
    }

    render(container, clear = true) {
        const { ctx } = this;

        this.renderRec(ctx, container);

        // Clear the screen
        if (clear) ctx.clearRect(0, 0, this.w, this.h);

        this.renderRec(ctx, container);
    }

    renderRec (ctx, container) {
        container.children.forEach((child) => {
            // Choose to render or not the leaf node
            if (child.visible == false) return;

            // Save the context to restore later
            ctx.save();

            // Setting where to draw the leaf node
            if (child.position) ctx.translate(Math.round(child.position.x), Math.round(child.position.y));
            
            // Rendering the leaf node
            this.renderLeaf(child, ctx);

            // Handle the child nodes
            if (child.children) this.renderRec(ctx, child);

            ctx.restore();
        });
    }

    renderLeaf(child, ctx) {
        if (child instanceof Text) this.renderText(child, ctx);
        else if (child instanceof Texture) this.renderTexture(child, ctx);
        else if (child instanceof Board) { 
            this.renderBoard(child, ctx); 
            this.renderNextPiece(child, ctx);
        }
    }

    renderText(child, ctx) {
        const { font, fill, align } = child.style;
        if (font) ctx.font = font;
        if (fill) ctx.fillStyle = fill;
        if (align) ctx.textAlign = align;
        ctx.fillText(child.text, 0, 0);
    }

    renderTexture(child, ctx) {
        ctx.drawImage(child.texture.img, child.position.x, child.position.y);
    }

    renderBoard(child, ctx) {
        let pos = {x: 0, y: 0};

        ctx.strokeStyle = "rgba(128, 128, 128, 0.5)";
        ctx.lineWidth = 0.5;

        // Rendering the board

        for (let line of child.state) {
            for (let column of line) {
                ctx.save();

                ctx.fillStyle = (column == 0) ? "white" : this.painter.getColor(column); 
                
                if (column != 0) {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "white";
                }

                ctx.fillRect(pos.x, pos.y, PIECE_DIMENSION, PIECE_DIMENSION);
                ctx.strokeRect(pos.x, pos.y, PIECE_DIMENSION, PIECE_DIMENSION);

                ctx.restore();

                pos.x += PIECE_DIMENSION;
            }

            pos.x = 0;
            pos.y += PIECE_DIMENSION;
        }
    }

    renderNextPiece(board, ctx) {
        document.querySelector("#next-piece").innerHTML = board.nextPiece.name;
    }
}