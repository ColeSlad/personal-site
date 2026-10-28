export const spaceVertexShader = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

// Spacecraft-derived Io and Jupiter maps, lit in linear color space.
export const spaceFragmentShader = `
precision highp float;
uniform vec2 uResolution;
uniform vec3 uCamera;
uniform vec2 uFocus;
uniform vec4 uGravity;
uniform float uTime;
uniform sampler2D uSurfaceMap;
uniform sampler2D uJupiterMap;
const float PI = 3.14159265359;
const float IO_FLATTENING = 0.997;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

vec3 sky(vec3 direction) {
  float dust = noise(direction * 5.0) * 0.65 + noise(direction * 13.0 + 8.0) * 0.35;
  float lane = exp(-abs(direction.y + 0.24 * direction.x - 0.08) * 7.0);
  vec3 color = vec3(0.0010, 0.0015, 0.0030);
  color += vec3(0.012, 0.006, 0.003) * pow(dust, 3.0) * lane;
  for (int i = 0; i < 2; i++) {
    float scale = 155.0 + float(i) * 115.0;
    vec3 cell = floor(direction * scale);
    vec3 local = fract(direction * scale) - 0.5;
    float seed = hash(cell);
    float distanceSquared = dot(local, local);
    float core = exp(-distanceSquared * 210.0);
    float halo = exp(-distanceSquared * 24.0) * 0.12;
    halo += exp(-distanceSquared * 6.0) * 0.018;
    float star = (core + halo) * step(0.974, seed);
    vec3 tint = mix(vec3(0.67, 0.79, 1.0), vec3(1.0, 0.83, 0.66), seed);
    color += tint * star * (0.45 + 3.0 * pow(fract(seed * 431.0), 6.0));
  }
  return color;
}

vec2 bodyHit(vec3 origin, vec3 ray, float radius, float flattening) {
  vec3 scale = vec3(1.0, flattening, 1.0);
  vec3 o = origin / scale, d = ray / scale;
  float a = dot(d, d), b = dot(o, d);
  float h = b * b - a * (dot(o, o) - radius * radius);
  if (h < 0.0) return vec2(-1.0);
  return vec2(-b - sqrt(h), -b + sqrt(h)) / a;
}

vec2 mapCoordinates(vec3 sphere, float rotation) {
  return vec2(fract(atan(sphere.z, sphere.x) / (2.0 * PI) + 0.5 + rotation), asin(clamp(sphere.y, -1.0, 1.0)) / PI + 0.5);
}

vec3 filmic(vec3 color) {
  return clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  // Bend rays only inside the small hover lens; the rest of the scene is unchanged.
  if (uGravity.z > 0.001) {
    vec2 delta = (uv - uGravity.xy) * vec2(aspect, 1.0);
    float influence = 1.0 - smoothstep(0.0, uGravity.w, length(delta));
    vec2 bend = -delta * 0.72 + vec2(-delta.y, delta.x) * 0.24;
    uv += bend * influence * influence * uGravity.z / vec2(aspect, 1.0);
  }
  vec2 screen = (uv - uFocus) * vec2(aspect, 1.0);
  float mobile = 1.0 - step(0.86, aspect);
  float arrival = smoothstep(0.0, 7.0, uTime);
  float angle = -0.95 + 1.48 * arrival + uTime * 0.010 + uCamera.x;
  // Open in a close-up, then drift back into the established orbital framing.
  float distanceToIo = mix(3.0, 3.8, arrival) * mix(1.0, 1.80, mobile);
  float cameraHeight = mix(0.55, 0.65, arrival) + sin(uTime * 0.045) * 0.12;
  float elevation = clamp(atan(cameraHeight, distanceToIo) + uCamera.y, -1.35, 1.35);
  float radius = length(vec2(distanceToIo, cameraHeight)) * uCamera.z;
  vec3 camera = vec3(sin(angle) * cos(elevation), sin(elevation), cos(angle) * cos(elevation)) * radius;
  vec3 forward = normalize(-camera);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  vec3 ray = normalize(screen.x * right + screen.y * up + forward * 1.4);
  vec3 color = sky(ray);
  vec3 sunlight = normalize(vec3(-3.8, 2.8, 5.0));
  vec3 sunColor = vec3(1.0, 0.985, 0.96);

  // Relative size and distance are approximately those of Jupiter as seen from Io.
  // The viewing azimuth is composed for each screen shape.
  vec3 jupiterCenter = mix(vec3(-42.0, 0.0, -228.0), vec3(-105.0, 0.0, -206.0), mobile);
  float jupiterRadius = 39.2;
  vec3 fromJupiter = camera - jupiterCenter;
  vec2 jupiter = bodyHit(fromJupiter, ray, jupiterRadius, 0.935);
  if (jupiter.x > 0.0) {
    vec3 point = (fromJupiter + ray * jupiter.x) / jupiterRadius;
    vec3 sphere = normalize(point / vec3(1.0, 0.935, 1.0));
    vec3 normal = normalize(point / vec3(1.0, 0.935 * 0.935, 1.0));
    vec3 albedo = pow(texture2D(uJupiterMap, mapCoordinates(sphere, 0.15 + uTime * 0.001)).rgb, vec3(2.2));
    float diffuse = max(dot(normal, sunlight), 0.0);
    float limb = pow(1.0 - max(dot(normal, -ray), 0.0), 4.0);
    vec3 giant = albedo * sunColor * (diffuse * 1.35 + 0.006);
    giant += vec3(0.022, 0.027, 0.035) * limb * diffuse;
    vec3 o = fromJupiter / vec3(1.0, 0.935, 1.0);
    vec3 d = normalize(ray / vec3(1.0, 0.935, 1.0));
    float impact = length(cross(o, d)) / jupiterRadius;
    float pixel = length(fromJupiter) / (jupiterRadius * uResolution.y * 1.4);
    color = mix(color, giant, 1.0 - smoothstep(1.0 - pixel, 1.0, impact));
  }

  vec2 io = bodyHit(camera, ray, 1.0, IO_FLATTENING);
  if (io.x > 0.0) {
    vec3 point = camera + ray * io.x;
    vec3 sphere = normalize(point / vec3(1.0, IO_FLATTENING, 1.0));
    vec3 normal = normalize(point / vec3(1.0, IO_FLATTENING * IO_FLATTENING, 1.0));
    // The view opens onto Pele's red sulfur deposit after the approach.
    vec3 albedo = pow(texture2D(uSurfaceMap, mapCoordinates(sphere, 0.13 + uTime * 0.0005)).rgb, vec3(2.2));
    float luminance = dot(albedo, vec3(0.2126, 0.7152, 0.0722));
    albedo = mix(vec3(luminance), albedo, 0.90);
    float diffuse = max(dot(normal, sunlight), 0.0);
    float viewCosine = max(dot(normal, -ray), 0.0);
    float scattering = mix(diffuse, diffuse / max(diffuse + viewCosine, 0.01), 0.25);
    vec3 surface = albedo * sunColor * scattering * 1.65;
    float jupiterShine = max(dot(normal, normalize(jupiterCenter - point)), 0.0);
    surface += albedo * (vec3(0.003, 0.004, 0.006) + vec3(0.012, 0.010, 0.008) * jupiterShine);
    vec3 o = camera / vec3(1.0, IO_FLATTENING, 1.0);
    vec3 d = normalize(ray / vec3(1.0, IO_FLATTENING, 1.0));
    float impact = length(cross(o, d));
    float pixel = length(camera) / (uResolution.y * 1.4);
    color = mix(color, surface, 1.0 - smoothstep(1.0 - pixel, 1.0, impact));
  }

  // Exposure rises with the orbital clock after the entrance reveal completes.
  // Reduced-motion rendering uses the settled time and skips this introduction.
  float exposure = mix(0.035, 1.0, smoothstep(0.15, 4.8, uTime));
  color = pow(filmic(color * exposure), vec3(1.0 / 2.2));
  float vignette = 1.0 - smoothstep(0.4, 1.0, length(uv - 0.5)) * 0.14;
  color += (hash(vec3(gl_FragCoord.xy, 1.0)) - 0.5) / 255.0;
  gl_FragColor = vec4(color * vignette, 1.0);
}
`;
