import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProperties } from './useProperties';
import { apiRequest } from '@shared/api/client';

vi.mock('@shared/api/client', () => ({
  apiRequest: vi.fn(),
}));

describe('useProperties hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('успішно завантажує дані', async () => {
    apiRequest.mockResolvedValueOnce({ items: [{ id: '1', title: 'Test' }], total: 1 });
    
    const { result } = renderHook(() => useProperties());
    
    expect(result.current.status).toBe('loading');
    
    await waitFor(() => {
      expect(result.current.status).toBe('success');
      expect(result.current.items).toHaveLength(1);
    });
  });

  it('обробляє помилку API', async () => {
    apiRequest.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useProperties());
    
    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Network error');
    });
  });
});
