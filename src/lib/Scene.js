class Scene {
    constructor(canvasID) {
        this._objects = new Array();
        this._lights = new Array();
        this._animations = new Array();
        this._cameras = new Array();
        this._activeCamera;
        this.program;

        this.vBuffer;
        this.nBuffer;
        this.cBuffer;

        this.vArray = new Array();
        this.nArray = new Array();
        this.cArray = new Array();
        
        this.canvas = document.getElementById(canvasID);
        this._gl = WebGLUtils.setupWebGL(this.canvas);
        if (!this._gl) { alert("WebGL isn't available"); }
        
        this._gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this._gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this._gl.enable(this._gl.DEPTH_TEST);
    }
    // Necessary to call this before using the scene
    init(callback) {
        let self = this;
        var program = initShadersFromFile( this._gl, "../lib/shaders/phong.vert", "../lib/shaders/phong.frag", function(program) {
            self.program = program;
            self._gl.useProgram(self.program);
            if(callback !== undefined) {  callback(); }
        });

    }

    get gl() {
        return this._gl;
    }

    // Gets called inside renderScene(), calls animate() function for all GraphicObjects
    _animateScene(){
        var len = this._animations.length;
        for(var i = 0; i < len; i++){

            if(this._animations[i] != null && this._animations[i].length != 0 )
                //Processes an Animation object
                this._animations[i].animate();

        }
    }

    // Calls animateScene(), then renders all GraphicObjects
    renderScene(){
        this._gl.clear( this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        var currViewMatrix = this._activeCamera.getViewMatrix();
        // Update the view matrix on the GPU
        this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this.program, "viewMatrix" ), false, flatten(currViewMatrix));

        var currProjMatrix = this._activeCamera.getProjectionMatrix();
        // Update the projection matrix on the GPU
        this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this.program, "projectionMatrix" ), false, flatten(currProjMatrix));

        if(this._animations != null && (this._animations.length != 0))
            //Updates scene objects animation parameters
            this._animateScene();


        var len = this._objects.length;

        if(this._objects != null && (len != 0)){
            for(var i = 0; i < len; i++){
                if(this._objects[i] != null)
                    //renders a GraphicObject
                    this._objects[i].render(new mat4());
            }
        }
    }

//******************************** ADD METHODS *********************************
    addObject(object){
        if(object != null) {
            this._objects.push(object);
            object.scene = this;
            object.initBuffers();
        }
    }

    addLight(light){
        if(light != null) this._lights.push(light);
    }

    addAnimation(animation){
        if(animation != null) this._animations.push(animation);
    }

    addCamera(camera){
        if(camera != null) this._cameras.push(camera);
    }

    // As of now, rendering only supports one light
    getLight(){
        console.assert(this._lights.length !== 0, "Warning: the scene has no lights!");
        return this._lights[0];
    }

//******************************************************************************

    //Makes a scene camera the working scene camera
    setActiveCamera(cameraIndex){

        if (cameraIndex >= 0 && cameraIndex < this._cameras.length){

            console.assert(this._cameras[cameraIndex] != null,
                    "[setActiveCamera] Undefined camera selected");

            this._activeCamera = this._cameras[cameraIndex];
        }

    }

}
