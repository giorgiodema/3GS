class ObjectController{
    constructor(obj){
        this.object = obj;
        this.fwStep = 0.5;
        this.rotStep = 0.5;
        this.direction = vec3(0.0,0.0,1.0);
        this.moving = false;
        this.rotateRight = false;
        this.rotateLeft = false;
        this._cameraController = null;
        this.object.setController(this);
        window.onkeydown = this._directionKeyDown(this);
        window.onkeyup   = this._directionKeyUp(this);
    }

    update(){
        if(this.moving){
            this.object.translate(  this.direction[0]*this.fwStep,
                                    this.direction[1]*this.fwStep,
                                    this.direction[2]*this.fwStep);
            
            if(this._cameraController!==null){
                let eye = this._cameraController.getCamera().eye;
                let pos = this.object.pos;
                this._cameraController.getCamera().eye = vec3(pos[0]-(this.direction[0]*this._cameraController._distance),pos[1] + this._cameraController._height,pos[2]-(this.direction[2]*this._cameraController._distance));
                eye = this._cameraController.getCamera().eye;
                this._cameraController.getCamera().at = vec3(eye[0]+this.direction[0],eye[1]+this.direction[1],eye[2]+this.direction[2]);
            }
            
        }
        if(this.rotateRight){
            // rotate obj
            let pos = this.object.pos;
            let aux = vec4(pos[0],pos[1],pos[2],1.0);
            this.object.translate(-aux[0],-aux[1],-aux[2]);
            this.object.rotate(-this.rotStep,[0,1,0]);
            this.object.translate(aux[0],aux[1],aux[2]);

            // rotate direction
            
            aux = vec4(this.direction[0],this.direction[1],this.direction[2],1.0);
            aux = mult(rotateY(-this.rotStep),aux);
            this.direction = vec3(aux[0],aux[1],aux[2]);
            

            
            if(this._cameraController!==null){
                this._cameraController.getCamera().eye = vec3(pos[0]-(this.direction[0]*this._cameraController._distance),pos[1] + this._cameraController._height,pos[2]-(this.direction[2]*this._cameraController._distance));
                let eye = this._cameraController.getCamera().eye;
                this._cameraController.getCamera().at = vec3(eye[0]+this.direction[0],eye[1]+this.direction[1],eye[2]+this.direction[2]);
            }
            

            
        }

        if(this.rotateLeft){
            // rotate obj
            let pos = this.object.pos;
            let aux = vec4(pos[0],pos[1],pos[2],1.0);
            this.object.translate(-aux[0],-aux[1],-aux[2]);
            this.object.rotate(this.rotStep,[0,1,0]);
            this.object.translate(aux[0],aux[1],aux[2]);

            // rotate direction
            
            aux = vec4(this.direction[0],this.direction[1],this.direction[2],1.0);
            aux = mult(rotateY(this.rotStep),aux);
            this.direction = vec3(aux[0],aux[1],aux[2]);
            

            
            if(this._cameraController!==null){
                this._cameraController.getCamera().eye = vec3(pos[0]-(this.direction[0]*this._cameraController._distance),pos[1] + this._cameraController._height,pos[2]-(this.direction[2]*this._cameraController._distance));
                let eye = this._cameraController.getCamera().eye;
                this._cameraController.getCamera().at = vec3(eye[0]+this.direction[0],eye[1]+this.direction[1],eye[2]+this.direction[2]);
            }
            

            
        }
    }

    bindCameraController(cameraController){
        this._cameraController = cameraController;
    }

    _directionKeyDown(contr){
        return function(e){
            switch(e.key){
                case "w":
                    contr.moving = true;
                    break;
                case "d":
                    contr.rotateRight = true;
                    break;
                case "a":
                        contr.rotateLeft = true;
                        break;
            }
        }
    }

    _directionKeyUp(contr){
        return function(e){
            switch(e.key){
                case "w":
                    contr.moving = false;
                    break;
                case "d":
                    contr.rotateRight = false;
                    break;
                case "a":
                        contr.rotateLeft = false;
                        break;
                
            }
        }
    }
}