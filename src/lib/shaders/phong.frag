precision mediump float;

/*  Will uncomment when implementing textures
uniform bool useColorMap;
uniform bool useNormalMap;
*/

uniform vec4 ambientProduct;
uniform vec4 diffuseProduct;
uniform vec4 specularProduct;
uniform float shininess;
varying vec3 N, L, E;

void main()
{
    N = normalize(N);
    L = normalize(L);
    E = normalize(E);

    vec4 fColor;
    
    vec3 H = normalize(L + E);
    vec4 ambient = ambientProduct;
    
    float Kd = max(dot(L, N), 0.0);
    vec4 diffuse = Kd * diffuseProduct;
    
    float Ks = pow(max(dot(N, H), 0.0), shininess);
    vec4 specular = Ks * specularProduct;
    
    if (dot(L, N) < 0.0) {
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    }

    fColor = ambient + diffuse + specular;
    fColor.a = 1.0;
    
    gl_FragColor = fColor;
}