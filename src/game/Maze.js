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
                row.push(0);
            }
            this.grid.push(row);
        }
    }
}