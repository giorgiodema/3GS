attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec3 vColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec4 fColor;

void main()
{
    fColor = vec4(vColor.x, vColor.y, vColor.z, 1.0);

    vec4 position = vec4(vPosition.x, vPosition.y, vPosition.z, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;
}