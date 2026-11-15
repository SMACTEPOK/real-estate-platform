import { describe, it, expect } from 'vitest';
import { plannerReducer, initialPlannerState } from './plannerReducer';

describe('plannerReducer (стан 3D-планера)', () => {
  it('додає новий об\'єкт і виділяє його', () => {
    const newItem = { id: 'test-1', type: 'sofa', position: [0, 0, 0], size: [1, 1, 1] };
    const state = plannerReducer(initialPlannerState, { type: 'ADD_ITEM', payload: newItem });
    
    expect(state.items).toContain(newItem);
    expect(state.selectedId).toBe('test-1');
  });

  it('видаляє виділений об\'єкт', () => {
    const state = plannerReducer(initialPlannerState, { type: 'REMOVE_SELECTED' });
    // Оскільки за замовчуванням виділений 'initial-sofa', після видалення його не має бути
    expect(state.items.find((i) => i.id === 'initial-sofa')).toBeUndefined();
    expect(state.selectedId).toBeNull();
  });

  it('оновлює позицію об\'єкта', () => {
    const updates = { position: [5, 0, 5] };
    const state = plannerReducer(initialPlannerState, {
      type: 'UPDATE_ITEM',
      payload: { id: 'initial-sofa', updates },
    });
    
    const updatedItem = state.items.find((i) => i.id === 'initial-sofa');
    expect(updatedItem.position).toEqual([5, 0, 5]);
  });
});
