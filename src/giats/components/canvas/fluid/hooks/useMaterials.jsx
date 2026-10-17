import { ShaderMaterial, Texture, Vector2, Vector3 } from 'three';

import advectionFrag from '@src/components/canvas/fluid/glsl/advection.frag';
import baseVertex from '@src/components/canvas/fluid/glsl/base.vert';
import clearFrag from '@src/components/canvas/fluid/glsl/clear.frag';
import curlFrag from '@src/components/canvas/fluid/glsl/curl.frag';
import divergenceFrag from '@src/components/canvas/fluid/glsl/divergence.frag';
import gradientSubstractFrag from '@src/components/canvas/fluid/glsl/gradientSubstract.frag';
import pressureFrag from '@src/components/canvas/fluid/glsl/pressure.frag';
import splatFrag from '@src/components/canvas/fluid/glsl/splat.frag';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useMemo } from 'react';
import useOpts from '@src/components/canvas/fluid/hooks/useOpts';
import { useThree } from '@react-three/fiber';
import vorticityFrag from '@src/components/canvas/fluid/glsl/vorticity.frag';

const useMaterials = () => {
  const size = useThree((s) => s.size);
  const OPTS = useOpts();

  const shaderMaterials = useMemo(() => {
    const advection = new ShaderMaterial({
      uniforms: {
        uVelocity: {
          value: new Texture(),
        },
        uSource: {
          value: new Texture(),
        },
        dt: {
          value: 0.016,
        },
        uDissipation: {
          value: 1.0,
        },
        texelSize: { value: new Vector2() },
      },
      fragmentShader: advectionFrag,
    });

    const clear = new ShaderMaterial({
      uniforms: {
        uTexture: {
          value: new Texture(),
        },
        uClearValue: {
          value: OPTS.pressure,
        },
        texelSize: {
          value: new Vector2(),
        },
      },
      fragmentShader: clearFrag,
    });

    const curl = new ShaderMaterial({
      uniforms: {
        uVelocity: {
          value: new Texture(),
        },
        texelSize: {
          value: new Vector2(),
        },
      },
      fragmentShader: curlFrag,
    });

    const divergence = new ShaderMaterial({
      uniforms: {
        uVelocity: {
          value: new Texture(),
        },
        texelSize: {
          value: new Vector2(),
        },
      },
      fragmentShader: divergenceFrag,
    });

    const gradientSubstract = new ShaderMaterial({
      uniforms: {
        uPressure: {
          value: new Texture(),
        },
        uVelocity: {
          value: new Texture(),
        },
        texelSize: {
          value: new Vector2(),
        },
      },
      fragmentShader: gradientSubstractFrag,
    });

    const pressure = new ShaderMaterial({
      uniforms: {
        uPressure: {
          value: new Texture(),
        },
        uDivergence: {
          value: new Texture(),
        },
        texelSize: {
          value: new Vector2(),
        },
      },
      fragmentShader: pressureFrag,
    });

    const splat = new ShaderMaterial({
      uniforms: {
        uTarget: {
          value: new Texture(),
        },
        aspectRatio: {
          value: size.width / size.height,
        },
        uColor: {
          value: new Vector3(),
        },
        uPointer: {
          value: new Vector2(),
        },
        uRadius: {
          value: OPTS.radius / 100.0,
        },
        texelSize: {
          value: new Vector2(),
        },
      },
      fragmentShader: splatFrag,
    });

    const vorticity = new ShaderMaterial({
      uniforms: {
        uVelocity: {
          value: new Texture(),
        },
        uCurl: {
          value: new Texture(),
        },
        uCurlValue: {
          value: OPTS.curl,
        },
        dt: {
          value: 0.016,
        },
        texelSize: {
          value: new Vector2(),
        },
      },
      fragmentShader: vorticityFrag,
    });

    return {
      splat,
      curl,
      clear,
      divergence,
      pressure,
      gradientSubstract,
      advection,
      vorticity,
    };
  }, [OPTS.curl, OPTS.pressure, OPTS.radius, size.height, size.width]);

  useIsomorphicLayoutEffect(() => {
    Object.values(shaderMaterials).forEach((material) => {
      const aspectRatio = size.width / (size.height + 400);

      material.uniforms.texelSize.value.set(1 / (OPTS.simRes * aspectRatio), 1 / OPTS.simRes);
      material.vertexShader = baseVertex;
      material.depthTest = false;
      material.depthWrite = false;
    });

    return () => {
      Object.values(shaderMaterials).forEach((material) => {
        material.dispose();
      });
    };
  }, [shaderMaterials, size]);

  return shaderMaterials;
};
export default useMaterials;
