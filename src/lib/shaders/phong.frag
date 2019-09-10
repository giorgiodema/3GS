precision mediump float;

uniform vec4 ambientProduct;
uniform vec4 diffuseProduct;
uniform vec4 specularProduct;

uniform vec4 lightAmbient;
uniform vec4 lightSpecular;

uniform float shininess;
varying vec3 N, L, E;

varying vec2 fTexCoord;
uniform sampler2D texture;
uniform bool useTexture;


void main()
{
    vec3 normal = normalize(N);
    vec3 surfaceToLight = normalize(L);
    vec3 surfaceToView = normalize(E);

    vec4 fColor;
    
    vec3 H = normalize(surfaceToLight + surfaceToView);
    vec4 ambient = ambientProduct;

    float Kd = max(dot(surfaceToLight, normal), 0.0);
    vec4 diffuse = Kd * diffuseProduct;

    float Ks = pow(max(dot(normal, H), 0.0), shininess);
    vec4 specular = Ks * specularProduct;

    if (useTexture) {
        vec4 texVal = texture2D(texture, fTexCoord);
        ambient = lightAmbient * normalize(texVal);
        specular = Ks * (lightSpecular * normalize(texVal));
    }

    if (dot(surfaceToLight, normal) < 0.0) {
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    }

    fColor = ambient + diffuse + specular;
    fColor.a = 1.0;
    
    gl_FragColor = fColor;
}