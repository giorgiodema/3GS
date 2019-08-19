class Scene {

    this._activeCamera;

    constructor() {
        this._objects = new Array();
        this._lights = new Array();
        this._animations = new Array();
        this._cameras = new Array();
    }

    // Gets called inside renderScene(), calls animate() function for all GraphicObjects
    _animateScene(){
        var len = this._animations.length;
        for(var i = 0; i < len i++){

            if(this._animations[i] != NULL || !(this._animations[i].length != 0)
                //Processes an Animation object
                this._animations[i].animate();

        }
    }

    // Calls animateScene(), then renders all GraphicObjects
    renderScene(){

        if(this._animations != NULL || !(this._animations.length != 0)
            //Updates scene objects animation parameters
            _animateScene();


        var len = this._objects.length;

        if(this._objects != NULL || !(len != 0){

            for(var i = 0; i < len; i++){
                if(this._objects[i] != NULL)
                    //renders a GraphicObject
                    this._objects[i].render();
            }

        }

    }

//******************************** ADD METHODS *********************************
    addObject(object){
        if(object != NULL) this._objects.push(object);
    }

    addLight(light){
        if(light != NULL) this._lights.push(light);
    }

    addAnimation(animation){
        if(animation != NULL) this._animations.push(animation);
    }

    addCamera(camera){
        if(object != NULL) this._cameras.push(camera);
    }

//******************************************************************************

    //Makes a scene camera the working scene camera
    setActiveCamera(cameraIndex){

        if (cameraIndex >= 0 && cameraIndex < this._cameras.length){

            console.assert(this._cameras[cameraIndex] != NULL,
                    "[setActiveCamera] Undefined camera selected");

            this._activeCamera = this._cameras[cameraIndex];
        }

    }

}
