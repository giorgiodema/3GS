"use strict";

var scene;
window.onload = () =>
{
    // disable scroll
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome

    scene = new Scene("gl-canvas");
    scene.init(() => {

        
        let values = buildMazeGeometry();
        let maze = values[0];
        let mazeLogic = values[1];
        let character = buildCharacterGeometry();
        buildGroundGeometry();

        character.rotate(90.0, [0, 1, 0]);
        maze.setPosition(0.0,0.0,0.0);
        character.scale(Constants.CHARACTER_SCALING,Constants.CHARACTER_SCALING,Constants.CHARACTER_SCALING);
        character.setPosition(mazeLogic.position.x,Constants.CHARACTER_HEIGHT,mazeLogic.position.y);

        let camera = new PerspectiveCamera();
        camera.setFar(1000);

        scene.addCamera(camera);
        scene.setActiveCamera(0);

        let cameraController = new CameraController(camera);
        let characterController = new ObjectController(character);
        characterController.positionValidator = pos => {
            console.log(pos);
            return true;
        };
        cameraController.bindObjectController(characterController,Constants.CAMERA_DISTANCE,Constants.CAMERA_HEIGHT);

        render();
    });
};

function render() {
    scene.renderScene();
    requestAnimFrame(render);
}

function buildMazeGeometry(){
    let tree = null;
    let maze = new Maze(Constants.GRID_WIDTH,Constants.GRID_WIDTH);
    console.log(maze.toString());
    
    for(let i=0; i<maze.grid.length; i++){
        for(let j=0; j<maze.grid[0].length; j++){
            if (maze.grid[i][j] == Constants.CELL.WALL) {
                let cube = new Cube(0.0,0.0,0.0);
                cube.setPosition(j*Constants.BLOCK_SIZE,Constants.BLOCK_SIZE/2,i*Constants.BLOCK_SIZE)
                
                if (tree === null){
                    scene.addObject(cube);
                    tree = cube;
                }
                else tree.addChild(cube);
            }
        }
    }

    return [tree,maze];
}

function buildGroundGeometry(){
    let ground = new Cube(0.5,0.5,1);
    ground.scale(Constants.GRID_WIDTH*2+1,0.000001,Constants.GRID_WIDTH*2+1);
    ground.setPosition(Constants.GRID_WIDTH,-0.001,Constants.GRID_WIDTH);
    scene.addObject(ground);
    return ground;
}

function buildCharacterGeometry(){

    // parse character model
    let objparser = new Parser("http://localhost:9000", "src/game/Assets/Character/model_separated.obj");
    objparser.parse();

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

    return torso;
}

