'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.1
      ref.current.rotation.y = clock.elapsedTime * 0.03
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

function FloatingBlock({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * speed * 0.5
      ref.current.rotation.y = clock.elapsedTime * speed
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed * 0.5) * 0.3
    }
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#4338ca"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

function ChainLinks() {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.1
    }
  })

  const links = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [Math.cos((i / 8) * Math.PI * 2) * 4, Math.sin((i / 8) * Math.PI * 2) * 0.5, Math.sin((i / 8) * Math.PI * 2) * 4] as [number, number, number],
    }))
  }, [])

  return (
    <group ref={ref}>
      {links.map((link, i) => (
        <mesh key={i} position={link.position}>
          <torusGeometry args={[0.4, 0.08, 8, 20]} />
          <meshStandardMaterial
            color="#10b981"
            transparent
            opacity={0.4}
            emissive="#10b981"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function BlockchainScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />

        <ParticleField />
        <ChainLinks />

        <FloatingBlock position={[-5, 2, -3]} scale={0.8} speed={0.3} />
        <FloatingBlock position={[5, -2, -4]} scale={0.6} speed={0.4} />
        <FloatingBlock position={[3, 3, -5]} scale={1.0} speed={0.2} />
        <FloatingBlock position={[-4, -3, -2]} scale={0.5} speed={0.5} />
        <FloatingBlock position={[0, 4, -6]} scale={0.7} speed={0.35} />
      </Canvas>
    </div>
  )
}
