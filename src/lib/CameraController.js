class CameraController{
    constructor(camera){
        this._camera = camera;
        this._step = 0.05;
        this._zoom = 1;

        this._distance = 0;
        this._height = 0;

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
            if(e.deltaY < 0){
                contr._height -= contr._zoom;
                contr._distance -= contr._zoom;   
            }
            else{
                contr._height += contr._zoom;
                contr._distance += contr._zoom;
            }
            if(contr._objectController!==null){
                let pos = contr._objectController.object.pos;
                contr._camera.eye = vec3(pos[0]-(contr._objectController.direction[0]*contr._distance),pos[1] + contr._height,pos[2]-(contr._objectController.direction[2]*contr._distance));
                contr._camera.at = vec3(pos[0],pos[1],pos[2]);
            }
        }
    }

    bindObjectController(objController,distance,height){
        this._distance = distance;
        this._height = height;
        this._objectController = objController;
        this._camera.eye = vec3(objController.object.pos[0],height,objController.object.pos[2]+distance);
        this._camera.at = objController.object.pos;
        objController.bindCameraController(this);
    }

    get camera(){
        return this._camera;
    }

    get height(){
        return this._height;
    }

    get distance(){
        return this._distance;
    }
}