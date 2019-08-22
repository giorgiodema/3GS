/* ==================
 * InputController
 * ==================
 * A class that manages inputs from a user */
export default class InputController {
    constructor() {

        // Arrow keys states
        this._isUpArrowKeyDown = false;
        this._isDownArrowKeyDown = false;
        this._isLeftArrowKeyDown = false;
        this._isRightArrowKeyDown = false;

        // Arrow keys handlers
        this._onUpArrowKeyDown = null;
        this._onDownArrowKeyDown = null;
        this._onLeftArrowKeyDown = null;
        this._onRightArrowKeyDown = null;

        window.onkeydown = e => this._trackArrowKey(e, true);
        window.onkeyup = e => this._trackArrowKey(e, false);
    }

    // Gets whether or not the up arrow key is currently down
    get isUpArrowKeyDown() {
        return this._isUpArrowKeyDown;
    }

    // Gets whether or not the down arrow key is currently down
    get isDownArrowKeyDown() {
        return this._isDownArrowKeyDown;
    }

    // Gets whether or not the left arrow key is currently down
    get isLeftArrowKeyDown() {
        return this._isLeftArrowKeyDown;
    }

    // Gets whether or not the right arrow key is currently down
    get isRightArrowKeyDown() {
        return this._isRightArrowKeyDown;
    }

    // Sets the callback to invoke when the up arrow key is pressed
    get onUpArrowKeyDown() {
        return this._onUpArrowKeyDown;
    }

    // Sets the callback to invoke when the down arrow key is pressed
    get onDownArrowKeyDown() {
        return this._onDownArrowKeyDown;
    }

    // Sets the callback to invoke when the left arrow key is pressed
    get onLeftArrowKeyDown() {
        return this._onLeftArrowKeyDown;
    }

    // Sets the callback to invoke when the right arrow key is pressed
    get onRightArrowKeyDown() {
        return this._onRightArrowKeyDown;
    }

    // Tracks when an arrow key is being pressed
    _trackArrowKey(e, state) {
        e = e || window.event;

        // Up
        if (e.keyCode == '38') {
            this._isUpArrowKeyDown = state;
            if (typeof this._onUpArrowKeyDown === 'function') {
                this._onUpArrowKeyDown();
            }
        }
        else if (e.keyCode == '40') {

            // Down
            this._isDownArrowKeyDown = state;
            if (typeof this._onDownArrowKeyDown === 'function') {
                this._onDownArrowKeyDown();
            }
        }
        else if (e.keyCode == '37') {

            // Left
            this._isLeftArrowKeyDown = state;
            if (typeof this._onLeftArrowKeyDown === 'function') {
                this._onLeftArrowKeyDown();
            }
        }
        else if (e.keyCode == '39') {

            // Right
            this._isRightArrowKeyDown = state;
            if (typeof this._onRightArrowKeyDown === 'function') {
                this._onRightArrowKeyDown();
            }
        }
    }
}
