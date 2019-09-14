"use strict";

//var SERVER_ADDR = "https://giorgiodema.github.io/3GS";
var SERVER_ADDR = "http://localhost:9000";
var scene;
var mazes;

window.onload = () => {
    // Make the canvas independent from the screen size
    let canvas = document.getElementById("gl-canvas");
    var myHeight = window.innerHeight;

    // Canvas values
    var WIDTH = res_independent(670, myHeight),
    HEIGHT = res_independent(670, myHeight);



    canvas.style.height = HEIGHT.toString() + 'px'; //Reminder that CSS parameters are string
    canvas.style.width = WIDTH.toString() + 'px';



    mazes = [];
    let maze_sizes = [Math.trunc(Constants.GRID_WIDTH*(1/3)),Math.trunc(Constants.GRID_WIDTH*(2/3)), Constants.GRID_WIDTH];

    for (let i = 0; i < 3; i++) {
        let maze = new Maze(maze_sizes[i], maze_sizes[i]);
        mazes.push(maze);
    }
    document.getElementById("lvl1").innerHTML = "<pre>" + mazes[0].toString() + "</pre>";
    document.getElementById("lvl2").innerHTML = "<pre>" + mazes[1].toString() + "</pre>";
    document.getElementById("lvl3").innerHTML = "<pre>" + mazes[2].toString() + "</pre>";

};

function game(mazeNumber) {
    // disable scroll
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome

    // Hide menu
    document.getElementsByClassName("menu")[0].hidden = "true";
    document.getElementsByClassName("menutext")[0].hidden = "true";

    document.getElementById("gl-canvas").hidden = "false";


    scene = new Scene("gl-canvas");
    scene.init(() => {

        let values = buildMazeGeometry(mazes[mazeNumber], Constants.WALL_COLOR, Constants.GROUND_COLOR);
        let maze = values[0];
        let mazeLogic = values[1];
        let aux = buildCharacterGeometry();
        let character = aux[0];
        let animations = aux[1];

        character.rotate(90.0, [0, 1, 0], null);
        maze.setPosition(0.0, 0.0, 0.0);
        character.scale(Constants.CHARACTER_SCALING, Constants.CHARACTER_SCALING, Constants.CHARACTER_SCALING);
        character.setPosition(mazeLogic.position.x, Constants.CHARACTER_HEIGHT, mazeLogic.position.y);

        let camera = new PerspectiveCamera();
        camera.setFar(1000);

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        let cameraController = new CameraController(camera);
        let characterController = new ObjectController(character);

        animations.forEach(element => {
            characterController.addAnimation(element);
        });

        // setup the position validation function
        characterController.positionValidator = pos => {

            // calculate the effective character position
            let cx = pos[0] + 0.5;
            let cy = pos[2] + 0.5;

            // check boundaries in a circle of radius 0.1, in 20 degrees intervals
            for (let i = 0; i < 18; i++) {
                let radians = i * 20 * (180 / Math.PI);
                let x = cx + 0.1 * Math.cos(radians);
                let y = cy + 0.1 * Math.sin(radians);
                let xCell = Math.trunc(x); // Truncate to get the logical coordinate
                let yCell = Math.trunc(y);

                // abort if the next move would make the player go into a wall
                if (mazeLogic.grid[yCell][xCell] == Constants.CELL.WALL) {
                    return false;
                }
            }

            return true;
        };

        cameraController.bindObjectController(characterController, Constants.CAMERA_DISTANCE, Constants.CAMERA_HEIGHT);

        let light = new DirectionalLight();
        scene.addLight(light);

        light.setPosition(Constants.GRID_WIDTH / 2, Constants.LIGHT_HEIGHT, Constants.GRID_WIDTH / 2);

        let textureImporter = new TextureImporter("./Assets/Character/texture.png");
        textureImporter.getTexture(function (processedTexture) {
            character.addColorMap(processedTexture);

            let controls_message = document.getElementById("controls");
            //controls_message.style.fontSize = res_independent(120, window.innerHeight).toString() + "%";
            controls_message.style.display = "inline";
        	window.setTimeout(vanishControls, 7000);
            render();
        });
    });
}

function render() {
    scene.renderScene();
    requestAnimFrame(render);
}

function buildMazeGeometry(maze, wallColor, groundColor) {
    let tree = null;
    console.log(maze.toString());

    for (let i = 0; i < maze.grid.length; i++) {
        for (let j = 0; j < maze.grid[0].length; j++) {
            let cube;
            if (maze.grid[i][j] == Constants.CELL.WALL) {
                cube = new Cube(wallColor[0], wallColor[1], wallColor[2]);
                cube.setPosition(j * Constants.BLOCK_SIZE, Constants.BLOCK_SIZE / 2, i * Constants.BLOCK_SIZE);
            }
            else {
                cube = new Cube(groundColor[0], groundColor[1], groundColor[2]);
                cube.scale(1.0, 0.0001, 1.0);
                cube.setPosition(j * Constants.BLOCK_SIZE, -0.001, i * Constants.BLOCK_SIZE);
            }




            if (tree === null) {
                scene.addObject(cube);
                tree = cube;
            }
            else tree.addChild(cube);
        }
    }

    return [tree, maze];
}

function buildCharacterGeometry() {

    // parse character model
    let objparser = new Parser(SERVER_ADDR, "src/game/Assets/Character/model_separated.obj");
    objparser.parse();

    //Red parts
    let charMat1Ambient = vec4(0.1, 0.0, 0.0);
    let charMat1Diffuse = vec4(0.3, 0.3, 0.3);
    let charMat1Specular = vec4(1.0, 0.0, 0.0);

    //Blue parts
    let charMat2Ambient = vec4(0.0, 0.0, 1.0, 1.0);
    let charMat2Diffuse = vec4(1.0, 1.0, 1.0, 1.0);
    let charMat2Specular = vec4(0.0, 0.0, 1.0, 1.0);


    // initialize character
    let torso = new GraphicObject(objparser.getVertices("Torso"), objparser.getNormals("Torso"), charMat1Ambient, charMat1Diffuse, charMat1Specular, objparser.getUVCoords("Torso"));

    let head = new GraphicObject(objparser.getVertices("Head"), objparser.getNormals("Head"), charMat2Ambient, charMat2Diffuse, charMat2Specular, objparser.getUVCoords("Head"));

    let upperLegR = new GraphicObject(objparser.getVertices("Upper_Leg_R"), objparser.getNormals("Upper_Leg_R"), charMat2Ambient, charMat2Diffuse, charMat2Specular, objparser.getUVCoords("Upper_Leg_R"));

    let upperLegL = new GraphicObject(objparser.getVertices("Upper_Leg_L"), objparser.getNormals("Upper_Leg_L"), charMat2Ambient, charMat2Diffuse, charMat2Specular, objparser.getUVCoords("Upper_Leg_L"));

    let upperArmR = new GraphicObject(objparser.getVertices("Upper_Arm_R"), objparser.getNormals("Upper_Arm_R"), charMat2Ambient, charMat2Diffuse, charMat2Specular, objparser.getUVCoords("Upper_Arm_R"));

    let upperArmL = new GraphicObject(objparser.getVertices("Upper_Arm_L"), objparser.getNormals("Upper_Arm_L"), charMat2Ambient, charMat2Diffuse, charMat2Specular, objparser.getUVCoords("Upper_Arm_L"));

    let lowerArmR = new GraphicObject(objparser.getVertices("Lower_Arm_R"), objparser.getNormals("Lower_Arm_R"), charMat1Ambient, charMat1Diffuse, charMat1Specular, objparser.getUVCoords("Lower_Arm_R"));

    let lowerArmL = new GraphicObject(objparser.getVertices("Lower_Arm_L"), objparser.getNormals("Lower_Arm_L"), charMat1Ambient, charMat1Diffuse, charMat1Specular, objparser.getUVCoords("Lower_Arm_L"));

    let lowerLegR = new GraphicObject(objparser.getVertices("Lower_Leg_R"), objparser.getNormals("Lower_Leg_R"), charMat1Ambient, charMat1Diffuse, charMat1Specular, objparser.getUVCoords("Lower_Leg_R"));

    let lowerLegL = new GraphicObject(objparser.getVertices("Lower_Leg_L"), objparser.getNormals("Lower_Leg_L"), charMat1Ambient, charMat1Diffuse, charMat1Specular, objparser.getUVCoords("Lower_Leg_L"));

    let footR = new GraphicObject(objparser.getVertices("Foot_R"), objparser.getNormals("Foot_R"), charMat1Ambient, charMat1Diffuse, charMat1Specular, objparser.getUVCoords("Foot_R"));

    let footL = new GraphicObject(objparser.getVertices("Foot_L"), objparser.getNormals("Foot_L"), charMat1Ambient, charMat1Diffuse, charMat1Specular, objparser.getUVCoords("Foot_L"));

    // build the character tree
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


    //-----------------------------------ANIMATIONS-----------------------------
    let iRot = vec3(0.0,0.0,0.0);
    let steps = 4;

    //---------------------------------------------rotate upper Legs------------
    //RIGHT LEG
    let fUpperLegRRotY1 = vec3(0.0,0.0,35);
    let fUpperLegRRotY2 = vec3(0.0,0.0,-35);
    let uLegR1 = new KeyframeShift(torso,upperLegR,steps,null,iRot,null,null,fUpperLegRRotY1,null,null);
    let uLegR2 = new KeyframeShift(torso,upperLegR,steps,null,fUpperLegRRotY1,null,null,iRot,null,null);
    let uLegR3 = new KeyframeShift(torso,upperLegR,steps,null,iRot,null,null,fUpperLegRRotY2,null,null);
    let uLegR4 = new KeyframeShift(torso,upperLegR,steps,null,fUpperLegRRotY2,null,null,iRot,null,null);
    let uppperLegRAnim = new Animation(true,new Array(uLegR1,uLegR2,uLegR3,uLegR4));

    //LEFT LEG
    let fUpperLegLRotY1 = vec3(0.0,0.0,-35);
    let fUpperLegLRotY2 = vec3(0.0,0.0,35);
    let uLegL1 = new KeyframeShift(torso,upperLegL,steps,null,iRot,null,null,fUpperLegLRotY1,null,null);
    let uLegL2 = new KeyframeShift(torso,upperLegL,steps,null,fUpperLegLRotY1,null,null,iRot,null,null);
    let uLegL3 = new KeyframeShift(torso,upperLegL,steps,null,iRot,null,null,fUpperLegLRotY2,null,null);
    let uLegL4 = new KeyframeShift(torso,upperLegL,steps,null,fUpperLegLRotY2,null,null,iRot,null,null);
    let uppperLegLAnim = new Animation(true,new Array(uLegL1,uLegL2,uLegL3,uLegL4));

    // --------------------------------------------rotate lower Legs------------
    //LEFT LEG
    let fLowerLegLRotY1 = vec3(0.0,0.0, 0.0);
    let fLowerLegLRotY2 = vec3(0.0,0.0, -50);
    let fLowerLegLPosY2 = vec3 (0.0, 1, 0.0);
    let lLegL1 = new KeyframeShift(torso,lowerLegL,steps,null,iRot,null,null,fLowerLegLRotY1,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lLegL2 = new KeyframeShift(torso,lowerLegL,steps,null,fLowerLegLRotY1,null,null,iRot,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lLegL3 = new KeyframeShift(torso,lowerLegL,steps,null,iRot,null,null,fLowerLegLRotY2,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lLegL4 = new KeyframeShift(torso,lowerLegL,steps,null,fLowerLegLRotY2,null,null,iRot,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lowerLegLAnim = new Animation(true,new Array(lLegL1,lLegL2,lLegL3,lLegL4));

    //RIGHT LEG
    let fLowerLegRRotY1 = vec3(0.0,0.0, -50);
    let fLowerLegRRotY2 = vec3(0.0,0.0, 0.0);
    let fLowerLegRPosY2 = vec3 (0.0, 1, 0.0);
    let lLegR1 = new KeyframeShift(torso,lowerLegR,steps,null,iRot,null,null,fLowerLegRRotY1,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lLegR2 = new KeyframeShift(torso,lowerLegR,steps,null,fLowerLegRRotY1,null,null,iRot,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lLegR3 = new KeyframeShift(torso,lowerLegR,steps,null,iRot,null, null,fLowerLegRRotY2,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lLegR4 = new KeyframeShift(torso,lowerLegR,steps,null,fLowerLegRRotY2,null,null,iRot,null,Constants.LOWER_LEG_ROTATION_POINT);
    let lowerLegRAnim = new Animation(true,new Array(lLegR1,lLegR2,lLegR3,lLegR4));


    //--------------------------------------------rotate feet-------------------

    //LEFT FOOT
    let fFootLRot1 = vec3(0.0,0.0,15);
    let fFootLRot2 = vec3(0.0,0.0,0.0);
    let footL1 = new KeyframeShift(torso,footL,steps,null,iRot,null,null,fFootLRot1,null,Constants.FOOT_ROTATION_POINT);
    let footL2 = new KeyframeShift(torso,footL,steps,null,fFootLRot1,null,null,fFootLRot1,null,Constants.FOOT_ROTATION_POINT);
    let footL3 = new KeyframeShift(torso,footL,steps,null,fFootLRot1,null,null,fFootLRot2,null,Constants.FOOT_ROTATION_POINT);
    let footL4 = new KeyframeShift(torso,footL,steps,null,fFootLRot2,null,null,iRot,null,Constants.FOOT_ROTATION_POINT);
    let footLAnim = new Animation(true, new Array(footL1,footL2,footL3,footL4));

    //RIGHT FOOT
    let fFootRRot1 = vec3(0.0,0.0,0.0);
    let fFootRRot2 = vec3(0.0,0.0,15);
    let footR1 = new KeyframeShift(torso,footR,steps,null,iRot,null,null,fFootRRot1,null,Constants.FOOT_ROTATION_POINT);
    let footR2 = new KeyframeShift(torso,footR,steps,null,fFootRRot1,null,null,fFootRRot1,null,Constants.FOOT_ROTATION_POINT);
    let footR3 = new KeyframeShift(torso,footR,steps,null,fFootRRot1,null,null,fFootRRot2,null,Constants.FOOT_ROTATION_POINT);
    let footR4 = new KeyframeShift(torso,footR,steps,null,fFootRRot2,null,null,iRot,null,Constants.FOOT_ROTATION_POINT);
    let footRAnim = new Animation(true, new Array(footR1,footR2,footR3,footR4));



    //--------------------------------------------rotate upper arms-------------

    //RIGHT UPPER ARM
    let fUArmR1 = vec3(0.0,0.0,-20);
    let fUArmR2 = vec3(0.0,0.0,20);
    let uArmR1 = new KeyframeShift(torso,upperArmR,steps,null,iRot,null,null,fUArmR1,null,Constants.UPPER_ARM_ROTATION_POINT);
    let uArmR2 = new KeyframeShift(torso,upperArmR,steps,null,fUArmR1,null,null,iRot,null,Constants.UPPER_ARM_ROTATION_POINT);
    let uArmR3 = new KeyframeShift(torso,upperArmR,steps,null,iRot,null,null,fUArmR2,null,Constants.UPPER_ARM_ROTATION_POINT);
    let uArmR4 = new KeyframeShift(torso,upperArmR,steps,null,fUArmR2,null,null,iRot,null,Constants.UPPER_ARM_ROTATION_POINT);
    let upperArmRAnim = new Animation(true,new Array(uArmR1,uArmR2,uArmR3,uArmR4));

    //LEFT UPPER ARM
    let fUArmL1 = vec3(0.0,0.0,20);
    let fUArmL2 = vec3(0.0,0.0,-20);
    let uArmL1 = new KeyframeShift(torso,upperArmL,steps,null,iRot,null,null,fUArmL1,null,Constants.UPPER_ARM_ROTATION_POINT);
    let uArmL2 = new KeyframeShift(torso,upperArmL,steps,null,fUArmL1,null,null,iRot,null,Constants.UPPER_ARM_ROTATION_POINT);
    let uArmL3 = new KeyframeShift(torso,upperArmL,steps,null,iRot,null,null,fUArmL2,null,Constants.UPPER_ARM_ROTATION_POINT);
    let uArmL4 = new KeyframeShift(torso,upperArmL,steps,null,fUArmL2,null,null,iRot,null,Constants.UPPER_ARM_ROTATION_POINT);
    let upperArmLAnim = new Animation(true,new Array(uArmL1,uArmL2,uArmL3,uArmL4));


    scene.addAnimation(uppperLegLAnim);
    scene.addAnimation(uppperLegRAnim);
    scene.addAnimation(lowerLegLAnim);
    scene.addAnimation(lowerLegRAnim);
    scene.addAnimation(footLAnim);
    scene.addAnimation(footRAnim);
    scene.addAnimation(upperArmRAnim);
    scene.addAnimation(upperArmLAnim);

    var animations = [];
    animations.push(uppperLegLAnim);
    animations.push(uppperLegRAnim);
    animations.push(lowerLegLAnim);
    animations.push(lowerLegRAnim);
    animations.push(footLAnim);
    animations.push(footRAnim);
    animations.push(upperArmRAnim);
    animations.push(upperArmLAnim);

    animations.forEach(element => {
        element.pause();
    });


    return [torso,animations];
}


function res_independent(value, myHeight) {
    //Makes every screen (or scaled window) have the same experience 
    //based on the window's height (so that 4:3 and 16:9 work the same).
    return (value / 678.0) * myHeight;
}

function vanishControls() {
    document.getElementById("controls").style.display = "none";
}
