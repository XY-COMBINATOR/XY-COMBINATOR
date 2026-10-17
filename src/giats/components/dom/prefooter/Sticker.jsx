import { useEffect, useRef, useState } from 'react';

import { Plane } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import useIsMobile from '@src/hooks/useIsMobile';
import { useThree } from '@react-three/fiber';

const TORQUE_IMPULSE_MIN = 1;
const TORQUE_IMPULSE_MAX = 3;
const IMPULSE_TIMEOUT = 100;

const getRandomIntInclusive = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function getMaterialProps(isSliced, image, imageSliced) {
  return {
    transparent: true,
    polygonOffset: true,
    polygonOffsetFactor: -10,
    map: isSliced ? imageSliced : image,
    mapFlipY: false,
    mapAnisotropy: 16,
    iridescence: 2,
    iridescenceIOR: 1,
    iridescenceThicknessRange: [0, 1400],
    roughness: 1,
    clearcoat: 0.5,
    metalness: 0.75,
    toneMapped: false,
  };
}

function Sticker({ positionX, image, imageSliced }) {
  const bodyRef = useRef();
  const fruitRemoved = useRef(false);
  const isMobile = useIsMobile();
  const [fruitSliced, setFruitSliced] = useState(false);
  const { viewport } = useThree();

  useEffect(() => {
    const rigidBody = bodyRef.current;
    if (!rigidBody) return undefined;

    const torqueImpulse = getRandomIntInclusive(TORQUE_IMPULSE_MIN, TORQUE_IMPULSE_MAX);
    const impulseY = isMobile ? getRandomIntInclusive(viewport.height * 2, viewport.height * 2.8) : getRandomIntInclusive(viewport.height * 2, viewport.height * 3 + 2);

    const impulseTimeout = setTimeout(() => {
      rigidBody.applyImpulse({ x: 0, y: impulseY, z: 0 }, true);
      rigidBody.addTorque({ x: 0, y: 0, z: torqueImpulse }, true);
    }, IMPULSE_TIMEOUT);

    return () => {
      clearTimeout(impulseTimeout);
    };
  }, [isMobile, viewport.height]);

  const handleFruitSliced = () => {
    const rigidBody = bodyRef.current;
    if (rigidBody) {
      fruitRemoved.current = true;
      rigidBody.sleep();
      rigidBody.wakeUp();
    }
    setFruitSliced(true);
  };

  const mobileConfig = isMobile ? { position: [positionX, -5, 0], scale: 0.8 } : { position: [positionX, -7, 0], scale: 1 };

  return (
    <RigidBody ref={bodyRef} collisionGroups={0x00000001} position={mobileConfig.position} colliders="ball">
      <Plane scale={mobileConfig.scale} castShadow receiveShadow onPointerEnter={() => !fruitSliced && handleFruitSliced()}>
        {(() => {
          const materialProps = getMaterialProps(fruitSliced, image, imageSliced);
          return (
            <meshPhysicalMaterial
              transparent={materialProps.transparent}
              polygonOffset={materialProps.polygonOffset}
              polygonOffsetFactor={materialProps.polygonOffsetFactor}
              map={materialProps.map}
              mapFlipY={materialProps.mapFlipY}
              mapAnisotropy={materialProps.mapAnisotropy}
              iridescence={materialProps.iridescence}
              iridescenceIOR={materialProps.iridescenceIOR}
              iridescenceThicknessRange={materialProps.iridescenceThicknessRange}
              roughness={materialProps.roughness}
              clearcoat={materialProps.clearcoat}
              metalness={materialProps.metalness}
              toneMapped={materialProps.toneMapped}
            />
          );
        })()}
      </Plane>
    </RigidBody>
  );
}

export default Sticker;
