import * as THREE from 'three';
import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { MATERIALS } from '../data/materials';

function Room({ width = 10, depth = 10, height = 3, floor = {}, walls = {}, onFloorClick }) {
  const floorConfig = MATERIALS[floor?.material] || MATERIALS.wood;
  const wallConfig = MATERIALS[walls?.material] || MATERIALS.paint;

  const fallbackUrl = 'https://threejs.org/examples/textures/uv_grid_opengl.jpg';
  const floorTex = useTexture(floorConfig.url || fallbackUrl);
  const wallTex = useTexture(wallConfig.url || fallbackUrl);

  // Налаштування текстур підлоги
  const floorTexture = useMemo(() => {
    if (!floorConfig.url) return null;
    const tex = floorTex.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / (floorConfig.scale || 2), depth / (floorConfig.scale || 2));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [floorTex, width, depth, floorConfig]);

  // Налаштування текстур стін (для кожної стіни окремо, щоб не розтягувались)
  const wallTextureX = useMemo(() => {
    if (!wallConfig.url) return null;
    const tex = wallTex.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / (wallConfig.scale || 2), height / (wallConfig.scale || 2));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [wallTex, width, height, wallConfig]);

  const wallTextureZ = useMemo(() => {
    if (!wallConfig.url) return null;
    const tex = wallTex.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(depth / (wallConfig.scale || 2), height / (wallConfig.scale || 2));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [wallTex, depth, height, wallConfig]);

  return (
    <group>
      {/* ПІДЛОГА */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow onClick={onFloorClick}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          map={floorTexture}
          color={floorTexture ? '#ffffff' : floorConfig.color}
          roughness={floorConfig.roughness}
          metalness={floorConfig.metalness}
        />
      </mesh>

      {/* СІТКА */}
      <gridHelper
        args={[Math.max(width, depth), Math.max(width, depth), '#ffffff', '#555555']}
        position={[0, 0.01, 0]}
      />

      {/* СТІНА 1 (Задня) */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={wallTextureX}
          color={wallTextureX ? '#ffffff' : wallConfig.color}
          roughness={wallConfig.roughness}
          metalness={wallConfig.metalness}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* СТІНА 2 (Ліва) */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-width / 2, height / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial
          map={wallTextureZ}
          color={wallTextureZ ? '#ffffff' : wallConfig.color}
          roughness={wallConfig.roughness}
          metalness={wallConfig.metalness}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Плінтус */}
      <mesh position={[0, 0.05, -depth / 2 + 0.02]}>
        <boxGeometry args={[width, 0.1, 0.04]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-width / 2 + 0.02, 0.05, 0]}>
        <boxGeometry args={[depth, 0.1, 0.04]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
    </group>
  );
}

export default Room;
