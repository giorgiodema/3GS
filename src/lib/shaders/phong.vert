attribute vec4 vPosition;
attribute vec4 vNormal;
//attribute vec3 vColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 inverseTransposedModelMatrix;

varying vec3 N, L, E;
uniform vec4 lightPosition;

void main()
{
    //vec3 pos = -(viewMatrix * modelMatrix * vPosition).xyz;
    //vec3 light = lightPosition.xyz;
    
    vec3 pos = (viewMatrix * modelMatrix * vPosition).xyz;
    vec3 light = (viewMatrix * lightPosition).xyz;
    
    L = light - pos;
    E = -pos;
    //N = normalize((viewMatrix * modelMatrix * vNormal).xyz);
    N = inverseTransposedModelMatrix * vNormal.xyz;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}