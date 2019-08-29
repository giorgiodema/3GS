class Cube extends GraphicObject{
    constructor(r,g,b){
        var _cubeVertices = [
            vec3( -0.5, -0.5,  0.5),
            vec3( -0.5,  0.5,  0.5),
            vec3( 0.5,  0.5,  0.5),
            vec3( 0.5, -0.5,  0.5),
            vec3( -0.5, -0.5, -0.5),
            vec3( -0.5,  0.5, -0.5),
            vec3( 0.5,  0.5, -0.5),
            vec3( 0.5, -0.5, -0.5)
        ];

        var _texCoord = [
            vec2(0, 0),
            vec2(0, 1),
            vec2(1, 1),
            vec2(1, 0)
        ];

        var _pointsArray = new Array();
        var _normalsArray = new Array();
        var _texCoordArray = new Array();
        var _colorsArray = new Array(36).fill(vec3(r,g,b));

        var pushQuadVertices = function(a, b, c, d) {
            _pointsArray.push(_cubeVertices[a]);
            _texCoordArray.push(_texCoord[0]);
            _pointsArray.push(_cubeVertices[b]);
            _texCoordArray.push(_texCoord[1]);
            _pointsArray.push(_cubeVertices[c]);
            _texCoordArray.push(_texCoord[2]);
            _pointsArray.push(_cubeVertices[a]);
            _texCoordArray.push(_texCoord[0]);
            _pointsArray.push(_cubeVertices[c]);
            _texCoordArray.push(_texCoord[2]);
            _pointsArray.push(_cubeVertices[d]);
            _texCoordArray.push(_texCoord[3]);
        };

        pushQuadVertices( 1, 0, 3, 2);
        pushQuadVertices( 2, 3, 7, 6);
        pushQuadVertices( 3, 0, 4, 7);
        pushQuadVertices( 6, 5, 1, 2);
        pushQuadVertices( 4, 5, 6, 7);
        pushQuadVertices( 5, 4, 0, 1);

        // Face ABCD
        var v1 = subtract(_cubeVertices[1],_cubeVertices[0]);
        var v2 = subtract(_cubeVertices[2],_cubeVertices[1]); 
        var n1 = cross(v2, v1);
        n1 = vec4(n1[0],n1[1],n1[2],0);

        // Face DCGH
        v1 = subtract(_cubeVertices[2],_cubeVertices[3]);
        v2 = subtract(_cubeVertices[6],_cubeVertices[2]);
        var n2 = cross(v2, v1);
        n2 = vec4(n2[0],n2[1],n2[2],0);

        // Face ADHE
        v1 = subtract(_cubeVertices[3],_cubeVertices[0]);
        v2 = subtract(_cubeVertices[7],_cubeVertices[3]);
        var n3 = cross(v2, v1);
        n3 = vec4(n3[0],n3[1],n3[2],0);

        // Face FGCB
        v1 = subtract(_cubeVertices[6],_cubeVertices[5]);
        v2 = subtract(_cubeVertices[2],_cubeVertices[6]);
        var n4 = cross(v2, v1);
        n4 = vec4(n4[0],n4[1],n4[2],0);

        // Face FEHG
        v1 = subtract(_cubeVertices[4],_cubeVertices[5]);
        v2 = subtract(_cubeVertices[7],_cubeVertices[4]);
        var n5 = cross(v2, v1);
        n5 = vec4(n5[0],n5[1],n5[2],0);

        // Face EFBA
        v1 = subtract(_cubeVertices[5],_cubeVertices[4]);
        v2 = subtract(_cubeVertices[1],_cubeVertices[5]);
        var n6 = cross(v2, v1);
        n6 = vec4(n6[0],n6[1],n6[2],0);

        _normalsArray.push(n1);_normalsArray.push(n1);_normalsArray.push(n1);_normalsArray.push(n1);_normalsArray.push(n1);_normalsArray.push(n1);
        _normalsArray.push(n2);_normalsArray.push(n2);_normalsArray.push(n2);_normalsArray.push(n2);_normalsArray.push(n2);_normalsArray.push(n2);
        _normalsArray.push(n3);_normalsArray.push(n3);_normalsArray.push(n3);_normalsArray.push(n3);_normalsArray.push(n3);_normalsArray.push(n3);
        _normalsArray.push(n4);_normalsArray.push(n4);_normalsArray.push(n4);_normalsArray.push(n4);_normalsArray.push(n4);_normalsArray.push(n4);
        _normalsArray.push(n5);_normalsArray.push(n5);_normalsArray.push(n5);_normalsArray.push(n5);_normalsArray.push(n5);_normalsArray.push(n5);
        _normalsArray.push(n6);_normalsArray.push(n6);_normalsArray.push(n6);_normalsArray.push(n6);_normalsArray.push(n6);_normalsArray.push(n6);

        super(_pointsArray,_normalsArray, _colorsArray, _texCoordArray, null, null);
    }
}      

// Temporary unoptimized workaround to keep API consistent
class Cube extends GraphicObject {
    constructor(side, colors, uvCoords, colorMap, normalsMap) {
        let c = new CubeV(side);
        super(c.getVertices(),[],new Array(c.getVertices().length).fill(vec3(Math.random(),Math.random(),Math.random())));
    }
}


