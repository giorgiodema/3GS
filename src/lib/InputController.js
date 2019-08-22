/* ==================
 * InputController
 * ==================
 * A class that manages inputs from a user */
export default class InputController {
    constructor() {

        this._isUpArrowKeyDown = false;
        this._isDownArrowKeyDown = false;
        this._isLeftArrowKeyDown = false;
        this._isRightArrowKeyDown = false;

        window.onkeydown = e => this._trackArrowKey(e, true);
        window.onkeyup = e => this._trackArrowKey(e, false);
    }

    // Gets whether or not the up arrow key is currently down
    get isUpArrowKeyDown() {
        return this._isUpArrowKeyDown;
    }

    // Gets whether or not the down arrow key is currently down
    get isDownArrowKeyDown() {
        return this.isDownArrowKeyDown;
    }

    // Gets whether or not the left arrow key is currently down
    get isLeftArrowKeyDown() {
        return this.isLeftArrowKeyDown;
    }

    // Gets whether or not the right arrow key is currently down
    get isRightArrowKeyDown() {
        return this.isRightArrowKeyDown;
    }

    _trackArrowKey(e, state) {
        e = e || window.event;

        if (e.keyCode == '38') this._isUpArrowKeyDown = state;
        else if (e.keyCode == '40') this._isDownArrowKeyDown = state;
        else if (e.keyCode == '37') this._isLeftArrowKeyDown = state;
        else if (e.keyCode == '39') this._isRightArrowKeyDown = state;
    }
}
