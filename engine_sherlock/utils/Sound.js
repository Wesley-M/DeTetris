export default class Sound {
    constructor(path) {
        this.playing = false; 
        this._element = document.createElement("audio");
        this._element.style.display = "none"; 
        this._path = path;
    }

    play() {
        this._element.play()
    }

    stop() {
        this._element.pause();
    }
}