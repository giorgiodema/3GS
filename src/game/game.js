"use strict";

var gl;
var points;

var NumPoints = 5000;

window.onload = function init()
{
    var scene = new Scene("gl-canvas");
    scene.init(function() {
        //
        //  Initialize our data for the Sierpinski Gasket
        //

        // First, initialize the corners of our gasket with three points.

        var vertices = [
            vec2( -1, -1 ),
            vec2(  0,  1 ),
            vec2(  1, -1 )
        ];

        // Specify a starting point p for our iterations
        // p must lie inside any set of three vertices

        var u = add( vertices[0], vertices[1] );
        var v = add( vertices[0], vertices[2] );
        var p = scale( 0.25, add( u, v ) );

        // And, add our initial point into our array of points

        points = [ p ];

        // Compute new points
        // Each new point is located midway between
        // last point and a randomly chosen vertex

        for ( var i = 0; points.length < NumPoints; ++i ) {
            var j = Math.floor(Math.random() * 3);
            p = add( points[i], vertices[j] );
            p = scale( 0.5, p );
            points.push( p );
        }

        // Load the data into the GPU

        var bufferId = scene.gl.createBuffer();
        scene.gl.bindBuffer( scene.gl.ARRAY_BUFFER, bufferId );
        scene.gl.bufferData( scene.gl.ARRAY_BUFFER, flatten(points), scene.gl.STATIC_DRAW );

        // Associate out shader variables with our data buffer
        var vPosition = scene.gl.getAttribLocation( scene.program, "vPosition" );
        scene.gl.vertexAttribPointer( vPosition, 2, scene.gl.FLOAT, false, 0, 0 );
        scene.gl.enableVertexAttribArray( vPosition );
    
        scene.gl.clear( scene.gl.COLOR_BUFFER_BIT );
        scene.gl.drawArrays( scene.gl.POINTS, 0, points.length );
    });
};


/*function render() {
    scene.gl.clear( scene.gl.COLOR_BUFFER_BIT );
    scene.gl.drawArrays( scene.gl.POINTS, 0, points.length );
}
*/