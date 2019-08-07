//python -m http.server 9000

var SERVER_ADDR = "http://localhost:9000";
var OBJ_PATH = "src/game/Assets/Character/model_separated.obj"


window.onload = function init() {
    var p = new Parser(SERVER_ADDR,OBJ_PATH);
    p.parse();
    
    var components = p.getComponents();
    console.log("Components Names:" + components.toString());

    var torsoVertices = p.getVertices("Torso");
    console.log("Torso Vertices:" + torsoVertices);
    /*torsoVertices.forEach(v => {
        console.log(v.toString());
    });*/

}