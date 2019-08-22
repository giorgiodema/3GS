/* ==================
 * Cube
 * ==================
 * A class that builds a simple cube,
 * of size 1 and centered in the origin */
export default class Cube {
    constructor() {

        // A 1-size cube, centered in the origin
        const array_v4_vertices = [
            vec4(-0.5, -0.5, 0.5, 1.0),
            vec4(-0.5, 0.5, 0.5, 1.0),
            vec4(0.5, 0.5, 0.5, 1.0),
            vec4(0.5, -0.5, 0.5, 1.0),
            vec4(-0.5, -0.5, -0.5, 1.0),
            vec4(-0.5, 0.5, -0.5, 1.0),
            vec4(0.5, 0.5, -0.5, 1.0),
            vec4(0.5, -0.5, -0.5, 1.0)
        ];

        // The coordinates of the texture vertices to apply to a cube
        const array_v2_textureCoordinates = [
            vec2(0, 0),
            vec2(0, 1),
            vec2(1, 1),
            vec2(1, 0)
        ];

        // The quad coordinates for a cube
        const array_v4_quadVertices = [
            vec4(1, 0, 3, 2),
            vec4(2, 3, 7, 6),
            vec4(3, 0, 4, 7),
            vec4(6, 5, 1, 2),
            vec4(4, 5, 6, 7),
            vec4(5, 4, 0, 1)
        ];

        // The public data for the current cube
        this.array_v4_geometryVertices = [];
        this.array_v2_textureVertices = [];

        // Get the quad vertices for the current iteration
        for (var i = 0; i < array_v4_quadVertices.length; i++) {
            var [a, b, c, d] = array_v4_quadVertices[i];

            // Points and texture vertices
            this.array_v4_geometryVertices.push(array_v4_vertices[a]);
            this.array_v4_geometryVertices.push(array_v4_vertices[b]);
            this.array_v4_geometryVertices.push(array_v4_vertices[c]);
            this.array_v4_geometryVertices.push(array_v4_vertices[d]);
            this.array_v2_textureVertices.push(array_v2_textureCoordinates[1]);
            this.array_v2_textureVertices.push(array_v2_textureCoordinates[0]);
            this.array_v2_textureVertices.push(array_v2_textureCoordinates[3]);
            this.array_v2_textureVertices.push(array_v2_textureCoordinates[2]);
        }
    }
}
