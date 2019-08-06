// An enum to keep track of the cells state
var CELL = {
    EMPTY: 0,
    UNDEFINED: 1,
    WALL: 2,
    PASSAGE: 3,
    PLAYER: 4
}

class Position {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
}

/* ==================
 * Maze
 * ==================
 * A class that represents a random maze that can be navigated */
class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.combinedHeight = height * 2 + 1;
        this.combinedWidth = width * 2 + 1;
        this.grid = []

        // Initialize a new [height, width] array
        this.initialize();
    }

    // Initializes the current maze with a new random structure
    initialize() {

        // 1. Start with a grid full of walls
        for (var i = 0; i < this.combinedHeight; i++) {
            var row = [];
            for (var j = 0; j < this.combinedWidth; j++) {
                if (i % 2 == 0 || j % 2 == 0) row.push(CELL.WALL);
                else row.push(CELL.UNDEFINED);
            }
            this.grid.push(row);
        }

        // 2. Pick a cell, mark it as part of the maze
        var walls = [];
        var cell = new Position(
            Math.floor(Math.random() * this.height) + 1,
            Math.floor(Math.random() * this.width) + 1
        );
        this.grid[cell.y][cell.x] = CELL.EMPTY;

        // 2.1. Add the walls of the cell to the wall list
        this.executeOnAdjacentCells(cell.y, cell.x, pos => {
            if (this.grid[pos.y][pos.x] == CELL.WALL) {
                walls.push(pos);
            }
        });

        // 3. While there are walls in the list
        while (walls.length > 0) {

            // 3.1. Pick a random wall from the list
            var i = Math.floor(Math.random() * walls.length);
            var pos = walls[i];

            // 3.2. Remove the wall from the list
            walls.splice(i, 1);
        }
    }

    // Invokes a callback function on the valid adjacent cells to the given coordinates
    executeOnAdjacentCells(y, x, f) {
        if (y > 0) f(new Position(y - 1, x));
        if (y < this.height - 1) f(new Position(y + 1, x));
        if (x > 0) f(new Position(y, x - 1));
        if (x < this.width - 1) f(new Position(y, x + 1));
    }

    // Returns a string representation of the current maze
    toString() {
        var result = '';
        for (var i = 0; i < this.combinedHeight; i++) {
            var line = '';
            for (var j = 0; j < this.combinedWidth; j++) {
                switch (this.grid[i][j]) {
                    case CELL.EMPTY:
                    case CELL.PASSAGE:
                        line += '  '; break;
                    case CELL.UNDEFINED: line += '░░'; break;
                    case CELL.WALL: line += '██'; break;
                    case CELL.PLAYER: line += '🤖'; break;
                    default: throw 'Invalid cell value: ' + this.grid[i][j];
                }
            }
            result += line;
            if (i < this.combinedHeight - 1) result += '\n';
        }
        return result;
    }
}

var maze = new Maze(20, 10);
console.log(maze.toString());