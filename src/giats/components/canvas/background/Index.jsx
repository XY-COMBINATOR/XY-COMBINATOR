import Background from '@src/components/canvas/background/Background';
import { Canvas } from '@react-three/fiber';

function Index() {
  const devicePixelRatio = typeof window !== 'undefined' ? Math.min(1, window.devicePixelRatio) : 1;

  return (
    <Canvas
      flat
      linear
      dpr={[devicePixelRatio, 1]}
      gl={{
        antialias: false,
        stencil: false,
        depth: false,
        pixelRatio: 0.5,
      }}
    >
      <Background />
    </Canvas>
  );
}
export default Index;
