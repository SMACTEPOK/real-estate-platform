import { useEffect, useState } from 'react';

/**
 * Перевіряє, чи підтримує поточний браузер WebXR (AR/VR).
 * Повертає статус підтримки: 'checking' | 'supported' | 'unsupported'.
 */
export function useXrSupport() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    if (!navigator.xr) {
      setStatus('unsupported');
      return;
    }

    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      setStatus(supported ? 'supported' : 'unsupported');
    }).catch(() => {
      setStatus('unsupported');
    });
  }, []);

  return status;
}
