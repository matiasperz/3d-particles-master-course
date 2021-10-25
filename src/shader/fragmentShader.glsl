varying vec3 vPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
  vec3 color = vec3(1.0, 0.0, 0.0);

  /*
    vPosition.z: (-1, 1)
    vPosition.z * 0.5: (-0.5, 0.5)
    vPosition.z * 0.5 + 0.5: (0, 1)
  */
  float depth = vPosition.z * 0.5 + 0.5;

  color = mix(uColor1, uColor2, depth);

  /*
    depth: (0, 1)
    depth * 0.3: (0, 0.3)
    depth * 0.3 + 0.2: (0.2, 0.5)
  */
  gl_FragColor = vec4(color, depth * 0.3 + 0.2);
}
