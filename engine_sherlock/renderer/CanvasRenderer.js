import Text from "../utils/Text.js"
import Texture from "../utils/Texture.js"
import Sprite from "../utils/Sprite.js"
import Board from "../Board.js"

export default class CanvasRenderer {
    constructor (w, h) {
        const canvas = document.createElement("canvas");
        
        this.w = canvas.width = w;
        this.h = canvas.height = h;
        
        this.view = canvas;

        this.ctx = canvas.getContext("2d");
        this.ctx.textBaseline = "top";

        this.pieceSide = 15;

        this.block_gray_text = new Texture("../../res/images/gray_block.png");
        this.block_icy_text = new Texture("../../res/images/icy_block.png");

        this.blockGray = new Sprite(this.block_gray_text);
        this.blockIcy = new Sprite(this.block_icy_text);

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
        else if (child instanceof Board) this.renderBoard(child, ctx);
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
        
        ctx.fillStyle = "black";
        ctx.strokeStyle = "rgba(189, 181, 75)";

        for (let line of child.state) {
            for (let column of line) {
                ctx.save();

                if (column == 1) ctx.drawImage(this.blockIcy.texture.img, pos.x, pos.y, this.pieceSide, this.pieceSide);
                else ctx.drawImage(this.blockGray.texture.img, pos.x, pos.y, this.pieceSide, this.pieceSide);

                ctx.restore();

                pos.x += this.pieceSide;
            }

            pos.x = 0;
            pos.y += this.pieceSide;
        }
    }
}