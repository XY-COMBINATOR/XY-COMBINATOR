import * as THREE from 'three';

import useDoubleFBO from '@src/components/canvas/fluid/hooks/useDoubleFBO';
import { useFBO } from '@react-three/drei';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useMemo } from 'react';
import useOpts from '@src/components/canvas/fluid/hooks/useOpts';

const useFBOs = () => {
  const OPTS = useOpts();

  const density = useDoubleFBO(OPTS.dyeRes, OPTS.dyeRes, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    depth: false,
  });

  const velocity = useDoubleFBO(OPTS.simRes, OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RGFormat,
    minFilter: THREE.LinearFilter,
    depth: false,
  });

  const pressure = useDoubleFBO(OPTS.simRes, OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  });

  const divergence = useFBO(OPTS.simRes, OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  });

  const curl = useFBO(OPTS.simRes, OPTS.simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  });

  const FBOs = useMemo(
    () => ({
      density,
      velocity,
      pressure,
      divergence,
      curl,
    }),
    [curl, density, divergence, pressure, velocity],
  );

  useIsomorphicLayoutEffect(
    () => () => {
      Object.values(FBOs).forEach((FBO) => FBO.dispose());
    },
    [FBOs],
  );

  return FBOs;
};
export default useFBOs;
