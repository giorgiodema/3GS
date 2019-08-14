class GraphicObject {

    constructor(vertices, normals, colors, uvCoords, colorMap, normalsMap) {
        this._vertices = vertices;
        this._normals = normals;
        this._colors = colors;
        this._uvCoords = uvCoords;
        this._colorMap = colorMap;
        this._normalsMap = normalsMap;
        this._children = new Array();

        // Model instantiation matrix, places the object in its relative coordinates w.r.t. father
        this._instanceMatrix = new mat4();
        
        // Relative coordinates, they have to be kept coherent with _instanceMatrix 
        // in the methods performing operations on them. 
        this._pos = new vec3(0, 0, 0);
        this._rot = new vec3(0, 0, 0);
        this._scale = new vec3(1, 1, 1);
    }

    get pos() {
        return new vec3(this._pos[0], this.pos[1], this.pos[2]);
    }

    get rot() {
        return new vec3(this._rot[0], this.rot[1], this.rot[2]);
    }

    get scale() {
        return new vec3(this._scale[0], this.scale[1], this.scale[2]);
    }

    render(parentMatrix) {
        //var model = instanceMatrix*parentMatrix;
        //pass model to _children
    }

    // Adds the values of x, y, z to the position parameters of the object
    translate(x, y, z) {
        this._pos[0] = this._pos[0] + x;
        this._pos[1] = this._pos[1] + y;
        this._pos[2] = this._pos[2] + z;
        this._instanceMatrix = mult(translate(x, y, z), this._instanceMatrix);
    }

    // Rotates the object of angle, on the axes that are set to 1 in the axis array 
    // (which should be a vec3 of 0 or 1 values)
    rotate(angle, axis) {
        this._rot[0] = this._rot[0] + angle * axis[0];
        this._rot[1] = this._rot[1] + angle * axis[1];
        this._rot[2] = this._rot[2] + angle * axis[2];
        this._instanceMatrix = mult(rotate(angle, axis), this._instanceMatrix);
    }

    // Multiplies the current scale parameters of the object to those in x, y, z
    scale(x, y, z) {
        this._scale[0] = this._scale[0] * x;
        this._scale[1] = this._scale[1] * y;
        this._scale[2] = this._scale[2] * z;
        this._instanceMatrix = mult(scalem(x, y, z), this._instanceMatrix);
    }

    // Previously used in setter functions. Not used anymore after optimizations. 
    // Keeping it here in case it is needed again.
    /*
    _recalculateInstanceMatrix() {
        this._instanceMatrix = new mat4();
        this._instanceMatrix = mult(translate(this._pos[0], this._pos[1], this._pos[2]), this._instanceMatrix);
        this._instanceMatrix = mult(rotate(this._rot[0], [1, 0, 0]), this._instanceMatrix);
        this._instanceMatrix = mult(rotate(this._rot[1], [0, 1, 0]), this._instanceMatrix);
        this._instanceMatrix = mult(rotate(this._rot[2], [0, 0, 1]), this._instanceMatrix);
        this._instanceMatrix = mult(scalem(this._scale[0], this._scale[1], this._scale[2]), this._instanceMatrix);
    }
    */

    setPosition(x, y, z) {
        let xTranslation = x - this._pos[0];
        let yTranslation = y - this._pos[1];
        let zTranslation = z - this._pos[2];
        this.translate(xTranslation, yTranslation, zTranslation);
    }

    setRotation(angle, axis) {
        let rotations = new vec3();
        for (let i = 0; i < 3; i++) {
            if(axis[i] === 1) {
                rotations[i] = angle - this._rot[i];
            }
        }
        this.rotate(rotations[0], [1, 0, 0]);
        this.rotate(rotations[1], [0, 1, 0]);
        this.rotate(rotations[2], [0, 0, 1]);
    }

    setScale(x, y, z) {
        let xScale = x / this._scale[0];
        let yScale = y / this._scale[1];
        let zScale = z / this._scale[2];
        this.scale(xScale, yScale, zScale);
    }
}
