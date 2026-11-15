import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './AuthContext';
import * as client from '@shared/api/client';

vi.mock('@shared/api/client', () => ({
  apiRequest: vi.fn(),
  getToken: vi.fn(),
  setToken: vi.fn(),
  getStoredUser: vi.fn(),
  setStoredUser: vi.fn(),
  clearSession: vi.fn(),
}));

describe('AuthProvider', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  beforeEach(() => {
    vi.clearAllMocks();
    client.getToken.mockReturnValue(null); // За замовчуванням неавторизований
  });

  it('успішно логінить користувача', async () => {
    client.apiRequest.mockResolvedValueOnce({ token: 'test-token', user: { id: '1', displayName: 'Test' } });
    
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@test.com', 'password');
    });

    expect(result.current.status).toBe('authenticated');
    expect(result.current.user.displayName).toBe('Test');
    expect(client.setToken).toHaveBeenCalledWith('test-token');
  });
});
