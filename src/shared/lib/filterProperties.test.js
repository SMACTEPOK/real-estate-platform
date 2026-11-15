import { describe, it, expect } from 'vitest';
import { applyFilters } from './filterProperties';

const items = [
  {
    id: 1,
    title: 'Квартира в центрі',
    city: 'Київ',
    district: 'Печерський',
    address: 'Хрещатик, 1',
    deal: 'sale',
  },
  {
    id: 2,
    title: 'Будинок у передмісті',
    city: 'Львів',
    district: 'Личаківський',
    address: 'Зелена, 155',
    deal: 'rent',
  },
];

describe('applyFilters', () => {
  it('повертає всі елементи, якщо фільтри порожні', () => {
    expect(applyFilters(items, {})).toHaveLength(2);
  });

  it('фільтрує за типом угоди', () => {
    const result = applyFilters(items, { deal: 'rent' });
    expect(result).toEqual([items[1]]);
  });

  it('шукає без урахування регістру', () => {
    const result = applyFilters(items, { search: 'КИЇВ' });
    expect(result).toEqual([items[0]]);
  });

  it('не мутує вхідний масив', () => {
    const snapshot = [...items];
    applyFilters(items, { deal: 'sale' });
    expect(items).toEqual(snapshot);
  });

  it('повертає порожній масив при некоректному вході', () => {
    expect(applyFilters(null, {})).toEqual([]);
    expect(applyFilters(undefined, {})).toEqual([]);
    expect(applyFilters('not-an-array', {})).toEqual([]);
  });

  it('комбінує deal і search', () => {
    const result = applyFilters(items, { deal: 'sale', search: 'львів' });
    expect(result).toEqual([]);
  });
});
