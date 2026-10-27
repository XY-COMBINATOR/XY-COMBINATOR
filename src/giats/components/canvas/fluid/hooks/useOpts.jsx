/**
 * useOpts Hook
 * Provides resolution, viscosity, and dissipation options for the WebGL fluid simulation.
 * Dynamically scales simulation resolution on mobile viewports for fluid 60fps rendering.
 */
import { useMemo } from 'react';

const useOpts = () => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 812 : false;

  const OPTS = useMemo(
    () => ({
      intensity: 5,
      force: 1,
      curl: 1,
      radius: isMobile ? 0.11 : 0.14,
      swirl: 3,

      pressure: 0.0,
      densityDissipation: isMobile ? 0.96 : 0.965,
      velocityDissipation: 0.93,

      fluidColor: '#f0f4f1',
      backgroundColor: '#070410',

      showBackground: false,

      dyeRes: isMobile ? 64 : 256,
      simRes: isMobile ? 16 : 50,
    }),
    [isMobile],
  );

  return OPTS;
};

export default useOpts;
