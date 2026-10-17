import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const FruitNinja = dynamic(() => import('@src/components/dom/prefooter/FruitNinja'), { ssr: false });

function Index() {
  const devicePixelRatio = typeof window !== 'undefined' ? Math.min(1, window.devicePixelRatio) : 1;

  return (
    <Canvas
      dpr={[devicePixelRatio, 1]}
      gl={{
        antialias: true,
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
  );
}

export default Index;
