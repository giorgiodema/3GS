class ObjectController{
    constructor(obj){
        this._positionValidator = null;
        this._object = obj;
        this._fwStep = 0.01;
        this._rotStep = 2;
        this._direction = vec3(0.0,0.0,-1.0);
        this._moving = false;
        this._rotatingRight = false;
        this._rotatingLeft = false;
        this._cameraController = null;
        this._object.setController(this);
        window.onkeydown = this.__directionKeyDown(this);
        window.onkeyup   = this.__directionKeyUp(this);
    }

    // sets the lambda to use to validate the character position before moving it
    set positionValidator(value) {
        this._positionValidator = value;
    }

    update(){
        if(this._moving){

            // check if movement is allowed
            if (this._positionValidator !== null) {
                let next = this._object.previewTranslation(this._direction[0]*this._fwStep, this._direction[1]*this._fwStep, this._direction[2]*this._fwStep);
                if (this._positionValidator(next)) {

                    // move
                    this._object.translate(  this._direction[0]*this._fwStep,
                    this._direction[1]*this._fwStep,
                    this._direction[2]*this._fwStep);

                    if(this._cameraController!==null) {
                        let eye = this._cameraController.camera.eye;
                        let pos = this._object.pos;
                        this._cameraController.camera.eye = vec3(pos[0]-(this._direction[0]*this._cameraController._distance),pos[1] + this._cameraController._height,pos[2]-(this._direction[2]*this._cameraController._distance));
                        eye = this._cameraController.camera.eye;
                        this._cameraController.camera.at = vec3(pos[0],pos[1],pos[2]);
                    }
                }
            }
        }
        if(this._rotatingRight){
            // rotate obj
            let pos = this._object.pos;
            let aux = vec4(pos[0],pos[1],pos[2],1.0);
            this._object.translate(-aux[0],-aux[1],-aux[2]);
            this._object.rotate(-this._rotStep,[0,1,0]);
            this._object.translate(aux[0],aux[1],aux[2]);

            // rotate _direction
            
            aux = vec4(this._direction[0],this._direction[1],this._direction[2],1.0);
            aux = mult(rotateY(-this._rotStep),aux);
            this._direction = vec3(aux[0],aux[1],aux[2]);

            let eye = this._cameraController.camera.eye;
            pos = this._object.pos;
            this._cameraController.camera.eye = vec3(pos[0]-(this._direction[0]*this._cameraController._distance),pos[1] + this._cameraController._height,pos[2]-(this._direction[2]*this._cameraController._distance));
            eye = this._cameraController.camera.eye;
            this._cameraController.camera.at = vec3(pos[0],pos[1],pos[2]);
 
        }

        if(this._rotatingLeft){
            // rotate obj
            let pos = this._object.pos;
            let aux = vec4(pos[0],pos[1],pos[2],1.0);
            this._object.translate(-aux[0],-aux[1],-aux[2]);
            this._object.rotate(this._rotStep,[0,1,0]);
            this._object.translate(aux[0],aux[1],aux[2]);

            // rotate _direction
            
            aux = vec4(this._direction[0],this._direction[1],this._direction[2],1.0);
            aux = mult(rotateY(this._rotStep),aux);
            this._direction = vec3(aux[0],aux[1],aux[2]);
            
            let eye = this._cameraController.camera.eye;
            pos = this._object.pos;
            this._cameraController.camera.eye = vec3(pos[0]-(this._direction[0]*this._cameraController._distance),pos[1] + this._cameraController._height,pos[2]-(this._direction[2]*this._cameraController._distance));
            eye = this._cameraController.camera.eye;
            this._cameraController.camera.at = vec3(pos[0],pos[1],pos[2]);
        }
    }

    bindCameraController(cameraController){
        this._cameraController = cameraController;
    }

    __directionKeyDown(contr){
        return function(e){
            switch(e.key){
                case "w":
                    contr._moving = true;
                    break;
                case "d":
                    contr._rotatingRight = true;
                    break;
                case "a":
                        contr._rotatingLeft = true;
                        break;
            }
        }
    }

    __directionKeyUp(contr){
        return function(e){
            switch(e.key){
                case "w":
                    contr._moving = false;
                    break;
                case "d":
                    contr._rotatingRight = false;
                    break;
                case "a":
                        contr._rotatingLeft = false;
                        break;
                
            }
        }
    }

    get object(){
        return this._object;
    }

    get direction(){
        return this._direction;
    }

    isMoving(){
        return this._moving || this._rotatingRight || this._rotatingLeft;
    }
}