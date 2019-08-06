// An enum to keep track of the cells state
var CELL = {
    EMPTY: 0,
    WALL: 1,
    PLAYER: 2
}

/* ==================
 * Maze
 * ==================
 * A class that represents a random maze that can be navigated */
export default class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = []

        // Initialize a new [height, width] array
        for (var i = 0; i < height; i ++) {
            var row = [];
            for (var j = 0; j < width; j++) {
                row.push(CELL.EMPTY);
            }
            this.grid.push(row);
        }
    }

    // Returns a string representation of the current maze
    toString() {
        var result = '';
        for (var i = 0; i < this.height; i++) {
            var line = '';
            for (var j = 0; j < this.width; j++) {
                switch (this.grid[i][j]) {
                    case CELL.EMPTY: line += '  '; break;
                    case CELL.WALL: line += '██'; break;
                    case CELL.PLAYER: line += '🤖'; break;
                    default: throw 'Invalid cell value: ' + this.grid[i][j];
                }
            }
            result += line;
            if (i < this.height - 1) result += '\n';
        }
        return result;
    }
}