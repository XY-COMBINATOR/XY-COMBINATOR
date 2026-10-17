/* eslint-disable @react-three/no-new-in-loop */

import { Camera, Scene, Texture, Vector2, Vector3 } from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useRef } from 'react';

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

  const bufferScene = useRef(new Scene());
  const bufferCamera = useRef(new Camera());
  const meshRef = useRef(null);
  const postRef = useRef(null);
  const FBOs = useFBOs();
  const materials = useMaterials();
  const splatStack = usePointerEvents(mainRef, size, force);

  const setShaderMaterial = useCallback(
    (name) => {
      if (!meshRef.current) return;
      meshRef.current.material = materials[name];
      meshRef.current.material.needsUpdate = true;
    },
    [materials],
  );

  const setRenderTarget = useCallback(
    (name) => {
      const target = FBOs[name];
      if ('write' in target) {
        gl.setRenderTarget(target.write);
        gl.clear();
        gl.render(bufferScene.current, bufferCamera.current);
        target.swap();
      } else {
        gl.setRenderTarget(target);
        gl.clear();
        gl.render(bufferScene.current, bufferCamera.current);
      }
    },
    [bufferCamera, bufferScene, FBOs, gl],
  );

  const setUniforms = useCallback(
    (material, uniform, value) => {
      const mat = materials[material];
      if (mat && mat.uniforms[uniform]) {
        mat.uniforms[uniform].value = value;
      }
    },
    [materials],
  );

  useFrame(() => {
    if (!meshRef.current || !postRef.current) return;

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

    setShaderMaterial('pressure');
    setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);
    for (let i = 0; i < swirl; i += 1) {
      setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
      setRenderTarget('pressure');
    }

    setShaderMaterial('gradientSubstract');
    setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
    setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
    setRenderTarget('velocity');

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
        bufferScene.current,
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
