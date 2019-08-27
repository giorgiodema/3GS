// An enum to keep track of the cells state
const _CELL = {
    EMPTY: 0,
    UNDEFINED: 1,
    WALL: 2,
    PASSAGE: 3,
    PLAYER: 4,
    TARGET: 5
}

// An enum that indicates a movement direction
const _DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

class Constants {

    static get GRID_WIDTH() {
        return 20;
    }

    static get GRID_HEIGHT() {
        return 20;
    }

    static get BLOCK_SIZE() {
        return 1;
    }

    static get CELL() {
        return _CELL;
    }

    static get DIRECTION() {
        return _DIRECTION;
    }
}