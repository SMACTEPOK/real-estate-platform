import { useReducer, useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, TransformControls, Environment } from '@react-three/drei';
import { plannerReducer, initialPlannerState } from '@features/ar-planner/plannerReducer';
import Room from '@features/ar-planner/components/Room';
import FurnitureItem from '@features/ar-planner/components/FurnitureItem';
import { FURNITURE_CATALOG, AVAILABLE_COLORS } from '@features/ar-planner/data/furnitureCatalog';
import { MATERIALS } from '@features/ar-planner/data/materials';
import { checkCollision } from '@features/ar-planner/utils/collision';
import { useXrSupport } from '@features/ar-planner/hooks/useXrSupport';
import './ARPlannerPage.css';

const STORAGE_KEY = 'estate-ar-planner-project-v4';

function PlannerItem({ item, isSelected, onSelect, setOrbitEnabled, onObjectChange, onMouseUp }) {
  const groupRef = useRef(null);
  const [object, setObject] = useState(null);

  const attach = useCallback((node) => {
    groupRef.current = node;
    setObject(node);
  }, []);

  return (
    <>
      <group ref={attach} position={item.position} rotation={item.rotation}>
        <FurnitureItem item={item} isSelected={isSelected} onSelect={onSelect} />
      </group>
      
      {isSelected && object && (
        <>
          <TransformControls
            object={object}
            mode="translate"
            showX={true}
            showY={false}
            showZ={true}
            translationSnap={0.1}
            onMouseDown={() => setOrbitEnabled(false)}
            onMouseUp={onMouseUp}
            onObjectChange={onObjectChange}
          />
          <TransformControls
            object={object}
            mode="rotate"
            showX={false}
            showY={true}
            showZ={false}
            rotationSnap={Math.PI / 12}
            onMouseDown={() => setOrbitEnabled(false)}
            onMouseUp={onMouseUp}
            onObjectChange={onObjectChange}
          />
        </>
      )}
    </>
  );
}

function ARPlannerPage() {
  const [state, dispatch] = useReducer(plannerReducer, initialPlannerState);
  const [selectedType, setSelectedType] = useState('sofa');
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const xrStatus = useXrSupport();

  const items = useMemo(() => (Array.isArray(state.items) ? state.items : []), [state.items]);
  const selectedItem = useMemo(() => items.find((item) => item.id === state.selectedId), [items, state.selectedId]);
  const lastValidTransform = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: 'LOAD_PROJECT', payload: parsed });
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (!selectedItem) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'REMOVE_SELECTED' });
        return;
      }

      const step = 0.1;
      const rotStep = Math.PI / 12;
      const newPos = [...selectedItem.position];
      const newRot = [...selectedItem.rotation];
      let updated = false;

      if (e.code === 'KeyW' || e.key === 'ArrowUp') { newPos[2] -= step; updated = true; }
      else if (e.code === 'KeyS' || e.key === 'ArrowDown') { newPos[2] += step; updated = true; }
      else if (e.code === 'KeyA' || e.key === 'ArrowLeft') { newPos[0] -= step; updated = true; }
      else if (e.code === 'KeyD' || e.key === 'ArrowRight') { newPos[0] += step; updated = true; }
      else if (e.code === 'KeyQ') { newRot[1] -= rotStep; updated = true; }
      else if (e.code === 'KeyE') { newRot[1] += rotStep; updated = true; }

      if (updated) {
        e.preventDefault();
        const size = selectedItem.size;
        const isRotated = Math.abs(newRot[1] % Math.PI) > 0.1;
        const w = isRotated ? size[2] : size[0];
        const d = isRotated ? size[0] : size[2];
        
        const limitX = (state.roomWidth / 2) - (w / 2) - 0.05;
        const limitZ = (state.roomDepth / 2) - (d / 2) - 0.05;
        
        newPos[0] = Math.max(-limitX, Math.min(limitX, newPos[0]));
        newPos[2] = Math.max(-limitZ, Math.min(limitZ, newPos[2]));

        const updatedItem = { ...selectedItem, position: newPos, rotation: newRot };
        const collision = items.some((item) => item.id !== selectedItem.id && checkCollision(updatedItem, item));
        
        if (!collision) {
          dispatch({ type: 'UPDATE_ITEM', payload: { id: selectedItem.id, updates: { position: newPos, rotation: newRot } } });
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, items, state.roomWidth, state.roomDepth]);

  function handleGizmoChange(e) {
    if (!selectedItem || !e || !e.target || !e.target.object) return;
    const obj = e.target.object;
    obj.position.y = 0;

    const size = selectedItem.size;
    const isRotated = Math.abs(obj.rotation.y % Math.PI) > 0.1;
    const w = isRotated ? size[2] : size[0];
    const d = isRotated ? size[0] : size[2];
    
    const limitX = (state.roomWidth / 2) - (w / 2) - 0.05;
    const limitZ = (state.roomDepth / 2) - (d / 2) - 0.05;
    
    obj.position.x = Math.max(-limitX, Math.min(limitX, obj.position.x));
    obj.position.z = Math.max(-limitZ, Math.min(limitZ, obj.position.z));
    
    const newPos = [obj.position.x, 0, obj.position.z];
    const newRot = [0, obj.rotation.y, 0];
    const updated = { ...selectedItem, position: newPos, rotation: newRot };
    
    const collision = items.some((item) => item.id !== selectedItem.id && checkCollision(updated, item));
    
    if (collision) {
      if (lastValidTransform.current) {
        obj.position.set(...lastValidTransform.current.position);
        obj.rotation.set(...lastValidTransform.current.rotation);
      }
    } else {
      lastValidTransform.current = { position: newPos, rotation: newRot };
    }
  }

  function handleGizmoMouseUp(e) {
    setOrbitEnabled(true);
    if (!selectedItem || !e || !e.target || !e.target.object) return;
    const obj = e.target.object;
    const newPos = [obj.position.x, 0, obj.position.z];
    const newRot = [0, obj.rotation.y, 0];
    dispatch({ type: 'UPDATE_ITEM', payload: { id: selectedItem.id, updates: { position: newPos, rotation: newRot } } });
  }

  useEffect(() => {
    if (selectedItem) {
      lastValidTransform.current = {
        position: [...selectedItem.position],
        rotation: [...selectedItem.rotation],
      };
    }
  }, [selectedItem]);

  function handleFloorClick(e) {
    if (e.delta > 2) return;
    e.stopPropagation();

    const step = state.gridStep || 1;
    const x = Math.round(e.point.x / step) * step;
    const z = Math.round(e.point.z / step) * step;

    const config = FURNITURE_CATALOG[selectedType];
    const item = {
      id: `item-${Date.now()}-${state.nextId || 1}`,
      type: selectedType,
      position: [x, 0, z],
      rotation: [0, 0, 0],
      color: AVAILABLE_COLORS[0],
      material: 'concreteMat',
      size: [...config.size],
    };

    if (items.some((existing) => checkCollision(item, existing))) return;
    dispatch({ type: 'ADD_ITEM', payload: item });
  }

  function updateSelected(updates) {
    if (!selectedItem) return;
    dispatch({ type: 'UPDATE_ITEM', payload: { id: selectedItem.id, updates } });
  }

  function setSurface(surface, materialKey) {
    const config = MATERIALS[materialKey];
    dispatch({ type: 'SET_SURFACE', payload: { surface, material: materialKey, color: config?.color || '#ffffff' } });
  }

  return (
    <div className="ar-planner-page">
      <header className="ar-planner-page__head">
        <div>
          <h1 className="ar-planner-page__title">3D ПЛАНЕР<span className="ar-planner-page__title-mark">/ ІНТЕР'ЄР</span></h1>
          <p className="ar-planner-page__subtitle" style={{marginTop: '10px', fontSize: '12px', color: 'var(--color-muted)'}}>
            Клік — додати · WASD — рух · Q/E — оберт · Delete — видалити
          </p>
        </div>
        <div className="ar-planner-page__xr">
          {xrStatus === 'supported' ? <span className="xr-badge xr-badge--supported">AR доступний</span> : <span className="xr-badge xr-badge--unsupported">AR недоступний</span>}
        </div>
      </header>

      <div className="ar-planner-page__layout">
        <aside className="ar-planner-page__sidebar">
          <section className="planner-section">
            <h3 className="planner-title">Розміри кімнати</h3>
            <label className="planner-title">Ширина (м)</label>
            <input className="planner-select" type="number" min="2" max="30" step="0.5" value={state.roomWidth || 10} onChange={(e) => dispatch({ type: 'SET_ROOM_DIMENSIONS', payload: { width: e.target.value, depth: state.roomDepth || 10 } })} />
            <label className="planner-title">Довжина (м)</label>
            <input className="planner-select" type="number" min="2" max="30" step="0.5" value={state.roomDepth || 10} onChange={(e) => dispatch({ type: 'SET_ROOM_DIMENSIONS', payload: { width: state.roomWidth || 10, depth: e.target.value } })} />
          </section>

          <section className="planner-section">
            <h3 className="planner-title">Оздоблення</h3>
            <label className="planner-title">Підлога</label>
            <select className="planner-select" value={state.floor?.material || 'wood'} onChange={(e) => setSurface('floor', e.target.value)}>
              {['wood', 'parquet', 'tile', 'marble', 'concrete'].map((key) => (
                <option key={key} value={key}>{MATERIALS[key]?.name || key}</option>
              ))}
            </select>
            <label className="planner-title">Стіни</label>
            <select className="planner-select" value={state.walls?.material || 'paint'} onChange={(e) => setSurface('walls', e.target.value)}>
              {['paint', 'wallpaper', 'brick', 'concrete'].map((key) => (
                <option key={key} value={key}>{MATERIALS[key]?.name || key}</option>
              ))}
            </select>
          </section>

          <section className="planner-section">
            <h3 className="planner-title">Додати об'єкт</h3>
            <div className="planner-catalog">
              {Object.entries(FURNITURE_CATALOG).map(([key, config]) => (
                <button key={key} type="button" className={`planner-btn ${selectedType === key ? 'is-active' : ''}`} onClick={() => setSelectedType(key)}>
                  {config.name}
                </button>
              ))}
            </div>
          </section>

          {selectedItem && (
            <section className="planner-section planner-section--selected">
              <h3 className="planner-title">Матеріал</h3>
              <select 
                className="planner-select" 
                value={selectedItem.material || 'concreteMat'} 
                onChange={(e) => updateSelected({ material: e.target.value })}
              >
                <option value="concreteMat">Бетон</option>
                <option value="woodMat">Темне дерево</option>
                <option value="metalMat">Метал</option>
                <option value="leatherMat">Шкіра</option>
              </select>

              <h3 className="planner-title" style={{marginTop: '16px'}}>Колір</h3>
              <div className="planner-colors">
                {AVAILABLE_COLORS.map((color) => (
                  <button key={color} type="button" className={`planner-color ${selectedItem.color === color ? 'is-active' : ''}`} style={{ backgroundColor: color }} onClick={() => updateSelected({ color })} />
                ))}
                <label className="planner-color-custom" title="Обрати будь-який колір">
                  <input type="color" value={selectedItem.color || '#ffffff'} onChange={(e) => updateSelected({ color: e.target.value })} />
                  <span className="planner-color-custom__plus">+</span>
                </label>
              </div>
            </section>
          )}

          <section className="planner-section planner-section--actions">
            <button type="button" className="planner-btn planner-btn--danger" disabled={!selectedItem} onClick={() => dispatch({ type: 'REMOVE_SELECTED' })}>Видалити</button>
            <button type="button" className="planner-btn" onClick={() => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); }}>Скинути все</button>
          </section>
        </aside>

        <div className="ar-planner-page__canvas-wrap">
          <Suspense fallback={<div className="planner-loading" role="status">������������ 3D-�����...</div>}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 8, 10], fov: 50 }} onPointerMissed={() => dispatch({ type: 'SELECT_ITEM', payload: null })}>
              <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={50} />
              <OrbitControls makeDefault enabled={orbitEnabled} enablePan enableDamping maxPolarAngle={Math.PI / 2.05} minDistance={3} maxDistance={35} />
              
              <color attach="background" args={['#181818']} />
              <Environment preset="apartment" background={false} />
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />

              <Room width={state.roomWidth || 10} depth={state.roomDepth || 10} height={state.roomHeight || 3} floor={state.floor || {}} walls={state.walls || {}} onFloorClick={handleFloorClick} />

              {items.map((item) => (
                <PlannerItem 
                  key={item.id} 
                  item={item} 
                  isSelected={state.selectedId === item.id} 
                  onSelect={(id) => dispatch({ type: 'SELECT_ITEM', payload: id })} 
                  setOrbitEnabled={setOrbitEnabled} 
                  onObjectChange={handleGizmoChange}
                  onMouseUp={handleGizmoMouseUp}
                />
              ))}

              <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={30} blur={2.5} far={5} color="#000000" />
            </Canvas>
          </Suspense>
          <div className="planner-canvas-hint">Тягни Gizmo · WASD (рух) · Q/E (оберт)</div>
        </div>
      </div>
    </div>
  );
}

export default ARPlannerPage;

