import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Text3D, Html } from '@react-three/drei'
import * as THREE from 'three'

function Asteroids({ count = 200, radius = 50 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const r = radius * (0.6 + Math.random() * 0.6)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ))
    }
    return arr
  }, [count, radius])

  useFrame((state) => {
    if (!mesh.current) return
    for (let i = 0; i < count; i++) {
      const p = positions[i]
      dummy.position.copy(p)
      dummy.rotation.x = (state.clock.elapsedTime * 0.1) + i * 0.01
      dummy.rotation.y = (state.clock.elapsedTime * 0.13) + i * 0.008
      const s = 0.4 + Math.abs(Math.sin(state.clock.elapsedTime + i)) * 0.6
      dummy.scale.setScalar(0.3 * s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3b3b3b', flatShading: true, metalness: 0.2, roughness: 0.9 }), [])

  return (
    <instancedMesh ref={mesh} args={[geometry, material, count]} />
  )
}

function Crown() {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh castShadow position={[0, 0, 0]}>
        <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} emissive="#6b5000" emissiveIntensity={0.1} />
      </mesh>
    </Float>
  )
}

function GiftBox() {
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
      <group>
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial color="#c1121f" metalness={0.1} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.7, 0.2, 1.7]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <torusKnotGeometry args={[0.3, 0.08, 64, 8, 2, 3]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

function Number15({ glow = 2 }) {
  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.6}>
      {/* Simple 15 using two boxes to avoid external font dependency */}
      <group>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[0.5, 3.0, 0.6]} />
          <meshStandardMaterial color="#ffffff" emissive="#86c5ff" emissiveIntensity={glow} metalness={0.4} roughness={0.2} />
        </mesh>
        <group position={[1.0, 0, 0]}>
          <mesh position={[0, 1.0, 0]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[1.6, 0.4, 0.6]} />
            <meshStandardMaterial color="#ffffff" emissive="#86c5ff" emissiveIntensity={glow} metalness={0.4} roughness={0.2} />
          </mesh>
          <mesh position={[0.6, -0.6, 0]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[1.2, 0.4, 0.6]} />
            <meshStandardMaterial color="#ffffff" emissive="#86c5ff" emissiveIntensity={glow} metalness={0.4} roughness={0.2} />
          </mesh>
          <mesh position={[0.1, -1.0, 0]}>
            <boxGeometry args={[1.0, 0.4, 0.6]} />
            <meshStandardMaterial color="#ffffff" emissive="#86c5ff" emissiveIntensity={glow} metalness={0.4} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

function Nebula({ intensity = 1 }) {
  return (
    <group>
      <mesh scale={200}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial side={THREE.BackSide} color="#0b1026" emissive="#2a5fff" emissiveIntensity={intensity} metalness={0} roughness={1} />
      </mesh>
      <mesh scale={[120, 120, 120]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#1d2b4f" transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

function SceneContent({ section }) {
  useFrame((state) => {
    const t = section
    const z = THREE.MathUtils.lerp(60, -10, t)
    const y = THREE.MathUtils.lerp(10, 0, t)
    const x = THREE.MathUtils.lerp(0, 2, t)
    state.camera.position.set(x, y, z)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group>
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={1} />
      <group scale={THREE.MathUtils.lerp(1, 0.2, Math.max(0, section - 0.6) * 2)}>
        <Asteroids count={280} radius={50} />
      </group>

      <group position={[THREE.MathUtils.lerp(-8, 0, Math.max(0, (section - 0.2) * 5)), 0, 0]} visible={section >= 0.2}>
        <Crown />
      </group>

      <group position={[THREE.MathUtils.lerp(10, 0, Math.max(0, (section - 0.45) * 5)), -1, -2]} visible={section >= 0.45}>
        <GiftBox />
      </group>

      <group position={[0, 1, THREE.MathUtils.lerp(-40, -6, Math.max(0, (section - 0.7) * 3))]} visible={section >= 0.7}>
        <Number15 glow={THREE.MathUtils.lerp(0.5, 2.5, Math.max(0, (section - 0.7) * 3))} />
      </group>

      <group visible={section >= 0.65}>
        <Nebula intensity={THREE.MathUtils.lerp(0.2, 1.2, Math.max(0, (section - 0.65) * 3))} />
      </group>

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.6} />
    </group>
  )
}

export default function SpaceScene({ section }) {
  return (
    <Canvas shadows camera={{ position: [0, 10, 60], fov: 50 }} style={{ position: 'fixed', inset: 0 }}>
      <color attach="background" args={["#020411"]} />
      <fog attach="fog" args={["#020411", 40, 220]} />
      <SceneContent section={section} />
      <Html position={[0, -10, 0]} center style={{ pointerEvents: 'none' }}>
        <div aria-hidden className="sr-only">A space scene with asteroids, crown, gift, and number 15.</div>
      </Html>
    </Canvas>
  )
}
