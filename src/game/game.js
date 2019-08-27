"use strict";

var scene;
window.onload = function init()
{
    scene = new Scene("gl-canvas");
    scene.init(function() {

        var maze = new Maze(Constants.GRID_WIDTH,Constants.GRID_HEIGHT);
        var g = maze.grid;
        var c = Constants.CELL.PLAYER;

        let camera = new PerspectiveCamera();

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        camera.setPosition(0.0, 0.0, -50);
        camera.setFar(1000);

        let cc = new CameraController(camera);

        render();
    });
};

var render  = function() {
    scene.renderScene();
    requestAnimFrame(render);
}