import { useEffect, useRef, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const FruitNinja = dynamic(() => import('@src/components/dom/prefooter/FruitNinja'), { ssr: false });

function Index() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const devicePixelRatio = typeof window !== 'undefined' ? Math.min(1, window.devicePixelRatio) : 1;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {active ? (
        <Canvas
          dpr={[devicePixelRatio, 1]}
          gl={{
            antialias: false,
          }}
          flat
          style={{
            position: 'relative',
            display: 'block',
            backgroundColor: 'transparent',
            borderRadius: '1.3888888889vw',
            height: '100%',
            width: '100%',
          }}
        >
          <FruitNinja />
        </Canvas>
      ) : null}
    </div>
  );
}

export default Index;
