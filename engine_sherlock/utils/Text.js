export default class Text {
    constructor(text = "", style = {}) {
        this.position = { x: 0, y: 0 };
        this.text = text;
        this.style = style;
    }
}