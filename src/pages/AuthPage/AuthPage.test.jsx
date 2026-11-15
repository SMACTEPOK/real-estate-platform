import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from './AuthPage';
import { AuthContext } from '@features/auth/AuthContext';

describe('AuthPage (Інтеграційний тест)', () => {
  const mockLogin = vi.fn();
  
  const renderAuthPage = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin, register: vi.fn(), status: 'unauthenticated' }}>
          <AuthPage mode="login" />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('рендерить форму входу', () => {
    renderAuthPage();
    // Використовуємо регулярний вираз, щоб не залежати від регістру
    expect(screen.getByText(/З поверненням/i)).toBeInTheDocument();
    // Шукаємо поля за їхніми label (бо placeholder у нас немає)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  it('показує помилку при порожніх полях', async () => {
    renderAuthPage();
    fireEvent.click(screen.getByRole('button', { name: /УВІЙТИ/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Заповніть email і пароль');
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('викликає функцію login при правильному заповненні', async () => {
    renderAuthPage();
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Пароль/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /УВІЙТИ/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
    });
  });
});
