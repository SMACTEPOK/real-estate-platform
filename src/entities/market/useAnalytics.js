import { useEffect, useState } from 'react';
import { apiRequest } from '@shared/api/client';

/**
 * Хук для завантаження даних аналітики за конкретним містом.
 * Реагує на зміну `city` — при перемиканні міста робить новий запит.
 *
 * @param {string} city
 * @returns {{ status: string, data: Object|null, error: string|null }}
 */
export function useAnalytics(city) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });

    apiRequest(`/analytics?city=${encodeURIComponent(city)}`)
      .then((data) => {
        if (cancelled) return;
        setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: 'error', data: null, error: error.message });
      });

    return () => { cancelled = true; };
  }, [city]);

  return state;
}
