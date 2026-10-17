import { Environment, PerspectiveCamera, View } from '@react-three/drei';

import FloatRigidBody from '@src/pages/components/home/components/floatingMeshes/FloatRigidBody';
import { Physics } from '@react-three/rapier';
import useIsMobile from '@src/hooks/useIsMobile';

export default function Index() {
  const isMobile = useIsMobile();

  return (
    <View style={{ position: 'relative', display: 'block', backgroundColor: 'transparent', borderRadius: '1.3888888889vw', height: '100%', width: '100%' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={20} />
      <Physics interpolate timeStep={1 / 60} gravity={[0, 0, 0]}>
        <FloatRigidBody transparentCount={isMobile ? 3 : 5} totalCount={isMobile ? 12 : 18} />
      </Physics>
      <Environment files="/other/studio_small_09_1k.hdr" blur={1} />
    </View>
  );
}
