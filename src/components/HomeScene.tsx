"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Environment, Float, Center } from "@react-three/drei";
import * as THREE from 'three';

function AnimatedGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial 
          color="#075C3A"
          emissive="#043D29"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>
      <mesh scale={0.8}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial 
          color="#C8A64B" 
          attach="material" 
          distort={0.4} 
          speed={1.5} 
          roughness={0} 
          metalness={1}
        />
      </mesh>
    </Float>
  );
}

export default function HomeScene() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#EFF7F2" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#075C3A" />
        <Center>
          <AnimatedGeometry />
        </Center>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
