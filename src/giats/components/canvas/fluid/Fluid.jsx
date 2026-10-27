/**
 * Fluid Simulation Component
 * Real-time Navier-Stokes fluid dynamics solver running in WebGL.
 * Computes vorticity, curl, divergence, pressure Poisson equation, and advection across ping-pong FBOs.
 */
/* eslint-disable @react-three/no-new-in-loop */
import { Camera, Scene, Texture, Vector2, Vector3 } from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';

import Effect from '@src/components/canvas/fluid/effect/Fluid';
import useFBOs from '@src/components/canvas/fluid/hooks/useFBOs';
import useMaterials from '@src/components/canvas/fluid/hooks/useMaterials';
import useOpts from '@src/components/canvas/fluid/hooks/useOpts';
import usePointerEvents from '@src/components/canvas/fluid/hooks/usePointerEvents';

function Fluid({ mainRef, fluidColor }) {
  const OPTS = useOpts();
  const { force, radius, curl, swirl, intensity, backgroundColor, showBackground, pressure, densityDissipation, velocityDissipation } = OPTS;
  const size = useThree((three) => three.size);
  const gl = useThree((three) => three.gl);

  // Use useMemo for stable Three.js scene instances instead of ref access during render
  const bufferScene = useMemo(() => new Scene(), []);
  const bufferCamera = useMemo(() => new Camera(), []);
  
  const meshRef = useRef(null);
  const postRef = useRef(null);
  const FBOs = useFBOs();
  const materials = useMaterials();
  const splatStack = usePointerEvents(mainRef, size, force);
  const lastActivity = useRef(0);

  /**
   * Sets the active shader material on the offscreen calculation quad.
   */
  const setShaderMaterial = useCallback(
    (name) => {
      if (!meshRef.current) return;
      meshRef.current.material = materials[name];
      meshRef.current.material.needsUpdate = true;
    },
    [materials],
  );

  /**
   * Renders the buffer scene to the designated FBO target.
   */
  const setRenderTarget = useCallback(
    (name) => {
      const target = FBOs[name];
      if ('write' in target) {
        gl.setRenderTarget(target.write);
        gl.clear();
        gl.render(bufferScene, bufferCamera);
        target.swap();
      } else {
        gl.setRenderTarget(target);
        gl.clear();
        gl.render(bufferScene, bufferCamera);
      }
    },
    [bufferCamera, bufferScene, FBOs, gl],
  );

  /**
   * Updates uniform values on the respective shader material.
   */
  const setUniforms = useCallback(
    (material, uniform, value) => {
      const mat = materials[material];
      if (mat && mat.uniforms[uniform]) {
        mat.uniforms[uniform].value = value;
      }
    },
    [materials],
  );

  /**
   * Main simulation frame tick.
   */
  useFrame(() => {
    if (!meshRef.current || !postRef.current) return;

    // Sleep simulation when inactive for over 1.8 seconds to save GPU battery
    if (splatStack.current.length > 0) {
      lastActivity.current = performance.now();
    } else if (performance.now() - lastActivity.current > 1800) {
      return;
    }

    // Apply cursor splats
    while (splatStack.current.length > 0) {
      const { mouseX, mouseY, velocityX, velocityY } = splatStack.current.pop();

      setShaderMaterial('splat');
      setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
      setUniforms('splat', 'uPointer', new Vector2(mouseX, mouseY));
      setUniforms('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0));
      setUniforms('splat', 'uRadius', radius / 100.0);
      setRenderTarget('velocity');
      setUniforms('splat', 'uTarget', FBOs.density.read.texture);
      setRenderTarget('density');
    }

    // Solve Navier-Stokes equations
    const shaderUpdates = [
      { material: 'curl', uniforms: { uVelocity: FBOs.velocity.read.texture }, target: 'curl' },
      { material: 'vorticity', uniforms: { uVelocity: FBOs.velocity.read.texture, uCurl: FBOs.curl.texture, uCurlValue: curl }, target: 'velocity' },
      { material: 'divergence', uniforms: { uVelocity: FBOs.velocity.read.texture }, target: 'divergence' },
      { material: 'clear', uniforms: { uTexture: FBOs.pressure.read.texture, uClearValue: pressure }, target: 'pressure' },
    ];

    shaderUpdates.forEach(({ material, uniforms, target }) => {
      setShaderMaterial(material);
      Object.entries(uniforms).forEach(([key, value]) => setUniforms(material, key, value));
      setRenderTarget(target);
    });

    // Pressure Poisson iterations
    setShaderMaterial('pressure');
    setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);
    for (let i = 0; i < swirl; i += 1) {
      setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
      setRenderTarget('pressure');
    }

    // Gradient subtraction
    setShaderMaterial('gradientSubstract');
    setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
    setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
    setRenderTarget('velocity');

    // Advection
    setShaderMaterial('advection');
    setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
    setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
    setUniforms('advection', 'uDissipation', velocityDissipation);
    setRenderTarget('velocity');

    setUniforms('advection', 'uSource', FBOs.density.read.texture);
    setUniforms('advection', 'uDissipation', densityDissipation);
    setRenderTarget('density');

    gl.setRenderTarget(null);
    gl.clear();
  }, 0);

  return (
    <>
      {createPortal(
        <mesh ref={meshRef} scale={[1, 1, 0]}>
          <planeGeometry args={[2, 2, 1, 1]} />
        </mesh>,
        bufferScene,
      )}
      <Effect
        intensity={intensity * 0.0001}
        backgroundColor={backgroundColor}
        fluidColor={fluidColor}
        showBackground={showBackground}
        ref={postRef}
        tFluid={FBOs?.density?.read?.texture || new Texture()}
      />
    </>
  );
}

export default Fluid;
