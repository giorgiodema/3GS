class CameraController{
    constructor(camera){
        this.camera = camera;
        this.step = 0.0005;

        // bound object controller
        this._objectController = null;
        this._distance = 0;
        this._height = 0;
        document.addEventListener('mousemove',this._mouseController(this));
    }

    _mouseController(contr){
        return function(e){
            //console.log("X:"+e.movementX);
            //console.log("Y:"+e.movementY);
            let sx = contr.step * e.movementX;
            let sy = contr.step * e.movementY;
            contr.camera.at = vec3(contr.camera.at[0] - sx,contr.camera.at[1] - sy,contr.camera.at[2]);
            //console.log(contr.camera.at);
        }
   
    }

    bindObjectController(objController,distance,height){
        this._distance = distance;
        this._height = height;
        this._objectController = objController;
        objController.bindCameraController(this);
    }

    getCamera(){
        return this.camera;
    }
}