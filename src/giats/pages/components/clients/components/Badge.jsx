/* eslint-disable */
import * as THREE from 'three';

import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { PerspectiveCamera, View, useGLTF, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

import { useIntersection } from 'react-use';
import useScroll from '@src/hooks/useScroll';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Badge({ name }) {
  const el = useRef();

  const intersection = useIntersection(el, {
    threshold: 0.7,
  });

  return (
    <View
      ref={(node) => {
        el.current = node;
      }}
      style={{ position: 'relative', display: 'block', backgroundColor: 'transparent', borderRadius: '1.3888888889vw', height: '100%', width: '100%' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={25} />
      <ambientLight intensity={Math.PI} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band name={name} intersected={intersection?.isIntersecting} />
      </Physics>
      <ambientLight intensity={1.3} />


      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />


      <directionalLight position={[-5, 5, 5]} intensity={1} />


      <directionalLight position={[0, 5, -5]} intensity={2} />
    </View>
  );
}

function Band({ maxSpeed = 50, minSpeed = 10, name, intersected }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  const { nodes, materials } = useGLTF(`/model/Tag.glb`);

  const texture = useTexture(`/model/Band${name}.png`);
  const tag = useTexture(`/model/Tag${name}.png`);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));

  const scrollDirection = useRef(0);
  const isScrolling = useRef(false);
  const speed = useRef(0);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useScroll(({ direction, isScrolling: useScrolling, velocity }) => {
    scrollDirection.current = direction;
    isScrolling.current = useScrolling;
    speed.current = velocity;
  });

  useFrame((state, delta) => {
    if (isScrolling.current && intersected) {
      const moveDistance = Math.abs(speed.current) * 0.005;
      const directionVector = scrollDirection.current === 1 ? 1 : -1;
      card.current.applyImpulse({ x: directionVector * moveDistance, y: 0, z: 0 }, true);
    }
    if (fixed.current) {
       [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  tag.flipY = false;
  tag.repeat.set(1, 1);
  tag.wrapS = THREE.RepeatWrapping;
  tag.wrapT = THREE.RepeatWrapping;
  tag.minFilter = THREE.LinearFilter;
  tag.magFilter = THREE.LinearFilter;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type="dynamic">
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group scale={2.25} position={[0, -1.2, -0.05]}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial map={tag} clearcoat={1} clearcoatRoughness={0.15} roughness={0.5} metalness={0.4} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" resolution={[1, 1]}  depthTest={false} useMap map={texture} repeat={[-3, 1]} lineWidth={1} />
      </mesh>
    </>
  );
}
