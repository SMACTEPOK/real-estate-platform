import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as AuthContext from './AuthContext';

vi.mock('./AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  it('перенаправляє на /login, якщо користувач не авторизований', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ status: 'unauthenticated' });
    
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/login" element={<div>LOGIN PAGE</div>} />
          <Route path="/profile" element={<ProtectedRoute><div>PROFILE PAGE</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
    expect(screen.queryByText('PROFILE PAGE')).not.toBeInTheDocument();
  });

  it('дозволяє доступ, якщо користувач авторизований', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ status: 'authenticated' });
    
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/login" element={<div>LOGIN PAGE</div>} />
          <Route path="/profile" element={<ProtectedRoute><div>PROFILE PAGE</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('PROFILE PAGE')).toBeInTheDocument();
  });
});
