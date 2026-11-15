import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FavoritesProvider } from '@app/providers/FavoritesProvider';
import { useFavorites } from './FavoritesContext';

describe('FavoritesProvider', () => {
  const wrapper = ({ children }) => <FavoritesProvider>{children}</FavoritesProvider>;

  it('додає та видаляє об\'єкт з обраного', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite('p-001')).toBe(false);

    act(() => { result.current.toggleFavorite('p-001'); });
    expect(result.current.favorites).toEqual(['p-001']);
    expect(result.current.isFavorite('p-001')).toBe(true);

    act(() => { result.current.toggleFavorite('p-001'); });
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite('p-001')).toBe(false);
  });
});
