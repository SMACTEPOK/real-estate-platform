import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProperty } from './useProperty';
import { apiRequest } from '@shared/api/client';

vi.mock('@shared/api/client', () => ({
  apiRequest: vi.fn(),
}));

describe('useProperty hook', () => {
  it('завантажує один об\'єкт за ID', async () => {
    apiRequest.mockResolvedValueOnce({ id: 'p-001', title: 'Test Property' });
    
    const { result } = renderHook(() => useProperty('p-001'));
    
    expect(result.current.status).toBe('loading');
    
    await waitFor(() => {
      expect(result.current.status).toBe('success');
      expect(result.current.item.title).toBe('Test Property');
    });
  });
});
