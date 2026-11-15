import * as THREE from 'three';
import { useMemo, useState } from 'react';
import { MATERIALS } from '../data/materials';

function FurnitureItem({ item, isSelected, onSelect }) {
  const { color, type, material } = item;
  const size = Array.isArray(item.size) && item.size.length === 3 ? item.size : [1, 1, 1];
  const [hovered, setHovered] = useState(false);

  // Безпечне завантаження текстури
  const materialConfig = MATERIALS[material] || MATERIALS.concreteMat;
  const textureUrl = materialConfig.url;

  const materialNode = useMemo(() => {
    if (textureUrl) {
      return <meshStandardMaterial 
        map={new THREE.TextureLoader().load(textureUrl)} 
        color={color || '#ffffff'} 
        roughness={materialConfig.roughness} 
        metalness={materialConfig.metalness} 
      />;
    }
    return <meshStandardMaterial color={color || materialConfig.color || '#ffffff'} roughness={materialConfig.roughness} metalness={materialConfig.metalness} />;
  }, [textureUrl, color, materialConfig]);

  const outlineColor = isSelected ? '#ffffff' : hovered ? '#a5a5a5' : '#111111';

  return (
    <group
      onPointerDown={(e) => { e.stopPropagation(); onSelect(item.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* БРУТАЛЬНИЙ ДИВАН (Монолітні блоки) */}
      {type === 'sofa' && (
        <group position={[0, size[1] / 2, 0]}>
          {/* Основа */}
          <mesh castShadow receiveShadow><boxGeometry args={[size[0], size[1] * 0.4, size[2]]} />{materialNode}</mesh>
          {/* Спинка */}
          <mesh position={[0, size[1] * 0.3, -size[2] / 2 + 0.15]}><boxGeometry args={[size[0], size[1] * 0.6, 0.3]} />{materialNode}</mesh>
          {/* Підлокітники (масивні) */}
          <mesh position={[-size[0] / 2 + 0.15, size[1] * 0.1, 0]}><boxGeometry args={[0.3, size[1] * 0.5, size[2]]} />{materialNode}</mesh>
          <mesh position={[size[0] / 2 - 0.15, size[1] * 0.1, 0]}><boxGeometry args={[0.3, size[1] * 0.5, size[2]]} />{materialNode}</mesh>
        </group>
      )}

      {/* БРУТАЛЬНИЙ СТІЛ (Товста плита на масивних опорах) */}
      {type === 'table' && (
        <group position={[0, size[1] / 2, 0]}>
          <mesh position={[0, size[1] * 0.4, 0]}><boxGeometry args={[size[0], 0.15, size[2]]} />{materialNode}</mesh>
          <mesh position={[-size[0] / 2 + 0.1, 0, 0]}><boxGeometry args={[0.2, size[1] * 0.8, size[2] - 0.1]} />{materialNode}</mesh>
          <mesh position={[size[0] / 2 - 0.1, 0, 0]}><boxGeometry args={[0.2, size[1] * 0.8, size[2] - 0.1]} />{materialNode}</mesh>
        </group>
      )}

      {/* БРУТАЛЬНЕ ЛІЖКО (Моноліт) */}
      {type === 'bed' && (
        <group position={[0, size[1] / 2, 0]}>
          <mesh><boxGeometry args={[size[0], size[1] * 0.5, size[2]]} />{materialNode}</mesh>
          <mesh position={[0, size[1] * 0.3, -size[2] / 2 + 0.1]}><boxGeometry args={[size[0], size[1] * 0.4, 0.2]} />{materialNode}</mesh>
        </group>
      )}

      {/* БРУТАЛЬНИЙ СТІЛЕЦЬ (Куб) */}
      {type === 'chair' && (
        <group position={[0, size[1] / 2, 0]}>
          <mesh position={[0, 0, 0]}><boxGeometry args={[size[0], 0.15, size[2]]} />{materialNode}</mesh>
          <mesh position={[0, size[1] * 0.4, -size[2] / 2 + 0.075]}><boxGeometry args={[size[0], size[1] * 0.8, 0.15]} />{materialNode}</mesh>
        </group>
      )}

      {/* БРУТАЛЬНА ШАФА (Сейф) */}
      {type === 'wardrobe' && (
        <group position={[0, size[1] / 2, 0]}>
          <mesh castShadow receiveShadow><boxGeometry args={[size[0], size[1], size[2]]} />{materialNode}</mesh>
          <mesh position={[-size[0]/4, 0, size[2]/2 + 0.01]}><boxGeometry args={[size[0]/2 - 0.02, size[1] - 0.02, 0.02]} /><meshStandardMaterial color="#111111" roughness={0.8} /></mesh>
          <mesh position={[size[0]/4, 0, size[2]/2 + 0.01]}><boxGeometry args={[size[0]/2 - 0.02, size[1] - 0.02, 0.02]} /><meshStandardMaterial color="#111111" roughness={0.8} /></mesh>
        </group>
      )}

      {/* БРУТАЛЬНИЙ ТОРШЕР (Промисловий) */}
      {type === 'lamp' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow><boxGeometry args={[0.3, 0.1, 0.3]} />{materialNode}</mesh>
          <mesh position={[0, size[1]/2, 0]} castShadow><boxGeometry args={[0.08, size[1], 0.08]} />{materialNode}</mesh>
          <mesh position={[0, size[1] - 0.15, 0]} castShadow><boxGeometry args={[0.4, 0.3, 0.4]} /><meshStandardMaterial color="#ffebd6" emissive="#ffebd6" emissiveIntensity={0.8} /></mesh>
        </group>
      )}

      {/* РОСЛИНА (Геометрична) */}
      {type === 'plant' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[size[0] * 0.6, 0.4, size[0] * 0.6]} />{materialNode}</mesh>
          <mesh position={[0, 0.8, 0]} castShadow><icosahedronGeometry args={[size[0] * 0.6, 0]} /><meshStandardMaterial color="#2a5c2a" roughness={0.8} flatShading /></mesh>
          <mesh position={[0.15, 1.1, 0.1]} castShadow><icosahedronGeometry args={[size[0] * 0.4, 0]} /><meshStandardMaterial color="#3a7a3a" roughness={0.8} flatShading /></mesh>
        </group>
      )}

      <lineSegments position={[0, size[1] / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color={outlineColor} />
      </lineSegments>
    </group>
  );
}

export default FurnitureItem;
