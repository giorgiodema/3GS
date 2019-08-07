//python -m http.server 9000

var SERVER_ADDR = "http://localhost:9000";
var OBJ_PATH = "src/game/Assets/Character/model_separated.obj"


window.onload = function init() {
    var p = new Parser(SERVER_ADDR,OBJ_PATH);
    p.parse();
}