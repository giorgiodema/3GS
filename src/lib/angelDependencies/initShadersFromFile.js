//
//  initShadersFromFile.js
//  edited version of initShaders.js by jotaro-sama
//

function readFromFile(file)
{
    let content;
    fetch(file)
        .then(response => response.text())
        .then(text => content = text)
    return content;
}

function initShadersFromFile( gl, vertexShaderFileName, fragmentShaderFileName, callback )
{
    var vertShdr;
    var fragShdr;

    let vertShaderText;
    fetch(vertexShaderFileName)
        .then(response => response.text())
        .then(text => vertShaderText = text)
        .then(function() {
            vertShdr = gl.createShader( gl.VERTEX_SHADER );
            gl.shaderSource( vertShdr, vertShaderText );
            gl.compileShader( vertShdr );
            if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
                var msg = "Vertex shader failed to compile.  The error log is:"
                + "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
                alert( msg );
                return -1;
            }
            
            let fragShaderText;
            fetch(fragmentShaderFileName)
                .then(response => response.text())
                .then(text => fragShaderText = text)
                .then(function() {
                    fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
                    gl.shaderSource( fragShdr, fragShaderText );
                    gl.compileShader( fragShdr );
                    if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
                        var msg = "Fragment shader failed to compile.  The error log is:"
                        + "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
                        alert( msg );
                        return -1;
                    }
                
                    var program = gl.createProgram();
                    gl.attachShader( program, vertShdr );
                    gl.attachShader( program, fragShdr );
                    gl.linkProgram( program );
                    
                    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
                        var msg = "Shader program failed to link.  The error log is:"
                            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
                        alert( msg );
                        return -1;
                    }
                
                    callback(program);
                });
        });


}
