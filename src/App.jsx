/**
 * App Component
 * Primary root orchestrator for XY Combinator.
 * Combines React Three Fiber WebGL scenes, GLSL fluid simulation,
 * Lenis smooth inertial scrolling, GSAP ScrollTrigger, and global state management.
 */
import '@src/styles/global.scss';
import '@src/styles/global.css';

import * as THREE from 'three';
import { useMemo, useRef } from 'react';

import { Analytics } from '@vercel/analytics/react';
import Background from '@src/components/canvas/background/Index';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import Fluid from '@src/components/canvas/fluid/Fluid';
import Layout from '@src/components/dom/Layout';
import Lenis from 'lenis';
import Loader from '@src/components/dom/Loader';
import Navbar from '@src/components/dom/navbar/Index';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Scrollbar from '@src/components/dom/Scrollbar';
import Tempus from '@darkroom.engineering/tempus';
import { View } from '@react-three/drei';
import { gsap } from 'gsap';
import LandingPage from '@src/pages/index.page.jsx';
import styles from '@src/pages/app.module.scss';
import useFoucFix from '@src/hooks/useFoucFix';
import { useFrame } from '@darkroom.engineering/hamo';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import useScroll from '@src/hooks/useScroll';
import useSmoothScrollInteractions from '@src/hooks/useSmoothScrollInteractions';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

// Global GSAP ticker and ScrollTrigger configuration
if (typeof window !== 'undefined') {
  gsap.defaults({ ease: 'none' });
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  gsap.ticker.lagSmoothing(0);
  gsap.ticker.remove(gsap.updateRoot);
  Tempus?.add((time) => {
    gsap.updateRoot(time / 1000);
  }, 0);

  window.scrollTo(0, 0);
  window.history.scrollRestoration = 'manual';
  ScrollTrigger.clearScrollMemory(window.history.scrollRestoration);
}

// Default static router object for SPA anchor-based navigation
const staticRouter = { asPath: '/', pathname: '/', route: '/', query: {} };

export default function App() {
  const [lenisInstance, setLenis, fluidColor, isAbout] = useStore(
    useShallow((state) => [state.lenis, state.setLenis, state.fluidColor, state.isAbout]),
  );

  const mainRef = useRef(null);
  const mainContainerRef = useRef(null);
  const layoutRef = useRef(null);

  // Hooks for preventing FOUC and binding scroll events
  useFoucFix();
  useScroll(() => ScrollTrigger.update());
  useSmoothScrollInteractions(lenisInstance);

  // Initialize Lenis smooth inertial scrolling
  useIsomorphicLayoutEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const createdLenis = new Lenis({
      smoothWheel: true,
      syncTouch: false,
      lerp: reduceMotion ? 1 : 0.1,
      wrapper: mainRef.current || undefined,
      content: mainContainerRef.current || undefined,
      eventsTarget: window,
    });

    setLenis(createdLenis);
    createdLenis.stop();

    return () => {
      createdLenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  // Synchronize ScrollTrigger with Lenis updates
  useIsomorphicLayoutEffect(() => {
    if (lenisInstance) {
      ScrollTrigger.refresh();
    }
  }, [lenisInstance]);

  // Connect Lenis animation frame step to Darkroom Tempus loop
  useFrame((time) => {
    if (lenisInstance) {
      lenisInstance.raf(time);
    }
  }, 0);

  // Memoized persistent DOM elements (Loader, Background, Navigation, Analytics)
  const domElements = useMemo(
    () => (
      <>
        <Loader />
        <div className={styles.background}>
          <Background />
        </div>
        <Scrollbar />
        <Navbar />
        <Analytics />
      </>
    ),
    [],
  );

  // Memoized 3D Viewport canvas for three-dimensional geometry
  const canvasElements = useMemo(
    () => (
      <Canvas
        gl={{
          pixelRatio: 0.5,
          outputColorSpace: isAbout === false ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace,
        }}
        style={{ zIndex: 0 }}
        resize={{ debounce: { resize: 0, scroll: 0 }, polyfill: undefined }}
        className={styles.canvasContainer}
        dpr={[0.5, 1]}
      >
        <View.Port />
      </Canvas>
    ),
    [isAbout],
  );

  return (
    <div className={styles.root}>
      {domElements}
      <div ref={layoutRef} id="layout" className={styles.layout}>
        {canvasElements}

        {/* Offscreen WebGL Fluid Simulation Canvas */}
        <Canvas
          id="fluidCanvas"
          flat
          gl={{
            antialias: false,
            stencil: false,
            depth: false,
            pixelRatio: 0.1,
          }}
          style={{ mixBlendMode: 'difference', background: 'black' }}
          linear
          className={styles.canvasContainer}
          dpr={[0.1, 0.5]}
        >
          <EffectComposer>
            <Fluid fluidColor={fluidColor} mainRef={mainRef} />
          </EffectComposer>
        </Canvas>

        {/* Main Content Viewport */}
        <main ref={mainRef} className={styles.main}>
          <div ref={mainContainerRef} id="mainContainer" className={styles.mainContainer}>
            <Layout layoutRef={layoutRef} mainRef={mainRef} router={staticRouter}>
              <LandingPage />
            </Layout>
          </div>
        </main>
      </div>
    </div>
  );
}
