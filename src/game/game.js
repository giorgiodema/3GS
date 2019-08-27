"use strict";

var scene;
window.onload = function init()
{
    scene = new Scene("gl-canvas");
    scene.init(function() {



        // initialize colored cubes, to test camera and object controllers

        for(let i = 0; i < 500; i++){
            let ci = new Cube();
            let scale = Math.floor(Math.random()*5);
            ci.scale(scale,scale,scale);

            let x = Math.floor(Math.random()*100);
            let y = Math.floor(Math.random()*100);
            let z = Math.floor(Math.random()*100);

            x = Math.random() >= 0.5 ? x : -x;
            y = Math.random() >= 0.5 ? y : -y;
            z = Math.random() >= 0.5 ? z : -z;
            
            ci.setPosition(x,y,z);

            ci.setRotation(Math.floor(Math.random()*360),[1,0,0]);
            ci.setRotation(Math.floor(Math.random()*360),[0,1,0]);
            ci.setRotation(Math.floor(Math.random()*360),[0,0,1]);
            scene.addObject(ci);
        }

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