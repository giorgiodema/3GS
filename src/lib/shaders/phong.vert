attribute vec4 vPosition;
attribute vec4 vNormal;
attribute vec2 vTexCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 inverseTransposedModelMatrix;

varying vec3 N, L, E;
uniform vec4 lightPosition;

varying vec2 fTexCoord;


void main()
{    
    vec3 pos = (viewMatrix * modelMatrix * vPosition).xyz;
    vec3 light = (viewMatrix * lightPosition).xyz;
    
    L = light - pos;
    E = -pos;
    N = inverseTransposedModelMatrix * vNormal.xyz;

    fTexCoord = vTexCoord;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}