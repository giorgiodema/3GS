class CameraController{
    constructor(camera){
        this._camera = camera;
        this._step = 0.05;
        this._zoom = 1;

        // bound object controller
        this._objectController = null;
        //document.addEventListener('mousemove',this._mouseController(this));
        document.addEventListener('wheel',this._wheelController(this));
    }

    /*
    _mouseController(contr){
        return function(e){
            if(contr._objectController!=null && contr._objectController.isMoving())
                return;
            let sx = contr._step * e.movementX;
            let sy = contr._step * e.movementY;
            contr._camera.at[0] += sx;
            contr._camera.at[1] -= sy;
        }
   
    }
    */

    _wheelController(contr){
        return function(e){
            if(e.deltaY < 0)
            contr._camera.eye[1]-=contr._zoom;
            else
            contr._camera.eye[1]+=contr._zoom;
        }
    }

    bindObjectController(objController,distance,height){
        this._objectController = objController;
        this._camera.eye = vec3(this._camera.eye[0],height,distance);
        this._camera.at = objController.object.pos;
        objController.bindCameraController(this);
    }

    get camera(){
        return this._camera;
    }
}