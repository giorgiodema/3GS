class GraphicObject {

    constructor(vertices, normals, colors, uvCoords, colorMap, normalsMap){
        this._vertices = vertices;
        this._normals = normals;
        this._colors = colors;
        this._uvCoords = uvCoords;
        this._colorMap = colorMap;
        this._normalsMap = normalsMap;
        this._children = new Array();
        this._instanceMatrix = new mat4(); //model instantiation matrix, place the object in its relative coordinates w.r.t. father
        this.pos = new vec3(0,0,0);
        this.rot = new vec3(0,0,0);
        this.scale = new vec3(1,1,1);
    }

    render(parentMatrix){
        //var model = instanceMatrix*parentMatrix;
        //pass model to _children
    }

    translate(x, y, z){
        this._instanceMatrix = mult(this.translate(x, y, z), this._instanceMatrix);
    }

    rotate(angle, axis){
        this._instanceMatrix = mult(this.rotate(angle, axis), this._instanceMatrix);
    }

    scale(x, y, z){
        this._instanceMatrix = mult(this.scalem(x, y, z), this._instanceMatrix);
    }


}
