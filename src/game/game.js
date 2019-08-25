"use strict";

var scene;
window.onload = function init()
{
    scene = new Scene("gl-canvas");
    scene.init(function() {
        let objparser = new Parser("http://localhost:9000", "src/game/Assets/Character/model_separated.obj");
        objparser.parse();

        let torsoName = objparser.getComponents()[0];
        let colors = new Array(objparser.getVertices(torsoName).length).fill(new vec3(100/255,90/255,68/255));
        let torso = new GraphicObject(objparser.getVertices(torsoName), objparser.getNormals(torsoName), colors);

        scene.addObject(torso);

        torso.rotate(90.0, [0, 1, 0]);

        let headName = objparser.getComponents()[1];
        let head = new GraphicObject(objparser.getVertices(headName), objparser.getNormals(headName), colors);

        //torso.addChild(head);

        let camera = new PerspectiveCamera();

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        camera.setPosition(0.0, 0.0, -50.0);
        camera.setFar(100);
        render();
    });
};

var render  = function() {
    scene.renderScene();
    requestAnimFrame(render);
}