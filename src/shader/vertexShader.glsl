attribute vec3 aRandom;

varying vec3 vPosition;

uniform float uTime;
uniform float uScale;

void main() {
  vPosition = position;

  float time = uTime * 4.;

  vec3 pos = position;
  pos.x += sin(time * aRandom.x) * 0.01;
  pos.y += cos(time * aRandom.y) * 0.01;
  pos.z += cos(time * aRandom.z) * 0.01;

  /* Generating chaos */
  pos.x *= uScale + (sin(pos.y * 4.0 + time) * (1.0 - uScale));
  pos.y *= uScale + (cos(pos.z * 4.0 + time) * (1.0 - uScale));
  pos.z *= uScale + (sin(pos.x * 4.0 + time) * (1.0 - uScale));

  /* Securing all particles go to pos 0 in all axes on remove, uScale will be 0 on remove */
  pos *= uScale;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0 / -mvPosition.z;
}