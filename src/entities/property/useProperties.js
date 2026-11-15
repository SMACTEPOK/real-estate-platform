import { useEffect, useState } from 'react';
import { apiRequest } from '@shared/api/client';

/**
 * Хук для завантаження каталогу нерухомості через GET /api/properties.
 *
 * Повертає об’єкт { status, items, error }, де status ∈
 * {'loading' | 'success' | 'error'}. Фільтрація й пошук виконуються
 * на клієнті через shared/lib/filterProperties — на обсязі каталогу
 * до сотень позицій це ефективніше за round-trip до API.
 *
 * @returns {{ status: string, items: Array, error: string|null }}
 */
export function useProperties() {
  const [state, setState] = useState({
    status: 'loading',
    items: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    apiRequest('/properties')
      .then((data) => {
        if (cancelled) return;
        setState({
          status: 'success',
          items: data.items || [],
          error: null,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({
          status: 'error',
          items: [],
          error: error.message,
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
