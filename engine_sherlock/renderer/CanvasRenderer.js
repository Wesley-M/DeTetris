export default class CanvasRenderer {
    constructor (w, h) {
        const canvas = document.createElement("canvas");
        this.w = canvas.width = w;
        this.h = canvas.height = h;
        this.view = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.textBaseline = "top";
    }

    render(container, clear = true) {
        const { ctx } = this;
        function renderRec (container) {
            container.children.forEach(child => {
                // Choose to render or not the leaf node
                if (child.visible == false) {
                    return;
                }
                
                ctx.save();

                // Setting where to draw the leaf node

                if (child.position) {
                    ctx.translate(Math.round(child.position.x), Math.round(child.position.y));
                }

                // Draw the leaf node

                if (child.text) {
                    const { font, fill, align } = child.style;
                    if (font) ctx.font = font;
                    if (fill) ctx.fillStyle = fill;
                    if (align) ctx.textAlign = align;
                    ctx.fillText(child.text, 0, 0);
                } else if (child.texture) {
                    ctx.drawImage(child.texture.img, child.position.x, child.position.y);
                }

                if(child.states) {
                    console.log(child.states[child.currentState]);
                }

                // Handle the child types
                if (child.children) {
                  renderRec(child);
                }

                ctx.restore();
            });
        }

        if (clear) {
            ctx.clearRect(0, 0, this.w, this.h);
        }

        renderRec(container);
    }
}