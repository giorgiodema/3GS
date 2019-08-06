// An enum to keep track of the cells state
var CELL = {
    EMPTY: 0,
    UNDEFINED: 1,
    WALL: 2,
    PASSAGE: 3,
    PLAYER: 4,
    TARGET: 5
}

/* ==================
 * Position
 * ==================
 * A simple class that just holds a pair of coordinates */
class Position {
    constructor(y, x) {
        this._y = y;
        this._x = x;
    }

    // Gets the Y coordinate
    get y() {
        return this._y;
    }

    // Gets the X coordinate
    get x() {
        return this._x;
    }
}

/* ==================
 * Maze
 * ==================
 * A class that represents a random maze that can be navigated */
class Maze {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._combinedHeight = height * 2 + 1;
        this._combinedWidth = width * 2 + 1;
        this._grid = []
        this._position = null;
        this._target = null;

        // Initialize a new [height, width] array
        this._initialize();
    }

    // Initializes the current maze with a new random structure
    _initialize() {

        // 1. Start with a grid full of walls
        for (var i = 0; i < this._combinedHeight; i++) {
            var row = [];
            for (var j = 0; j < this._combinedWidth; j++) {
                if (i % 2 == 0 || j % 2 == 0) row.push(CELL.WALL);
                else row.push(CELL.UNDEFINED);
            }
            this._grid.push(row);
        }

        // 2. Pick a cell, mark it as part of the maze
        var walls = [];
        var cell = new Position(
            Math.floor(Math.random() * this._height) * 2 + 1,
            Math.floor(Math.random() * this._width) * 2 + 1
        );
        this._grid[cell.y][cell.x] = CELL.EMPTY;

        // 2.1. Add the walls of the cell to the wall list
        this._executeOnAdjacentCells(cell.y, cell.x, pos => {
            if (this._grid[pos.y][pos.x] == CELL.WALL) {
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

            // Count the visited adjacent cells
            var adjacent = [];
            this._executeOnAdjacentCells(pos.y, pos.x, adj =>
            {
                if (this._grid[adj.y][adj.x] == CELL.UNDEFINED) {
                    adjacent.push(adj);
                }
            });

            // 3.1.1. If only one of the two cells that the wall divides is visited
            if (adjacent.length == 1) {
                this._grid[pos.y][pos.x] = CELL.PASSAGE;
                this._grid[adjacent[0].y][adjacent[0].x] = CELL.EMPTY;

                // 3.1.2. Add the neighboring walls of the cell to the wall list
                this._executeOnAdjacentCells(adjacent[0].y, adjacent[0].x, next => {
                    if (this._grid[next.y][next.x] == CELL.WALL) {
                        walls.push(next);
                    }
                });
            }
        }

        // Spawn the player and the target
        for (var i = 0; i < this._combinedWidth; i++) {
            if (this._grid[this._combinedHeight - 2][i] == CELL.EMPTY ||
                this._grid[this._combinedHeight - 2][i] == CELL.PASSAGE) {
                this._position = new Position(this._combinedHeight - 2, i);
                this._grid[this._position.y][this._position.x] = CELL.PLAYER;
                break;
            }
        }

        // Spawn the target
        for (var i = this._combinedWidth - 2; i > 0; i--) {
            if (this._grid[1][i] == CELL.EMPTY ||
                this._grid[1][i] == CELL.PASSAGE) {
                this._target = new Position(1, i);
                this._grid[this._target.y][this._target.x] = CELL.TARGET;
                break;
            }
        }
    }

    // Invokes a callback function on the valid adjacent cells to the given coordinates
    _executeOnAdjacentCells(y, x, f) {
        if (y > 0) f(new Position(y - 1, x));
        if (y < this._combinedHeight - 1) f(new Position(y + 1, x));
        if (x > 0) f(new Position(y, x - 1));
        if (x < this._combinedWidth - 1) f(new Position(y, x + 1));
    }



    // Returns a string representation of the current maze
    toString() {
        var result = '';
        for (var i = 0; i < this._combinedHeight; i++) {
            var line = '';
            for (var j = 0; j < this._combinedWidth; j++) {
                switch (this._grid[i][j]) {
                    case CELL.EMPTY:
                    case CELL.PASSAGE:
                        line += '  '; break;
                    case CELL.UNDEFINED: line += '░░'; break;
                    case CELL.WALL: line += '██'; break;
                    case CELL.PLAYER: line += '🤖'; break;
                    case CELL.TARGET: line += '🥇'; break;
                    default: throw 'Invalid cell value: ' + this._grid[i][j];
                }
            }
            result += line;
            if (i < this._combinedHeight - 1) result += '\n';
        }
        return result;
    }
}

var maze = new Maze(8, 6);
console.log(maze.toString());