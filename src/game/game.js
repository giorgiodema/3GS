"use strict";

var scene;
window.onload = () =>
{
    // disable scroll
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome

    scene = new Scene("gl-canvas");
    scene.init(() => {

        
        let maze = buildMazeGeometry();

        let camera = new PerspectiveCamera();

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        camera.setPosition(Constants.GRID_WIDTH/2, 100, Constants.GRID_HEIGHT/2);
        camera.setFar(1000);

        let cc = new CameraController(camera);

        render();
    });
};

function render() {
    scene.renderScene();
    requestAnimFrame(render);
}

function buildMazeGeometry(){
    let tree = null;
    let maze = new Maze(Constants.GRID_WIDTH,Constants.GRID_HEIGHT);
    console.log(maze.toString());
    
    for(let i=0; i<maze.grid.length; i++){
        for(let j=0; j<maze.grid[0].length; j++){
            if (maze.grid[i][j] == Constants.CELL.WALL) {
                let cube = new Cube();
                cube.setPosition(j*Constants.BLOCK_SIZE,Constants.BLOCK_SIZE/2,i*Constants.BLOCK_SIZE)
                
                if (tree === null){
                    scene.addObject(cube);
                    tree = cube;
                }
                else tree.addChild(cube);        
            }
        }
    }

    return tree;
}
