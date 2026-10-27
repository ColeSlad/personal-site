export const spaceVertexShader = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

// Textured, oblate planet and analytic rings; lighting is evaluated in linear space.
export const spaceFragmentShader = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uFocus;
uniform float uTime;
uniform sampler2D uSurfaceMap;
uniform sampler2D uRingMap;
const float PI = 3.14159265359;
const float FLATTENING = 0.903;
const float RING_INNER = 1.24;
const float RING_OUTER = 2.34;

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
  vec3 color = vec3(0.0010, 0.0018, 0.0038);
  color += vec3(0.009, 0.005, 0.018) * pow(dust, 3.0) * lane;
  for (int i = 0; i < 2; i++) {
    float scale = 155.0 + float(i) * 115.0;
    vec3 cell = floor(direction * scale);
    vec3 local = fract(direction * scale) - 0.5;
    float seed = hash(cell);
    float star = exp(-dot(local, local) * 420.0) * step(0.974, seed);
    vec3 tint = mix(vec3(0.67, 0.79, 1.0), vec3(1.0, 0.83, 0.66), seed);
    color += tint * star * (0.35 + 1.8 * pow(fract(seed * 431.0), 6.0));
  }
  return color;
}

// Coordinates are in the tilted equatorial frame of the planet.
vec3 toLocal(vec3 p) {
  vec3 axis = normalize(vec3(0.12, 1.0, 0.18));
  vec3 xAxis = normalize(cross(axis, vec3(0.0, 0.0, 1.0)));
  return vec3(dot(p, xAxis), dot(p, axis), dot(p, cross(xAxis, axis)));
}

vec2 ellipsoidHit(vec3 origin, vec3 ray, float radius) {
  vec3 o = origin / vec3(1.0, FLATTENING, 1.0);
  vec3 d = ray / vec3(1.0, FLATTENING, 1.0);
  float a = dot(d, d), b = dot(o, d);
  float h = b * b - a * (dot(o, o) - radius * radius);
  if (h < 0.0) return vec2(-1.0);
  return vec2(-b - sqrt(h), -b + sqrt(h)) / a;
}

vec4 ringSample(float radius) {
  if (radius <= RING_INNER || radius >= RING_OUTER) return vec4(0.0);
  float coordinate = (radius - RING_INNER) / (RING_OUTER - RING_INNER);
  vec4 material = texture2D(uRingMap, vec2(coordinate, 0.5));
  return vec4(pow(material.rgb, vec3(2.2)), material.a);
}

float ringShadow(vec3 point, vec3 sunlight) {
  if (abs(sunlight.y) < 0.001) return 1.0;
  float t = -point.y / sunlight.y;
  if (t <= 0.0) return 1.0;
  float radius = length((point + sunlight * t).xz);
  // A finite sun softens the ring shadow while preserving the major gaps.
  float penumbra = 0.0025 + t * 0.002;
  float opacity = ringSample(radius).a * 0.5;
  opacity += ringSample(radius + penumbra).a * 0.25;
  opacity += ringSample(radius - penumbra).a * 0.25;
  return exp(-opacity * 2.5);
}

vec3 atmosphere(vec3 origin, vec3 ray, vec3 sunlight, float surfaceDistance) {
  vec2 segment = ellipsoidHit(origin, ray, 1.025);
  if (segment.y <= 0.0) return vec3(0.0);
  float start = max(segment.x, 0.0);
  float end = surfaceDistance > 0.0 ? min(segment.y, surfaceDistance) : segment.y;
  float stepSize = max(end - start, 0.0) / 4.0;
  vec3 scatter = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    vec3 point = origin + ray * (start + (float(i) + 0.5) * stepSize);
    vec3 radial = point / vec3(1.0, FLATTENING, 1.0);
    float altitude = max(length(radial) - 1.0, 0.0);
    float density = exp(-altitude * 160.0);
    float daylight = smoothstep(-0.12, 0.2, dot(normalize(radial), sunlight));
    scatter += vec3(0.32, 0.45, 0.64) * density * daylight * stepSize * 2.0;
  }
  float phase = 0.75 * (1.0 + pow(dot(ray, sunlight), 2.0));
  return scatter * phase;
}

vec3 filmic(vec3 color) {
  return clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 screen = (uv - uFocus) * vec2(aspect, 1.0);
  float mobile = 1.0 - step(0.86, aspect);
  float arrival = smoothstep(0.0, 7.0, uTime);
  float angle = -0.95 + 1.48 * arrival + uTime * 0.010 + uPointer.x * 0.12;
  float distanceToPlanet = mix(6.8, 3.8, arrival) * mix(1.0, 1.80, mobile);
  vec3 camera = vec3(sin(angle) * distanceToPlanet,
    mix(3.2, 1.25, arrival) + sin(uTime * 0.045) * 0.20 + uPointer.y * 0.12,
    cos(angle) * distanceToPlanet);
  vec3 forward = normalize(-camera);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  vec3 worldRay = normalize(screen.x * right + screen.y * up + forward * 1.4);
  vec3 color = sky(worldRay);
  vec3 origin = toLocal(camera);
  vec3 ray = toLocal(worldRay);
  vec3 sunlight = normalize(toLocal(vec3(-3.8, 2.8, 5.0)));
  vec3 sunColor = vec3(1.0, 0.96, 0.87);

  vec2 intersection = ellipsoidHit(origin, ray, 1.0);
  float planet = intersection.x;
  if (planet > 0.0) {
    vec3 point = origin + ray * planet;
    vec3 sphere = normalize(point / vec3(1.0, FLATTENING, 1.0));
    vec3 normal = normalize(point / vec3(1.0, FLATTENING * FLATTENING, 1.0));
    vec2 mapUV = vec2(fract(atan(sphere.z, sphere.x) / (2.0 * PI) + 0.5 + uTime * 0.002), asin(sphere.y) / PI + 0.5);
    vec3 albedo = pow(texture2D(uSurfaceMap, mapUV).rgb, vec3(2.2));
    float diffuse = max(dot(normal, sunlight), 0.0);
    float viewCosine = max(dot(normal, -ray), 0.0);
    float scattering = mix(diffuse, diffuse / max(diffuse + viewCosine, 0.01), 0.2);
    vec3 surface = albedo * sunColor * scattering * ringShadow(point, sunlight) * 1.8;
    surface += albedo * vec3(0.008, 0.012, 0.020);
    float limb = pow(1.0 - viewCosine, 4.0) * smoothstep(-0.03, 0.5, diffuse);
    surface += vec3(0.035, 0.060, 0.085) * limb;
    vec3 scaledOrigin = origin / vec3(1.0, FLATTENING, 1.0);
    vec3 scaledRay = normalize(ray / vec3(1.0, FLATTENING, 1.0));
    float impact = length(cross(scaledOrigin, scaledRay));
    float pixel = length(camera) / (uResolution.y * 1.4);
    float coverage = 1.0 - smoothstep(1.0 - pixel, 1.0, impact);
    color = mix(color, surface, coverage);
  }

  float disk = abs(ray.y) > 0.0001 ? -origin.y / ray.y : -1.0;
  if (disk > 0.0 && (planet < 0.0 || disk < planet)) {
    vec3 point = origin + ray * disk;
    float radius = length(point.xz);
    if (radius > RING_INNER && radius < RING_OUTER) {
      vec4 material = ringSample(radius);
      float viewAngle = max(abs(ray.y), 0.08);
      float opacity = 1.0 - exp(-material.a * 1.8 / viewAngle);
      vec3 stretchedPoint = point / vec3(1.0, FLATTENING, 1.0);
      vec3 stretchedLight = normalize(sunlight / vec3(1.0, FLATTENING, 1.0));
      float shadowDistance = length(cross(stretchedPoint, stretchedLight));
      float shadow = dot(stretchedPoint, stretchedLight) < 0.0 ? smoothstep(0.99, 1.015, shadowDistance) : 1.0;
      float phase = 0.8 + 0.2 * pow(max(dot(-ray, sunlight), 0.0), 6.0);
      float illumination = abs(sunlight.y) * 1.8 * shadow;
      vec3 rings = material.rgb * sunColor * (illumination + 0.012) * phase;
      color = mix(color, rings, opacity);
    }
  }

  color += atmosphere(origin, ray, sunlight, planet);
  color = pow(filmic(color), vec3(1.0 / 2.2));
  float vignette = 1.0 - smoothstep(0.4, 1.0, length(uv - 0.5)) * 0.14;
  color += (hash(vec3(gl_FragCoord.xy, 1.0)) - 0.5) / 255.0;
  gl_FragColor = vec4(color * vignette, 1.0);
}
`;
