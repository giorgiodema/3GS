"use strict";

var gl;
var points;

var NumPoints = 5000;

window.onload = function init()
{
    var scene = new Scene("gl-canvas");
    scene.init(function() {
        let objparser = new Parser("http://localhost:9000", "src/game/Assets/Character/model_separated.obj");
        objparser.parse();

        let torsoName = objparser.getComponents()[0];
        let colors = new Array(objparser.getVertices(torsoName).length).fill(new vec3(100/255,90/255,68/255));
        let torso = new GraphicObject(objparser.getVertices(torsoName), objparser.getNormals(torsoName), colors);

        scene.addObject(torso);
        torso.initBuffers();

        torso.rotate(90.0, [0, 1, 0]);

        let headName = objparser.getComponents()[1];
        let head = new GraphicObject(objparser.getVertices(headName), objparser.getNormals(headName), colors);

        torso.addChild(head);
        head.initBuffers();

        head.rotate(90.0, [0, 1, 0]);

        let camera = new PerspectiveCamera();

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        camera.setPosition(0.0, 0.0, -50.0);
        camera.setFar(100);
        render(scene);
    });
};

var render  = function(scene) {
    scene.gl.clear( scene.gl.COLOR_BUFFER_BIT );
    scene.renderScene();
    //requestAnimFrame(render(scene));
}