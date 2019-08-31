// We'll start by supporting only one light source. The scene will ignore all
// lights that are not the first one for now when rendering an object. 
class PointLight {
    constructor() {
        this.ambient = vec4(0.2, 0.2, 0.2, 1.0);
        //this.ambient = vec4(0.0, 0.0, 0.0, 1.0);
        this.diffuse = vec4(1.0, 1.0, 1.0, 1.0);
        this.specular = vec4(1.0, 1.0, 1.0, 1.0);

        this._pos = vec4(1.0, 2.0, 3.0,1.0);
    }

    get pos() {
        return new vec4(this._pos);
    }

    // Adds the values of x, y, z to the position parameters of the object
    translate(x, y, z) {
        this._pos[0] = this._pos[0] + x;
        this._pos[1] = this._pos[1] + y;
        this._pos[2] = this._pos[2] + z;
    }

    setPosition(x, y, z) {
        let xTranslation = x - this._pos[0];
        let yTranslation = y - this._pos[1];
        let zTranslation = z - this._pos[2];
        this.translate(xTranslation, yTranslation, zTranslation);
    }
}

// class AmbientLight