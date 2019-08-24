attribute vec4 vPosition;
attribute vec4 vNormal;
attribute  vec4 vColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec4 fColor;

void main()
{
    fColor = vColor;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}