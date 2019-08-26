class CubeV{
    constructor(){
        this._cubeVertices = [
            vec3( -0.5, -0.5,  0.5),
            vec3( -0.5,  0.5,  0.5),
            vec3( 0.5,  0.5,  0.5),
            vec3( 0.5, -0.5,  0.5),
            vec3( -0.5, -0.5, -0.5),
            vec3( -0.5,  0.5, -0.5),
            vec3( 0.5,  0.5, -0.5),
            vec3( 0.5, -0.5, -0.5)
        ];

        this.pointsArray = new Array();

    }

    pushQuadVertices(a, b, c, d) {
        this.pointsArray.push(this._cubeVertices[a]);
        this.pointsArray.push(this._cubeVertices[b]);
        this.pointsArray.push(this._cubeVertices[c]);
        this.pointsArray.push(this._cubeVertices[a]);
        this.pointsArray.push(this._cubeVertices[c]);
        this.pointsArray.push(this._cubeVertices[d]);
    }

    getVertices(){
        if (this.pointsArray.length===0){
            this.pushQuadVertices( 1, 0, 3, 2);
            this.pushQuadVertices( 2, 3, 7, 6);
            this.pushQuadVertices( 3, 0, 4, 7);
            this.pushQuadVertices( 6, 5, 1, 2);
            this.pushQuadVertices( 4, 5, 6, 7);
            this.pushQuadVertices( 5, 4, 0, 1);
        }
    return this.pointsArray.slice();
    }
}      

// Temporary unoptimized workaround to keep API consistent
class Cube extends GraphicObject {
    constructor(side, colors, uvCoords, colorMap, normalsMap) {
        let c = new CubeV();
        super(c.getVertices(),[],new Array(c.getVertices().length).fill(vec3(Math.random(),Math.random(),Math.random())));
    }
}


