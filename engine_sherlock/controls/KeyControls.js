export default class KeyControls {
    constructor () {
        this.actions = {};
    }

    addAction(keyCode, action) {
        this.actions[keyCode] = action;
    }

    init() {
        let spacePressed = false;
        // Bind event handlers
        document.addEventListener("keydown", e => {
            const keyCode = e.which;

            let keys = Object.keys(this.actions);

            if (keys.includes(String(keyCode))) {
                e.preventDefault();
                
                if (!spacePressed) {
                    if (keyCode == 32) spacePressed = true;
                
                    // Run action
                    this.actions[keyCode]();
                }
            }

        }, false);

        document.addEventListener("keyup", e => {
            const keyCode = e.which;

            let keys = Object.keys(this.actions);

            if (keys.includes(String(keyCode))) {
                e.preventDefault();
                if (keyCode == 32) spacePressed = false;
            }

        }, false);
    }
}