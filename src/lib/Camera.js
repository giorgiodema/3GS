class PerspectiveCamera{

    constructor(){

        // camera position and orientation
        this._eye = vec3(0.0, 0.0, 0.0);
        this._at  = vec3(0.0, 0.0, 0.0);
        this._up  = vec3(0.0, 1.0, 0.0);

        // perspective parameters
        this._fovy = 45.0;
        this._aspect = 1;
        this._near = 0.3;
        this._far = 10;
    }

    get at(){
        return this._at;
    }

    set at(at){
        this._at = at;
    }

    get eye(){
        return this._eye;
    }
    
    set eye(eye){
        this._eye = eye;
    }

    setPosition(x,y,z){
        this._eye = vec3(x,y,z);
    }

    setAspect(width,height){
        this._aspect = width/height;
    }

    setFovy(fovy){
        this._fovy = fovy;
    }

    setNear(near){
        this._near = near;
    }

    setFar(far){
        this._far = far;
    }

    getViewMatrix(){
        return lookAt(this._eye, this._at, this._up);
    }

    getProjectionMatrix(){
        return perspective( this._fovy, this._aspect, this._near, this._far );
    }


}