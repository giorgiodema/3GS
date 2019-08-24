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

        let firstObjectName = objparser.getComponents()[0];
        let colors = new Array(objparser.getVertices(firstObjectName).length).fill(new vec3(100/255,90/255,68/255));
        let trialObject = new GraphicObject(objparser.getVertices(firstObjectName), objparser.getNormals(firstObjectName), colors);

        scene.addObject(trialObject);
        trialObject.initBuffers();

        let camera = new PerspectiveCamera();

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        camera.setPosition(0.0, 0.0, -3.0);
        scene.renderScene();
    });
};


/*function render() {
    scene.gl.clear( scene.gl.COLOR_BUFFER_BIT );
    scene.gl.drawArrays( scene.gl.POINTS, 0, points.length );
}
*/