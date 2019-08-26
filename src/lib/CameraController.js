class CameraController{
    constructor(camera){
        this.camera = camera;
        this.step = 0.05;
        this.zoom = 1;

        // bound object controller
        this._objectController = null;
        this._distance = 0;
        this._height = 0;
        document.addEventListener('mousemove',this._mouseController(this));
        document.addEventListener('wheel',this._wheelController(this));
    }

    _mouseController(contr){
        return function(e){
            //console.log("X:"+e.movementX);
            //console.log("Y:"+e.movementY);
            if(contr._objectController!=null && (contr._objectController.moving || contr._objectController.rotatingLeft || contr._objectController.rotatingRight))
                return;
            let sx = contr.step * e.movementX;
            let sy = contr.step * e.movementY;
            contr.camera.at = vec3(contr.camera.at[0] + sx,contr.camera.at[1] - sy,contr.camera.at[2]);
            //console.log(contr.camera.at);
        }
   
    }

    _wheelController(contr){
        return function(e){
            if(e.deltaY < 0)
                contr._distance-=contr.zoom;
            else
                contr._distance+=contr.zoom;
            contr.camera.eye = vec3(contr.camera.eye[0],contr._distance,contr.camera.eye[2]);
        }
    }

    bindObjectController(objController,distance,height){
        this._distance = distance;
        this._height = height;
        this._objectController = objController;
        this.camera.eye = vec3(this.camera.eye[0],height,distance);
        this.camera.at = objController.object.pos;
        objController.bindCameraController(this);
    }

    getCamera(){
        return this.camera;
    }
}