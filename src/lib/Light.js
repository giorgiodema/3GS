// We'll start by supporting only one light source. The scene will ignore all
// lights that are not the first one for now when rendering an object. 
class DirectionalLight {
    constructor() {
        this.ambient = vec4(0.4, 0.4, 0.4, 1.0);
        this.diffuse = vec4(1.0, 1.0, 1.0, 1.0);
        this.specular = vec4(1.0, 1.0, 1.0, 1.0);

        this._pos = vec4(0.0, 0.0, 0.0,0.0);
    }

    get direction() {
        return this._pos;
    }

    /*
    // Needs to be reworded to express the fact that the light's "position"
    // is a direction (implemented by having 0 as last parameter of the vec4)
    // Not really necessary as setDirection + get direction already can do everything
    // this method would do, we could also just delete this

    // Adds the values of x, y, z to the position parameters of the object
    translate(x, y, z) {
        this._pos[0] = this._pos[0] + x;
        this._pos[1] = this._pos[1] + y;
        this._pos[2] = this._pos[2] + z;
    }
    */

    setDirection(x, y, z) {
        // To keep the light directional, the user shouldn't be able to edit the 4th
        // value of the _pos vector
        this._pos[0] = x;
        this._pos[1] = y;
        this._pos[2] = z;

        /*
        // Old implementation which relied on the translate method, could be reused if we 
        // decided to put that back with a different name. If we decide to delete that
        // completely, this will have to be deleted as well.
        let xTranslation = x - this._pos[0];
        let yTranslation = y - this._pos[1];
        let zTranslation = z - this._pos[2];
        this.translate(xTranslation, yTranslation, zTranslation);
        */ 
    }
}