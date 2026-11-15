import { useEffect, useState } from 'react';
import { apiRequest } from '@shared/api/client';

export function useProperty(id) {
  const [state, setState] = useState({
    status: 'loading',
    item: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, status: 'loading' }));

    apiRequest(`/properties/${id}`)
      .then((data) => {
        if (cancelled) return;
        setState({ status: 'success', item: data, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: 'error', item: null, error: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
