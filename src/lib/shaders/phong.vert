attribute vec4 vPosition;
attribute vec4 vNormal;
//attribute vec3 vColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 N, L, E;
uniform vec4 lightPosition;

void main()
{
    //vec4 position = vec4(vPosition.x, vPosition.y, vPosition.z, 1.0);
    //vec4 normal = vec4(vNormal.x, vNormal.y, vNormal.z, 1.0);

    vec3 pos = -(viewMatrix * modelMatrix * vPosition).xyz;
    vec3 light = lightPosition.xyz;
    L = normalize(light - pos);
    E = -pos;
    N = normalize((viewMatrix * modelMatrix * vNormal).xyz);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}