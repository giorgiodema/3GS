class GraphicObject {

    constructor(vertices, normals, materialAmbient, materialDiffuse, materialSpecular, uvCoords) {
        this._vertices = vertices;
        this._normals = normals;
        this._uvCoords = uvCoords;
        this._children = new Array();
        this.scene;

        this.vBuffer;
        this.nBuffer;
        this.cBuffer;

        this._controller = null;

        // Model instantiation matrix, places the object in its relative coordinates w.r.t. father
        this._instanceMatrix = new mat4();
        
        // Relative coordinates, they have to be kept coherent with _instanceMatrix 
        // in the methods performing operations on them. 
        this._pos = vec3(0, 0, 0);
        this._rot = vec3(0, 0, 0);
        this._scale = vec3(1, 1, 1);

        this.materialAmbient = materialAmbient;     
        this.materialDiffuse = materialDiffuse;     
        this.materialSpecular = materialSpecular;   

        this.shininess = 200.0;

        // Not affected by light sources, does not affect any surfaces
        // not using this right now
        // this.emission = new vec4();
    }

    get pos() {
        return vec3(this._pos[0], this._pos[1], this._pos[2]);
    }

    get rot() {
        return vec3(this._rot[0], this._rot[1], this._rot[2]);
    }

    get scale() {
        return vec3(this._scale[0], this._scale[1], this._scale[2]);
    }

    initBuffers() {
        if(this.scene === undefined) {
            console.error("Can't initialize GPU buffers: this GraphicObject belongs to no scene.");
        }

        this.vBuffer = this.scene.gl.createBuffer();
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.vBuffer);
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, flatten(this._vertices), this.scene.gl.STATIC_DRAW);

        this.nBuffer = this.scene.gl.createBuffer();
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.nBuffer);
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, flatten(this._normals), this.scene.gl.STATIC_DRAW);
        
        this.cBuffer = this.scene.gl.createBuffer();
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.cBuffer);
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, flatten(this._uvCoords), this.scene.gl.STATIC_DRAW);
    }

    render(parentMatrix) {
        // if there's a controller associated to the object, the controller will
        // update the direction of the object
        if(this._controller!== null)
            this._controller.update();
        var modelMatrix = mult(parentMatrix,this._instanceMatrix);
        
        //rendering stuff
        this.scene.gl.uniformMatrix4fv(this.scene.gl.getUniformLocation( this.scene.program,"modelMatrix"),false,flatten(modelMatrix));

        // 3x3 matrix needed to avoid scaling issues on the normals
        let inverseTransposedModelMatrix = normalMatrix(modelMatrix, true);
        this.scene.gl.uniformMatrix3fv(this.scene.gl.getUniformLocation( this.scene.program,"inverseTransposedModelMatrix"),false,flatten(inverseTransposedModelMatrix));

        // binding vertex buffer
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.vBuffer);
        this.scene.gl.vertexAttribPointer(this.scene.gl.getAttribLocation(this.scene.program, "vPosition"), 4, this.scene.gl.FLOAT, false, 0, 0);
        this.scene.gl.enableVertexAttribArray(this.scene.gl.getAttribLocation(this.scene.program, "vPosition"));

        // binding normal buffer
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.nBuffer);
        this.scene.gl.vertexAttribPointer(this.scene.gl.getAttribLocation(this.scene.program, "vNormal"), 4, this.scene.gl.FLOAT, false, 0, 0);
        this.scene.gl.enableVertexAttribArray(this.scene.gl.getAttribLocation(this.scene.program, "vNormal"));
    
        // binding UV coordinates buffer
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.cBuffer);
        this.scene.gl.vertexAttribPointer(this.scene.gl.getAttribLocation(this.scene.program, "vTexCoord"), 2, this.scene.gl.FLOAT, false, 0, 0);
        this.scene.gl.enableVertexAttribArray(this.scene.gl.getAttribLocation(this.scene.program, "vTexCoord"));

        if(this.colorMap !== undefined) {
            // bind the texture buffer on the GPU to this object's texture 
            this.scene.gl.activeTexture(this.scene.gl.TEXTURE0);
            this.scene.gl.bindTexture(this.scene.gl.TEXTURE_2D, this.scene.GPUtexture);
            

            this.scene.gl.pixelStorei(this.scene.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.scene.gl.texImage2D(this.scene.gl.TEXTURE_2D, 0, this.scene.gl.RGB,
            this.scene.gl.RGB, this.scene.gl.UNSIGNED_BYTE, this.colorMap);
            this.scene.gl.generateMipmap( this.scene.gl.TEXTURE_2D );
            this.scene.gl.texParameteri( this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MIN_FILTER,
            this.scene.gl.NEAREST_MIPMAP_LINEAR );
            this.scene.gl.texParameteri( this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST );
        }
        this.scene.gl.uniform1i(this.scene.gl.getUniformLocation( this.scene.program,"useTexture"), this.colorMap !== undefined);


        // Compute coefficient products 
        let light = this.scene.getLight();
        let ambientProduct = mult(light.ambient, this.materialAmbient);
        let diffuseProduct = mult(light.diffuse, this.materialDiffuse);
        let specularProduct = mult(light.specular, this.materialSpecular);

        // Pass light position to vertex shader
        this.scene.gl.uniform4fv(this.scene.gl.getUniformLocation( this.scene.program,"lightPosition"), flatten(light.direction));


        // Pass parameters to fragment shader
        this.scene.gl.uniform4fv(this.scene.gl.getUniformLocation( this.scene.program,"ambientProduct"), flatten(ambientProduct));
        this.scene.gl.uniform4fv(this.scene.gl.getUniformLocation( this.scene.program,"diffuseProduct"), flatten(diffuseProduct));
        this.scene.gl.uniform4fv(this.scene.gl.getUniformLocation( this.scene.program,"specularProduct"), flatten(specularProduct));
        this.scene.gl.uniform4fv(this.scene.gl.getUniformLocation( this.scene.program,"lightAmbient"), flatten(light.ambient));
        this.scene.gl.uniform4fv(this.scene.gl.getUniformLocation( this.scene.program,"lightSpecular"), flatten(light.specular));
        this.scene.gl.uniform1f(this.scene.gl.getUniformLocation( this.scene.program,"shininess"), flatten(this.shininess));

    
        this.scene.gl.drawArrays(this.scene.gl.TRIANGLES,0, this._vertices.length);

        //remember that after all that the "render" methods have been called, the user will do a "requestAnimationFrame".

        this._children.forEach(child => {
            child.render(modelMatrix);
        });
    }

    // Only tested with square textures whose side is an exponent of 2
    addColorMap(texture) {
        this.colorMap = texture;

        if(this.scene.GPUtexture === undefined)
            this.scene.GPUtexture = this.scene.gl.createTexture();
        this.scene.gl.activeTexture( this.scene.gl.TEXTURE0 );
        this.scene.gl.bindTexture( this.scene.gl.TEXTURE_2D, this.scene.GPUtexture );
        this.scene.gl.pixelStorei(this.scene.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.scene.gl.texImage2D(this.scene.gl.TEXTURE_2D, 0, this.scene.gl.RGB,
            this.scene.gl.RGB, this.scene.gl.UNSIGNED_BYTE, texture);
        this.scene.gl.generateMipmap( this.scene.gl.TEXTURE_2D );
        this.scene.gl.texParameteri( this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MIN_FILTER,
            this.scene.gl.NEAREST_MIPMAP_LINEAR );
        this.scene.gl.texParameteri( this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST );

    }

    // Previews the position of the current object after a given translation
    previewTranslation(x, y, z) {
        let next = vec3(this._pos[0] + x, this._pos[1] + y, this._pos[2] + z);
        return next;
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
    rotate(angle, axis, point) {
        // translate object to the origin before rotation
        if(point != null){
            this.translate(point[0],point[1],point[2]);
        }
        
        // perform rotation
        this._rot[0] = this._rot[0] + angle * axis[0];
        this._rot[1] = this._rot[1] + angle * axis[1];
        this._rot[2] = this._rot[2] + angle * axis[2];
        this._instanceMatrix = mult(rotate(angle, axis), this._instanceMatrix);

        // translate object back to its initial position after rotation
        if(point!=null){
            this.translate(-point[0],-point[1],-point[2]);
        }
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

    setRotation(angle, axis, point) {
        let rotations = new vec3();
        for (let i = 0; i < 3; i++) {
            if(axis[i] === 1) {
                rotations[i] = angle - this._rot[i];
            }
        }
        this.rotate(rotations[0], [1, 0, 0], point);
        this.rotate(rotations[1], [0, 1, 0], point);
        this.rotate(rotations[2], [0, 0, 1], point);
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

    setController(controller){
        this._controller = controller;
    }
}
