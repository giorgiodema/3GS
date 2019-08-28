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

        //UPPER LEGS ANIMATION
        let fRot1 = [null, null, -45];
        let fRot2 = [null, null, 0];
        let iPos1 = [upperLegR.pos[0], upperLegR.pos[1], upperLegR.pos[2]];
        let iRot1 = [upperLegR.rot[0], upperLegR.rot[1], upperLegR.rot[2]];
        let iRot2 = [0, 0, -45];
        let iScale1 = [upperLegR.scale[0], upperLegR.scale[1], upperLegR.scale[2]];

        let fRot3 = [null, null, 45];
        let iPos3 = [upperLegL.pos[0], upperLegL.pos[1], upperLegL.pos[2]];
        let iRot3 = [upperLegL.rot[0], upperLegL.rot[1], upperLegL.rot[2]];
        let iRot4 = [0, 0, 45];
        let iScale3 = [upperLegL.scale[0], upperLegL.scale[1], upperLegL.scale[2]];

        //KeyframeShift parameters: (object, frames, initPos, initRot, initScale, finalPos, finalRot, finalScale)
        let k1 = new KeyframeShift(upperLegR, 30, iPos1, iRot1, iScale1, null, fRot1, null);
        let k2 = new KeyframeShift(upperLegR, 30, iPos1, iRot2, iScale1, null, fRot2, null);
        let k3 = new KeyframeShift(upperLegL, 30, iPos3, iRot3, iScale3, null, fRot3, null);
        let k4 = new KeyframeShift(upperLegL, 30, iPos3, iRot4, iScale3, null, fRot2, null);
        let anim1 = new Animation(true, new Array(k1, k2));
        let anim2 = new Animation(true, new Array(k3, k4));
        scene.addAnimation(anim1);
        scene.addAnimation(anim2);

        //UPPER ARMS ANIMATION
        let fRot5 = [null, null, -45];
        let fRot7 = [null, null, 45];
        let iScale5 = [upperArmR.scale[0], upperArmR.scale[1], upperArmR.scale[2]];
        let iScale7 = [upperArmL.scale[0], upperArmL.scale[1], upperArmL.scale[2]];
        let iPos5 = [upperArmR.pos[0], upperArmR.pos[1], upperArmR.pos[2]];
        let iPos7 = [upperArmL.pos[0], upperArmL.pos[1], upperArmL.pos[2]];
        let k5 = new KeyframeShift(upperArmR, 30, iPos5, iRot1, iScale5, null, fRot5, null);
        let k6 = new KeyframeShift(upperArmR, 30, iPos5, iRot2, iScale5, null, fRot2, null);
        let k7 = new KeyframeShift(upperArmL, 30, iPos7, iRot3, iScale7, null, fRot7, null);
        let k8 = new KeyframeShift(upperArmL, 30, iPos7, iRot4, iScale7, null, fRot2, null);
        let anim3 = new Animation(true, new Array(k5, k6));
        let anim4 = new Animation(true, new Array(k7, k8));
        scene.addAnimation(anim3);
        scene.addAnimation(anim4);

        let camera = new PerspectiveCamera();

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        camera.setPosition(0.0, 0.0, -50);
        camera.setFar(1000);

        let cc = new CameraController(camera);
        cc.bindObjectController(charController,30,30);

        render();
    });
};

var render  = function() {
    scene.renderScene();
    requestAnimFrame(render);
}
