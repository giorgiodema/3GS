"use strict";

var scene;
window.onload = function init()
{
    scene = new Scene("gl-canvas");
    scene.init(function() {
        let objparser = new Parser("http://localhost:9000", "src/game/Assets/Character/model_separated.obj");
        objparser.parse();

        console.log(objparser.getComponents());

        // initialize character
        let colors = new Array(objparser.getVertices("Torso").length).fill(new vec3(100/255,90/255,68/255));
        let torso = new GraphicObject(objparser.getVertices("Torso"), objparser.getNormals("Torso"), colors);

        colors = new Array(objparser.getVertices("Head").length).fill(new vec3(100/255,90/255,68/255));
        let head = new GraphicObject(objparser.getVertices("Head"), objparser.getNormals("Head"), colors);

        colors = new Array(objparser.getVertices("Upper_Leg_R").length).fill(new vec3(100/255,90/255,68/255));
        let upperLegR = new GraphicObject(objparser.getVertices("Upper_Leg_R"), objparser.getNormals("Upper_Leg_R"), colors);

        colors = new Array(objparser.getVertices("Upper_Leg_L").length).fill(new vec3(100/255,90/255,68/255));
        let upperLegL = new GraphicObject(objparser.getVertices("Upper_Leg_L"), objparser.getNormals("Upper_Leg_L"), colors);

        colors = new Array(objparser.getVertices("Upper_Arm_R").length).fill(new vec3(100/255,90/255,68/255));
        let upperArmR = new GraphicObject(objparser.getVertices("Upper_Arm_R"), objparser.getNormals("Upper_Arm_R"), colors);

        colors = new Array(objparser.getVertices("Upper_Arm_L").length).fill(new vec3(100/255,90/255,68/255));
        let upperArmL = new GraphicObject(objparser.getVertices("Upper_Arm_L"), objparser.getNormals("Upper_Arm_L"), colors);

        colors = new Array(objparser.getVertices("Lower_Arm_R").length).fill(new vec3(100/255,90/255,68/255));
        let lowerArmR = new GraphicObject(objparser.getVertices("Lower_Arm_R"), objparser.getNormals("Lower_Arm_R"), colors);

        colors = new Array(objparser.getVertices("Lower_Arm_L").length).fill(new vec3(100/255,90/255,68/255));
        let lowerArmL = new GraphicObject(objparser.getVertices("Lower_Arm_L"), objparser.getNormals("Lower_Arm_L"), colors);

        colors = new Array(objparser.getVertices("Lower_Leg_R").length).fill(new vec3(100/255,90/255,68/255));
        let lowerLegR = new GraphicObject(objparser.getVertices("Lower_Leg_R"), objparser.getNormals("Lower_Leg_R"), colors);

        colors = new Array(objparser.getVertices("Lower_Leg_L").length).fill(new vec3(100/255,90/255,68/255));
        let lowerLegL = new GraphicObject(objparser.getVertices("Lower_Leg_L"), objparser.getNormals("Lower_Leg_L"), colors);

        colors = new Array(objparser.getVertices("Foot_R").length).fill(new vec3(100/255,90/255,68/255));
        let footR = new GraphicObject(objparser.getVertices("Foot_R"), objparser.getNormals("Foot_R"), colors);

        colors = new Array(objparser.getVertices("Foot_L").length).fill(new vec3(100/255,90/255,68/255));
        let footL = new GraphicObject(objparser.getVertices("Foot_L"), objparser.getNormals("Foot_L"), colors);

        scene.addObject(torso);
        torso.addChild(head);
        torso.addChild(upperLegR);
        torso.addChild(upperLegL);
        torso.addChild(upperArmR);
        torso.addChild(upperArmL);
        upperArmR.addChild(lowerArmR);
        upperArmL.addChild(lowerArmL);
        upperLegR.addChild(lowerLegR);
        upperLegL.addChild(lowerLegL);
        lowerLegR.addChild(footR);
        lowerLegL.addChild(footL);

        torso.rotate(270.0, [0, 1, 0]);
        let charController = new ObjectController(torso);

        // initialize colored cubes, to test camera and object controllers
        let c = new CubeV();
        let cubes = new Array();
        for(let i = 0; i < 500; i++){
            let ci = new GraphicObject(c.getVertices(),[],new Array(c.getVertices().length).fill(vec3(Math.random(),Math.random(),Math.random())));
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
        cc.bindObjectController(charController,50,10);

        render();
    });
};

var render  = function() {
    scene.renderScene();
    requestAnimFrame(render);
}