/* eslint-disable */

import * as THREE from 'three';

import { Environment, Sphere, Text, View, useTexture } from '@react-three/drei';
import { createPortal, extend, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

extend({ RoundedBoxGeometry });

const DEFAULT_ITERATIONS = 48;
const DEFAULT_SMOOTHING = 0.02;
const DEFAULT_RAY_DIR_POS = { x: 0, y: 0, z: 1 };
const DEFAULT_RAY_ORIG_POS = { x: 0, y: 0, z: 0 };

function useRenderTargetTexture() {
  const camera = useRef();
  const mesh = useRef();

  const [scene, target] = useMemo(() => {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
      return [scene, target];
    }
    return [null, null];
  }, []);


   useFrame(({ clock, gl }) => {
    const time = clock.getElapsedTime();
    if (camera.current && mesh.current) {
      mesh.current.rotation.y = time;

      gl.setRenderTarget(target);
      gl.render(scene, camera.current);
      gl.setRenderTarget(null);
    }
  });

  return { camera, mesh, scene, texture: target?.texture };
}



export default function MagicBall({ roughness, color, isSphere, text }) {
  return (
    <View>
      <Marble roughness={roughness} color={color} isSphere={isSphere} text={text} />
      <Environment files={isSphere ? '/other/warehouse.hdr' : '/other/studio_small_09_1k.hdr'} blur={1} />
    </View>
  );
}

function Marble({ roughness, color, isSphere, text }) {
  const { camera, mesh, scene, texture } = useRenderTargetTexture();

  return (
    <>
      <perspectiveCamera aspect={1} far={20} fov={75} near={1} position={[0, 0, 5]} ref={camera} />
      {isSphere ? (
        <Sphere args={[1.8, 32, 32]} ref={mesh}>
          <MagicMarbleMaterial isSphere={isSphere} texture={texture} color={color} roughness={roughness} />
          {/* <meshStandardMaterial attach="material" map={colorMap} normalMap={normalMap} /> */}
        </Sphere>
      ) : (
        <mesh ref={mesh}>
          <roundedBoxGeometry attach="geometry" args={[2.7, 2.7, 2.7, 7, 0.2]} />
          <MagicMarbleMaterial isSphere={isSphere} texture={texture} color={color} roughness={roughness} />
        </mesh>
      )}
      {scene &&
        createPortal(
        <Text scale={[0.7, 1.5, 1]} fontSize={isSphere ? 1 : 0.8}>
          {text}
        </Text>,
        scene,
        )}
    </>
  );
}

MagicBall.propTypes = {
  roughness: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  isSphere: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

const sNoiseFuncs = `
vec3 mod289(vec3 x) {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
   return mod289(((x*34.0)+1.0)*x);
}

#define noiseFactor 0.2

float snoise(vec2 v) {
 const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
 vec2 i  = floor(v + dot(v, C.yy));
 vec2 x0 = v - i + dot(i, C.xx);

 vec2 i1;
 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
 vec4 x12 = x0.xyxy + C.xxzz;
 x12.xy -= i1;

 i = mod289(i);
 vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

 vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
 m = m*m;
 m = m*m;

 vec3 x = 2.0 * fract(p * C.www) - 1.0;
 vec3 h = abs(x) - 0.5;
 vec3 ox = floor(x + 0.5);
 vec3 a0 = x - ox;

 m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

 vec3 g;
 g.x  = a0.x  * x0.x  + h.x  * x0.y;
 g.yz = a0.yz * x12.xz + h.yz * x12.yw;
 return noiseFactor * dot(m, g);
}`;

function MagicMarbleMaterial({ roughness, color, texture, isSphere }) {
   const volumeColor = {
    r: 0,
    g: 0,
    b: 255,
  };
  const iterations = DEFAULT_ITERATIONS;
  const smoothing = DEFAULT_SMOOTHING;
  const rayDirPos = DEFAULT_RAY_DIR_POS;
  const rayOrigPos = DEFAULT_RAY_ORIG_POS;
  THREE.Cache.enabled = true;
  const [baseTexture1, baseTexture2, heightVolumeTexture1] = useTexture([
    '/other/noise1.png',
    '/other/peakpx.jpg',
    '/other/noise2.png',
  ]);

  const configureTexture = (texture) => {
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
  };

  configureTexture(baseTexture1);
  configureTexture(baseTexture2);
  configureTexture(heightVolumeTexture1);

   const getTextures = (isSphere) => ({
    baseMap: isSphere ? baseTexture2 : baseTexture2,
    heightVolumeMap: isSphere ? baseTexture1 : heightVolumeTexture1,
  });

  const { baseMap, heightVolumeMap } = getTextures(isSphere);


  const [uniforms] = useState(() => ({
    time: { value: 0 },
    volumeColor: { value: new THREE.Color(color) },
    baseMap: { value: baseMap },
    heightVolumeMap: { value: heightVolumeMap },
    iterations: { value: iterations },
    smoothing: { value: smoothing },
    rayDirPos: { value: rayDirPos },
    rayOrigPos: { value: rayOrigPos },
    uRepeats: { value: isSphere ? { x: 5, y: 4 } : { x: 1, y: 1 } },
    uTextSpeed: { value: 0.3 },
    uHasTexture: { value: !!texture },
    uTexture: { value: texture },
    uUseTextAnimation: { value: true },
  }));

  useFrame(({ clock }) => {
    uniforms.time.value = 1 + clock.elapsedTime * 0.05;
  });

   const onBeforeCompile = (shader) => {
     shader.uniforms = { ...shader.uniforms, ...uniforms };

     shader.vertexShader = /* glsl */ `
      varying vec3 v_pos;
      varying vec3 v_dir;
      varying vec2 vUv;

    ${shader.vertexShader}`;

     shader.vertexShader = shader.vertexShader.replace(
      /void main\(\) {/,
      (match) =>
        `${
          match
          /* glsl */
        }
        vUv = uv;
        vNormal = normal;

        vec3 newPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        `,
    );

     shader.fragmentShader = /* glsl */ `
      #define FLIP vec2(1., -1.)

      uniform vec3 volumeColor;
      uniform sampler2D baseMap;
      uniform sampler2D heightVolumeMap;
      uniform int iterations;
      uniform float smoothing;
      uniform float time;
      uniform vec3 rayDirPos;
      uniform vec3 rayOrigPos;

      uniform bool uHasTexture;
      uniform vec2 uRepeats;
      uniform sampler2D uTexture;
      uniform float uTextSpeed;
      uniform float uTime;
      uniform bool uUseTextAnimation;

      varying vec3 v_pos;
      varying vec3 v_dir;
      varying vec2 vUv;

    ${shader.fragmentShader}`;

     shader.fragmentShader = shader.fragmentShader.replace(
      /void main\(\) {/,
      (match) =>
        `${
          sNoiseFuncs
          /* glsl */
        }


      /**
      * @param rayOrigin - Point on sphere
      * @param rayDir - Normalized ray direction
      * @returns Diffuse RGB color
      */

      vec3 raymarching_sphere(vec3 rayOrigin, vec3 rayDir) {
        float perIteration = 1.0 / float(iterations);
        vec3 deltaRay = rayDir * perIteration;
        vec3 p = rayOrigin;
        float totalVolume = 0.0;
        vec2 uv2 = vUv;

        for (int i = 0; i < iterations; ++i) {
            vec2 uv = uv2;
            float s = snoise(vec2(uv.x * 1.0 + time * 10.0, uv.y * 1.3 + time * 10.0));
            uv *= 1.0 + s * 100.0;
            float heightMapVal = texture(heightVolumeMap, uv).r;
            float height = length(p);
            float cutoff = 1.0 - float(i) * perIteration;
            float slice = smoothstep(cutoff, cutoff + smoothing, heightMapVal);
            totalVolume += slice * perIteration;
            p += deltaRay;


            if (totalVolume >= 1.0) {
                break;
            }
        }

        float s2 = snoise(vec2(uv2.x * 1.0 - time * 10.0, uv2.y * 1.3 - time * 10.0));
        uv2 *= 1.0 + s2 * 100.0;

        return mix(texture(baseMap, uv2).rgb, volumeColor.rgb, totalVolume);
    }
      ${match}`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      /vec4 diffuseColor.*;/,
      `
      vec2 repeat = vec2(uRepeats.x, uRepeats.y);
      float animationSpeed = uUseTextAnimation ? uTime * uTextSpeed * 0.5: 0.0;
      vec2 uv = fract(animationSpeed + vUv * repeat);
      vec3 textureColor = texture2D(uTexture, uv).rgb;

      vec3 rayDir = normalize(v_dir) + rayDirPos;
      vec3 rayOrigin = v_pos + rayOrigPos;
      vec3 rgb = raymarching_sphere(rayOrigin, rayDir);
      vec4 sphereColor = vec4(rgb, 1.0);
      vec4 textColor =  vec4(0.0, 0.0, 0.0, 1.0);
      vec4 diffuseColor = mix(sphereColor, textColor, step(0.5, textureColor.r));`,
    );
  };

  return <meshStandardMaterial roughness={roughness} onBeforeCompile={onBeforeCompile} customProgramCacheKey={() => onBeforeCompile.toString()} />;
}
