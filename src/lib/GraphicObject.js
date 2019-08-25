class GraphicObject {

    constructor(vertices, normals, colors, uvCoords, colorMap, normalsMap) {
        this._vertices = vertices;
        this._normals = normals;
        this._colors = colors;
        this._uvCoords = uvCoords;
        this._colorMap = colorMap;
        this._normalsMap = normalsMap;
        this._children = new Array();
        this.scene;

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

    initBuffers() {
        if(this.scene === undefined) {
            console.error("Can't initialize GPU buffers: this GraphicObject belongs to no scene.");
        }

        this.vBuffer = this.scene.gl.createBuffer();
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.vBuffer);
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, flatten(this._vertices), this.scene.gl.STATIC_DRAW);
        this.scene.gl.vertexAttribPointer(this.scene.gl.getAttribLocation(this.scene.program, "vPosition"), 3, this.scene.gl.FLOAT, false, 0, 0);
        this.scene.gl.enableVertexAttribArray(this.scene.gl.getAttribLocation(this.scene.program, "vPosition"));

        this.nBuffer = this.scene.gl.createBuffer();
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.nBuffer);
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, flatten(this._normals), this.scene.gl.STATIC_DRAW);
        this.scene.gl.vertexAttribPointer(this.scene.gl.getAttribLocation(this.scene.program, "vNormal"), 3, this.scene.gl.FLOAT, false, 0, 0);
        this.scene.gl.enableVertexAttribArray(this.scene.gl.getAttribLocation(this.scene.program, "vNormal"));
        
        this.cBuffer = this.scene.gl.createBuffer();
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.cBuffer);
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, flatten(this._colors), this.scene.gl.STATIC_DRAW);
        this.scene.gl.vertexAttribPointer(this.scene.gl.getAttribLocation(this.scene.program, "vColor"), 3, this.scene.gl.FLOAT, false, 0, 0);
        this.scene.gl.enableVertexAttribArray(this.scene.gl.getAttribLocation(this.scene.program, "vColor"));


    }

    render(parentMatrix) {
        var modelMatrix = mult(this._instanceMatrix, parentMatrix);
        
        //rendering stuff
        this.scene.gl.uniformMatrix4fv(this.scene.gl.getUniformLocation( this.scene.program,"modelMatrix"),false,flatten(modelMatrix));

        this.scene.gl.drawArrays(this.scene.gl.TRIANGLES, 0, this._vertices.length);

        //remember that after all that the "render" methods have been called, the user will do a "requestAnimationFrame".

        this._children.forEach(child => {
            child.render(modelMatrix);
        });
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

    addChild(newChild) {
        this._children.push(newChild);
        newChild.scene = this.scene;
        newChild.initBuffers();
    }
}
